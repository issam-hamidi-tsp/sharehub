# 🔐 Configuration Google OAuth pour ShareHub

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Donnez-lui un nom (ex: "ShareHub Auth")

## Étape 2 : Activer l'API Google+

1. Dans le menu, allez dans **APIs & Services** > **Library**
2. Recherchez **"Google+ API"**
3. Cliquez sur **Enable**

## Étape 3 : Créer des identifiants OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Si demandé, configurez l'écran de consentement OAuth :
   - Type d'application : **External**
   - Nom de l'application : **ShareHub**
   - Email d'assistance utilisateur : votre email
   - Domaines autorisés : laissez vide pour le développement
   - Informations de contact du développeur : votre email

4. Créez les identifiants OAuth :
   - Type d'application : **Web application**
   - Nom : **ShareHub Web Client**
   - **Authorized JavaScript origins** :
     - `http://localhost:3000` (développement local)
     - `https://votre-domaine.com` (production)
   - **Authorized redirect URIs** :
     - `http://localhost:3000/auth/google/callback` (développement)
     - `https://votre-domaine.com/auth/google/callback` (production)

5. Cliquez sur **Create**
6. **Copiez le Client ID et le Client Secret** qui s'affichent

## Étape 4 : Configurer les variables d'environnement

### Développement local

Créez un fichier `.env` à la racine du projet :

```env
GOOGLE_CLIENT_ID=votre_client_id_ici
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
SESSION_SECRET=une_cle_secrete_aleatoire_longue
CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### Production (Railway)

1. Allez dans le dashboard Railway
2. Sélectionnez votre projet ShareHub
3. Allez dans l'onglet **Variables**
4. Ajoutez les variables suivantes :
   ```
   GOOGLE_CLIENT_ID=votre_client_id_ici
   GOOGLE_CLIENT_SECRET=votre_client_secret_ici
   SESSION_SECRET=une_cle_secrete_aleatoire_longue
   CALLBACK_URL=https://votre-app.railway.app/auth/google/callback
   ```

⚠️ **IMPORTANT** : Remplacez `votre-app.railway.app` par votre URL Railway réelle !

## Étape 5 : Installer les dépendances

```bash
npm install
```

Les nouvelles dépendances qui ont été ajoutées :
- `express-session` : Gestion des sessions
- `passport` : Framework d'authentification
- `passport-google-oauth20` : Stratégie Google OAuth 2.0

## Étape 6 : Tester

### En local :
```bash
npm start
```

Ouvrez `http://localhost:3000` et cliquez sur "Continuer avec Google"

### En production :
Après avoir configuré les variables d'environnement sur Railway, le déploiement se fera automatiquement.

## Fonctionnement

1. **Mot de passe classique** : Fonctionne comme avant avec `OtmaneSinge`
2. **Google OAuth** : 
   - Cliquez sur "Continuer avec Google"
   - Sélectionnez votre compte Google
   - Autorisez l'application
   - Vous êtes connecté automatiquement !

## Sécurité

- Les sessions expirent après 24 heures
- Le `SESSION_SECRET` doit être une chaîne aléatoire et sécurisée
- En production, utilisez HTTPS (activé automatiquement sur Railway)
- Ne committez JAMAIS vos secrets dans Git !

## Dépannage

### Erreur "redirect_uri_mismatch"
➡️ Vérifiez que l'URL de callback dans Google Cloud Console correspond exactement à celle de votre application

### "Error 400: invalid_client"
➡️ Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont corrects

### La connexion Google ne fonctionne pas
➡️ Vérifiez les logs du serveur et assurez-vous que toutes les variables d'environnement sont définies

## Support

Si vous avez des questions, consultez :
- [Documentation Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Documentation Passport.js](http://www.passportjs.org/)
