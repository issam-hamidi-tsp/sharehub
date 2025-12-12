# 🚀 DEPLOYMENT.md - Guide de Déploiement ShareHub

ShareHub peut être déployé facilement sur plusieurs plateformes. Voici comment faire.

## 🌐 Options de Déploiement

### Option 1: Heroku (Gratuit avec limitation)

#### Étapes:

1. **Installez Heroku CLI**
   - https://devcenter.heroku.com/articles/heroku-cli

2. **Créez un compte Heroku**
   - https://www.heroku.com/

3. **Connectez-vous**
   ```bash
   heroku login
   ```

4. **Créez une application**
   ```bash
   heroku create mon-sharehub
   ```

5. **Déployez le code**
   ```bash
   git push heroku main
   ```

6. **Ouvrez le site**
   ```bash
   heroku open
   ```

#### Note:
- Les fichiers uploadés sont perdus au redémarrage
- Pour persister: utilisez AWS S3 ou Cloud Storage

---

### Option 2: Railway (Recommandé)

#### Étapes:

1. **Allez sur Railway.app**
   - https://railway.app/

2. **Connectez-vous avec GitHub**

3. **Créez un nouveau projet**
   - Sélectionnez "Deploy from GitHub Repo"

4. **Sélectionnez ce repository**

5. **Railway configure tout automatiquement**
   - Détecte Node.js
   - Installe les dépendances
   - Lance `npm start`

6. **Domaine automatique**
   - Railway génère une URL unique

#### Avantages:
- Gratuit jusqu'à certains limites
- Simple et rapide
- Stockage de fichiers possible

---

### Option 3: Vercel

Vercel est optimisé pour les applications JavaScript/Node.js.

#### Étapes:

1. **Push votre code sur GitHub**

2. **Allez sur Vercel.com**
   - https://vercel.com/

3. **Connectez GitHub**

4. **Importez le repository**

5. **Configurez les variables d'environnement** (si nécessaire)

6. **Déployez**

#### Configuration:

Créez un `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

### Option 4: AWS (Scalable)

#### Étapes:

1. **Utilisez AWS EC2 ou Elastic Beanstalk**

2. **Configuration pour Elastic Beanstalk:**

   ```bash
   # Installez EB CLI
   pip install awsebcli
   
   # Initialisez
   eb init
   
   # Créez l'application
   eb create mon-sharehub
   
   # Déployez
   eb deploy
   ```

#### Avantages:
- Très scalable
- Contrôle complet
- Excellent pour la production

#### Considérations:
- Plus complexe
- Coût potentiellement plus élevé

---

### Option 5: DigitalOcean

#### Étapes:

1. **Créez un Droplet**
   - https://www.digitalocean.com/

2. **Choisissez Ubuntu 20.04 ou plus récent**

3. **SSH dans le serveur**
   ```bash
   ssh root@YOUR_IP
   ```

4. **Installez Node.js**
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

5. **Clonez le repository**
   ```bash
   git clone <repo-url>
   cd sharehub
   ```

6. **Installez les dépendances**
   ```bash
   npm install
   ```

7. **Installez PM2** (pour garder le serveur actif)
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "sharehub"
   pm2 startup
   pm2 save
   ```

8. **Configurez Nginx** (reverse proxy)
   ```bash
   sudo apt-get install nginx
   ```

   Créez `/etc/nginx/sites-available/sharehub`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Activez la configuration**
   ```bash
   sudo ln -s /etc/nginx/sites-available/sharehub /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

10. **Configurez HTTPS** (Let's Encrypt)
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

---

## 🗄️ Base de Données Persistante

### Option 1: MongoDB Atlas (Cloud)

1. **Créez un compte**
   - https://www.mongodb.com/cloud/atlas

2. **Installez le package**
   ```bash
   npm install mongoose
   ```

3. **Connectez dans server.js**
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI);
   ```

4. **Créez les modèles** pour persister les données

### Option 2: PostgreSQL

1. **Installez le package**
   ```bash
   npm install pg
   ```

2. **Configurez la connexion**

---

## 📁 Stockage de Fichiers

### Option 1: AWS S3

```bash
npm install aws-sdk
```

### Option 2: Google Cloud Storage

```bash
npm install @google-cloud/storage
```

### Option 3: Firebase Storage

```bash
npm install firebase-admin
```

---

## 🔐 Configuration Production

### Créez un `.env` de production:

```
NODE_ENV=production
PORT=3000
BASE_URL=https://votredomaine.com
MONGODB_URI=mongodb+srv://...
AWS_KEY=...
AWS_SECRET=...
```

### Sécurité:

1. **Activer HTTPS** (certificat SSL)
2. **Rate limiting**
3. **CORS configuration**
4. **Environment variables** (ne pas commiter)
5. **Logging** (pour monitoring)

---

## 📊 Monitoring

### Option 1: PM2 Plus

```bash
pm2 plus
```

### Option 2: New Relic

```bash
npm install newrelic
```

### Option 3: Sentry (pour les erreurs)

```bash
npm install @sentry/node
```

---

## ✅ Checklist Avant Déploiement

- [ ] Testez complètement localement
- [ ] Pas de console.log() en production
- [ ] Variables d'environnement configurées
- [ ] Base de données testée
- [ ] Certificats SSL/HTTPS configurés
- [ ] Backups des données
- [ ] Monitoring en place
- [ ] Error handling robuste
- [ ] Rate limiting implémenté
- [ ] Documentation à jour

---

## 🆘 Troubleshooting Déploiement

### Erreur: "Port déjà utilisé"
```bash
PORT=8080 npm start
```

### Erreur: "Module not found"
```bash
npm install
```

### Erreur: "Database connection"
Vérifiez l'URL de connexion dans `.env`

### Erreur: "CORS policy"
Configurez les headers CORS dans server.js

---

## 📞 Support

Pour les problèmes de déploiement:
- Consultez la documentation de votre plateforme
- Vérifiez les logs: `heroku logs --tail`
- Vérifiez les fichiers de configuration

---

## 💡 Pro Tips

1. **Utilisez un .gitignore** pour ne pas commiter les secrets
2. **Automatisez avec CI/CD** (GitHub Actions, GitLab CI)
3. **Utilisez des webhooks** pour auto-deployer
4. **Configurez les notifications** pour les erreurs
5. **Planifiez les sauvegardes** régulières

---

Bon déploiement! 🚀
