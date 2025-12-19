const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Configuration Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const CALLBACK_URL = process.env.CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`;

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'sharehub-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configuration Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // Ici vous pouvez sauvegarder l'utilisateur dans une base de données
    // Pour l'instant, on retourne simplement le profil
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public'));

// Storage pour les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// État partagé global
const sharedSpace = {
  text: '',
  files: [],
  users: 0
};

// Routes d'authentification Google

// Démarrer l'authentification Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback Google
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Authentification réussie
    res.redirect('/?googleAuth=success');
  }
);

// Vérifier si l'utilisateur est authentifié
app.get('/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        displayName: req.user.displayName,
        email: req.user.emails?.[0]?.value,
        photo: req.user.photos?.[0]?.value
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Déconnexion
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

// Routes API

// Récupérer le texte partagé actuel
app.get('/api/text', (req, res) => {
  res.json({ text: sharedSpace.text });
});

// Récupérer la liste des fichiers
app.get('/api/files', (req, res) => {
  res.json({ files: sharedSpace.files });
});

// Récupérer un fichier
app.get('/api/download/:fileId', (req, res) => {
  const file = sharedSpace.files.find(f => f.id === req.params.fileId);
  
  if (!file) {
    return res.status(404).json({ error: 'Fichier non trouvé' });
  }
  
  res.download(file.path, file.originalName);
});

// Supprimer un fichier
app.delete('/api/files/:fileId', (req, res) => {
  const index = sharedSpace.files.findIndex(f => f.id === req.params.fileId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Fichier non trouvé' });
  }
  
  const file = sharedSpace.files[index];
  
  // Supprimer le fichier du système
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
  
  // Supprimer de la liste
  sharedSpace.files.splice(index, 1);
  
  // Notifier tous les clients
  io.emit('files_updated', { files: sharedSpace.files });
  
  res.json({ success: true });
});

// Upload de fichier
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  
  const fileObj = {
    id: uuidv4(),
    originalName: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    uploadedAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expire après 5 minutes
    mimeType: req.file.mimetype
  };
  
  sharedSpace.files.push(fileObj);
  
  // Notifier tous les clients
  io.emit('files_updated', { files: sharedSpace.files.map(f => ({
    id: f.id,
    originalName: f.originalName,
    size: f.size,
    uploadedAt: f.uploadedAt,
    expiresAt: f.expiresAt
  })) });
  
  res.json({ 
    success: true,
    file: fileObj
  });
});

// Récupérer l'état initial
app.get('/api/state', (req, res) => {
  res.json({
    text: sharedSpace.text,
    files: sharedSpace.files.map(f => ({
      id: f.id,
      originalName: f.originalName,
      size: f.size,
      uploadedAt: f.uploadedAt
    })),
    users: sharedSpace.users
  });
});

// WebSockets pour temps réel
io.on('connection', (socket) => {
  console.log(`Nouvel utilisateur: ${socket.id}`);
  sharedSpace.users++;
  
  // Envoyer l'état actuel au nouvel utilisateur
  socket.emit('state_update', {
    text: sharedSpace.text,
    files: sharedSpace.files.map(f => ({
      id: f.id,
      originalName: f.originalName,
      size: f.size,
      uploadedAt: f.uploadedAt
    })),
    users: sharedSpace.users
  });
  
  // Notifier tous les clients du nombre d'utilisateurs
  io.emit('users_count', { count: sharedSpace.users });
  
  // Écouter les mises à jour de texte
  socket.on('text_update', (data) => {
    sharedSpace.text = data.text;
    // Diffuser à tous SAUF à l'émetteur (pour éviter l'écho)
    socket.broadcast.emit('text_updated', { text: sharedSpace.text });
  });
  
  // Écouter la déconnexion
  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
    sharedSpace.users--;
    io.emit('users_count', { count: sharedSpace.users });
  });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Nettoyage automatique des fichiers expirés (tous les 10 secondes)
setInterval(() => {
  const now = new Date();
  const filesToDelete = sharedSpace.files.filter(f => f.expiresAt < now);
  
  // Supprimer les fichiers du système de fichiers
  filesToDelete.forEach(file => {
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Fichier expiré supprimé: ${file.originalName}`);
    }
  });
  
  // Mettre à jour la liste
  if (filesToDelete.length > 0) {
    sharedSpace.files = sharedSpace.files.filter(f => f.expiresAt >= now);
    
    // Notifier tous les clients
    io.emit('files_updated', { files: sharedSpace.files.map(f => ({
      id: f.id,
      originalName: f.originalName,
      size: f.size,
      uploadedAt: f.uploadedAt,
      expiresAt: f.expiresAt
    })) });
    
    io.emit('file_auto_deleted', { 
      count: filesToDelete.length,
      message: `${filesToDelete.length} fichier(s) expiré(s) supprimé(s) automatiquement`
    });
  }
}, 10 * 1000); // Vérifier toutes les 10 secondes

server.listen(PORT, () => {
  console.log(`\n🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`📝 Espace collaboratif prêt!`);
  console.log(`👥 Les utilisateurs connectés voient les mêmes contenus en temps réel`);
  console.log(`⏰ Les fichiers expirent après 5 minutes d'inactivité\n`);
});

