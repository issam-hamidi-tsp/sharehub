# 📖 Guide d'Installation ShareHub

## ✅ Étapes d'Installation

### 1️⃣ **Installer Node.js**

Node.js est nécessaire pour exécuter ce projet.

**Téléchargez et installez Node.js:**
- Allez sur https://nodejs.org/
- Téléchargez la version **LTS** (version stable)
- Exécutez l'installateur et suivez les instructions
- Acceptez les options par défaut

**Vérifiez l'installation:**
Ouvrez PowerShell ou Invite de commande et tapez:
```bash
node --version
npm --version
```

Vous devriez voir les numéros de version s'afficher.

### 2️⃣ **Installer les Dépendances**

Ouvrez PowerShell ou Invite de commande dans le dossier du projet et tapez:

```bash
npm install
```

Attendez que l'installation se termine (cela peut prendre quelques minutes).

### 3️⃣ **Lancer le Serveur**

#### Option A: Double-cliquez sur `run.bat` (Le plus simple)
C'est le fichier `run.bat` inclus. Il lancera automatiquement le serveur.

#### Option B: Via PowerShell
```bash
npm start
```

### 4️⃣ **Ouvrir dans le Navigateur**

Une fois que vous voyez:
```
🚀 Serveur lancé sur http://localhost:3000
📝 Ouvrez votre navigateur pour commencer!
```

Ouvrez votre navigateur et allez à:
```
http://localhost:3000
```

## 🎉 Vous êtes prêt!

Vous pouvez maintenant:
- 📝 Partager du texte
- 📁 Partager des fichiers
- 🔗 Générer des URLs uniques
- 💾 Récupérer du contenu depuis d'autres appareils

## ❓ Dépannage

### "npm n'est pas reconnu"
- Node.js n'est pas installé correctement
- Redémarrez votre ordinateur après installation
- Vérifiez que Node.js est dans les variables d'environnement

### "Le port 3000 est déjà utilisé"
```bash
PORT=3001 npm start
```
Puis allez à `http://localhost:3001`

### Erreurs lors de `npm install`
- Supprimez le dossier `node_modules`
- Exécutez à nouveau `npm install`

## 📱 Utiliser sur d'autres Appareils

### Sur le même réseau local:

1. Obtenez l'adresse IP de votre ordinateur
   ```bash
   ipconfig
   ```
   Cherchez "Adresse IPv4"

2. Sur l'autre appareil, allez à:
   ```
   http://VOTRE_ADRESSE_IP:3000
   ```

### Depuis Internet (Production)

Pour un usage en ligne, vous devez:
1. Louer un serveur (Heroku, AWS, DigitalOcean, etc.)
2. Uploader le projet sur le serveur
3. Installer Node.js et npm sur le serveur
4. Lancer `npm install` puis `npm start`
5. Obtenir un nom de domaine
6. Configurer HTTPS

**Ressources utiles:**
- Heroku: https://devcenter.heroku.com/articles/deploying-nodejs
- Railway: https://railway.app/
- Vercel: https://vercel.com/

## 💡 Conseils

- Gardez le terminal ouvert tant que vous utilisez le site
- Pour arrêter le serveur, appuyez sur `Ctrl + C`
- Les données sont supprimées après 24 heures
- Accédez au site via l'URL dans le navigateur

## 🆘 Besoin d'aide?

- Vérifiez que Node.js est installé: `node --version`
- Vérifiez que npm est installé: `npm --version`
- Lisez le README.md pour plus d'informations
- Assurez-vous que le port 3000 est libre

Bon partage! 🚀
