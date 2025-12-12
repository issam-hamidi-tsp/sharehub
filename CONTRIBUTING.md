# 🛠️ CONTRIBUTING.md - Guide pour les Développeurs

## Bienvenue! 👋

Merci de votre intérêt pour ShareHub! Ce guide vous aidera à configurer votre environnement de développement.

## 📋 Prérequis

- Node.js 12+ (https://nodejs.org/)
- Git (optional)
- Un éditeur de code (VS Code recommandé)

## 🔧 Configuration du Développement

### 1. Clonez/Téléchargez le Projet

```bash
git clone <repo-url>
cd sharehub
```

### 2. Installez les Dépendances

```bash
npm install
```

### 3. Lancez en Mode Développement

```bash
npm start
```

L'application sera disponible à http://localhost:3000

## 📁 Structure du Code

```
src/
├── server.js          # Point d'entrée principal
├── public/
│   ├── index.html     # Page d'accueil
│   ├── share.html     # Page de partage
│   ├── styles.css     # Styles
│   └── script.js      # JavaScript côté client
└── uploads/           # Dossier de stockage des fichiers
```

## 🔄 Flux de Développement

### Ajouter une Nouvelle Fonctionnalité

1. **Créez une branche** (optionnel avec Git)
   ```bash
   git checkout -b feature/ma-feature
   ```

2. **Modifiez le code** selon vos besoins

3. **Testez localement**
   ```bash
   npm start
   ```

4. **Committez vos changements**
   ```bash
   git add .
   git commit -m "Ajout: description de la feature"
   git push origin feature/ma-feature
   ```

### Corriger un Bug

1. Identifiez le problème
2. Modifiez le code correspondant
3. Testez la correction
4. Committez avec message clair:
   ```bash
   git commit -m "Fix: description du bug"
   ```

## 📝 Conventions de Code

### Naming Conventions

**Variables et Fonctions:**
```javascript
// camelCase
const maxFileSize = 100;
function getUserData() { }
```

**Constantes:**
```javascript
const API_ENDPOINT = '/api/share';
const DEFAULT_PORT = 3000;
```

**HTML/CSS:**
```html
<!-- kebab-case pour les classes -->
<div class="file-upload-area"></div>
```

```css
/* kebab-case pour les classes */
.share-link-container { }
```

### Commentaires

```javascript
// Commentaire simple pour une ligne

/* 
 * Commentaire pour plusieurs lignes
 * ou explications complexes
 */

/**
 * Commentaire JSDoc pour fonctions
 * @param {String} text - Le texte à partager
 * @returns {String} L'ID du partage
 */
```

## 🧪 Testing

### Tester Manuellement

1. Lancez le serveur
2. Ouvrez http://localhost:3000
3. Testez les fonctionnalités:
   - [ ] Partager du texte
   - [ ] Partager un fichier
   - [ ] Récupérer du texte
   - [ ] Télécharger un fichier
   - [ ] Pages responsives

### Points à Tester Après Modifications

- Tous les endpoints API
- Les deux formulaires (texte et fichier)
- Récupération de contenu
- Expiration des données
- Messages d'erreur
- Responsive design

## 🎨 Personnalisation du Design

### Modifier les Couleurs

`public/styles.css` - Ligne 26:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 100%);
```

### Ajouter des Animations

```css
@keyframes myAnimation {
    from { opacity: 0; }
    to { opacity: 1; }
}

.element {
    animation: myAnimation 0.3s ease;
}
```

### Modifier la Typographie

`public/styles.css` - Ligne 15:
```css
font-family: 'Votre Police', sans-serif;
```

## 🔌 Architecture API

### Endpoints Disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/share | Partager du texte |
| GET | /api/share/:id | Récupérer le texte |
| POST | /api/upload | Uploader un fichier |
| GET | /api/download/:id | Télécharger un fichier |
| GET | /api/info/:id | Info du partage |

### Exemple d'Ajout d'Endpoint

```javascript
// Dans server.js
app.get('/api/stats', (req, res) => {
    const stats = {
        totalShares: dataStore.size,
        serverUptime: process.uptime()
    };
    res.json(stats);
});
```

## 📦 Dépendances

- **express**: Framework web
- **multer**: Upload de fichiers
- **uuid**: Génération d'IDs uniques

### Ajouter une Dépendance

```bash
npm install nouvelle-dependance
```

### Mettre à Jour les Dépendances

```bash
npm update
npm audit fix
```

## 🚀 Build pour Production

### Préparation

1. **Testez complètement**
   ```bash
   npm start
   ```

2. **Vérifiez les fichiers**
   - [ ] Pas de console.log() en production
   - [ ] Pas de fichiers temporaires
   - [ ] node_modules prêt

3. **Optimisez le code**
   - Minifiez le CSS
   - Minifiez le JavaScript
   - Optimisez les images

### Déploiement sur Heroku

```bash
# Installez Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
heroku create mon-sharehub
git push heroku main

# Vérifiez
heroku open
```

## 🐛 Debug

### VS Code Debugger

Créez `.vscode/launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Server",
            "program": "${workspaceFolder}/server.js"
        }
    ]
}
```

Puis appuyez sur F5 pour debugger.

### Console Logs Utiles

```javascript
console.log('DEBUG:', variable);
console.table(dataStore); // Affiche les données de manière lisible
console.time('operation'); 
// ... votre code
console.timeEnd('operation'); // Affiche le temps d'exécution
```

## 📚 Ressources Utiles

- [Express.js Docs](https://expressjs.com/)
- [Multer Docs](https://github.com/expressjs/multer)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Docs](https://nodejs.org/docs/)

## 💡 Idées de Contributions

### Facile (Bons Premiers PRs)
- [ ] Ajouter plus de langues
- [ ] Améliorer le CSS
- [ ] Ajouter d'autres icônes
- [ ] Documenter mieux

### Moyen
- [ ] Ajouter authentification
- [ ] Implémenter une vraie DB (MongoDB)
- [ ] Ajouter validation de formulaire
- [ ] Implémenter rate limiting

### Avancé
- [ ] Chiffrement end-to-end
- [ ] Partages avec permissions
- [ ] Dashboard utilisateur
- [ ] API REST complète

## 📋 Checklist avant PR

- [ ] Code testé localement
- [ ] Pas d'erreurs dans la console
- [ ] Commentaires ajoutés si nécessaire
- [ ] Variable bien nommées
- [ ] Design responsif vérifié
- [ ] Pas de dépendances inutiles

## 🤝 Communauté

- Créez des issues pour les bugs
- Proposez des idées
- Aidez les autres développeurs
- Partagez vos améliorations

## 📞 Contact

Pour les questions:
- Consultez la documentation
- Créez une issue
- Posez une question dans les discussions

---

**Merci de contribuer à ShareHub!** 🎉

Bon développement! 🚀
