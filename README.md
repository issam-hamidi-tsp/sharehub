# 🔗 ShareHub - Partage de Texte et Fichiers

Une plateforme web moderne et élégante pour partager du texte et des fichiers simplement via une URL. Parfait pour transférer du contenu entre appareils sans passer par email ou applications tiers.

## ✨ Fonctionnalités

- 📝 **Partage de Texte** - Partagez du texte simplement en le collant
- 📁 **Partage de Fichiers** - Uploadez des fichiers jusqu'à 100 MB
- 🔗 **URL Unique** - Chaque partage génère une URL unique et facilement mémorisable
- ⏰ **Expiration Automatique** - Les données sont supprimées après 24 heures
- 🎨 **Interface Moderne** - Design magnifique avec dégradés et animations fluides
- 📱 **Responsive** - Fonctionne sur tous les appareils (mobile, tablette, desktop)
- 🔒 **Sécurité** - Données temporaires, supprimées automatiquement

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (v12 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Clonez ou téléchargez le projet**

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Lancez le serveur**
   ```bash
   npm start
   ```

4. **Ouvrez le navigateur**
   ```
   http://localhost:3000
   ```

## 📖 Utilisation

### Partager du Texte

1. Allez sur le site
2. Dans l'onglet "Texte", collez votre texte
3. Cliquez sur "Générer le lien"
4. Copiez l'URL générée
5. Partagez l'URL avec qui vous voulez
6. L'autre personne ouvre l'URL et récupère le contenu

### Partager un Fichier

1. Allez sur le site
2. Allez dans l'onglet "Fichier"
3. Déposez un fichier ou cliquez pour le sélectionner
4. Cliquez sur "Générer le lien"
5. Copiez l'URL générée
6. Partagez l'URL
7. L'autre personne peut télécharger le fichier

### Récupérer du Contenu

**Méthode 1 : Via l'URL**
1. Ouvrez directement l'URL dans le navigateur
2. Le contenu s'affiche automatiquement
3. Copiez le texte ou téléchargez le fichier

**Méthode 2 : Via le formulaire**
1. Collez l'URL dans le champ "Récupérer"
2. Le contenu s'affiche
3. Copiez ou téléchargez

## 🛠️ Configuration

### Port personnalisé

Pour utiliser un port différent :
```bash
PORT=8080 npm start
```

### Limite de taille des fichiers

Modifiez dans `server.js` (ligne ~30) :
```javascript
limits: { fileSize: 100 * 1024 * 1024 } // Changez 100 à votre valeur en MB
```

### Temps d'expiration

Modifiez dans `server.js` (lignes ~50 et ~110) :
```javascript
expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Changez 24 à votre valeur en heures
```

## 📁 Structure du Projet

```
ShareHub/
├── server.js              # Serveur Express
├── package.json           # Dépendances npm
├── public/
│   ├── index.html         # Page d'accueil
│   ├── share.html         # Page de partage dynamique
│   ├── styles.css         # Styles modernes
│   └── script.js          # JavaScript côté client
└── uploads/               # Dossier de stockage des fichiers (créé automatiquement)
```

## 🔌 API

### POST /api/share
Partager du texte
```bash
curl -X POST http://localhost:3000/api/share \
  -H "Content-Type: application/json" \
  -d '{"text":"Mon texte"}'
```

**Réponse:**
```json
{
  "id": "abc12345",
  "url": "http://localhost:3000/abc12345",
  "expiresIn": "24 hours"
}
```

### GET /api/share/:id
Récupérer le texte partagé
```bash
curl http://localhost:3000/api/share/abc12345
```

### POST /api/upload
Uploader un fichier
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@monfile.pdf"
```

### GET /api/download/:id
Télécharger un fichier

### GET /api/info/:id
Obtenir les infos du partage

## 🎨 Personnalisation du Design

### Couleurs
Modifiez le dégradé dans `styles.css` (ligne ~26) :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 100%);
```

### Fonts
Modifiez dans `styles.css` (ligne ~15) :
```css
font-family: 'Votre Police', sans-serif;
```

## 💾 Stockage

Actuellement, le projet utilise :
- **Base de données en mémoire** pour les métadonnées
- **Système de fichiers** pour les uploads

Pour la production, envisagez :
- **MongoDB** ou **PostgreSQL** pour les données
- **Cloud Storage** (AWS S3, Google Cloud Storage) pour les fichiers

## 🔐 Sécurité

### Points à considérer :
- Ajoutez une authentification si nécessaire
- Validez les entrées utilisateur
- Utilisez HTTPS en production
- Limitez les tailles de fichiers
- Implémentez un rate limiting

## 🐛 Dépannage

**Erreur "Port déjà utilisé"**
```bash
# Changez le port
PORT=3001 npm start
```

**Les fichiers ne s'uploadent pas**
- Vérifiez la limite de taille
- Assurez-vous que le dossier `uploads/` a les permissions d'écriture

**Erreur CORS**
- Assurez-vous d'être sur localhost:3000

## 📝 Licence

MIT - Libre d'utilisation

## 👤 Auteur

Créé avec ❤️ pour simplifier le partage

## 🎯 Améliorations Futures

- [ ] Authentification utilisateur
- [ ] Dashboard personnel
- [ ] Historique des partages
- [ ] Partages protégés par mot de passe
- [ ] Base de données persistante
- [ ] Statistiques d'accès
- [ ] Commentaires sur les fichiers
- [ ] Partages avec expiration personnalisée

---

**Besoin d'aide ?** Consultez la documentation ou créez une issue sur le projet.
