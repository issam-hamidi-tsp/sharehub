🔧 GUIDE DE DÉPANNAGE - PROBLÈMES COURANTS

═══════════════════════════════════════════════════════════════════════════════

AVANT DE COMMENCER

Si vous avez un problème:

1. Relisez le GUIDE_HEBERGEMENT.md complètement
2. Vérifiez les fichiers cités ci-dessous
3. Lisez ce guide de dépannage
4. 99% des problèmes sont dans ce guide

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 1: "Git n'est pas reconnu"

Symptôme:
PowerShell dit: "git : Le terme 'git' n'est pas reconnu"

Cause:
Git n'est pas installé ou pas dans le PATH

Solution:
1. Installer Git: https://git-scm.com/download/win
2. IMPORTANT: Cochez "Add Git to PATH" pendant l'installation
3. Redémarrer l'ordinateur
4. Relancer PowerShell
5. Tester: git --version

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 2: "Procfile not found" (Dans les logs Railway)

Symptôme:
Railway dit: Procfile not found ou Cannot find Procfile

Cause:
Le fichier Procfile n'existe pas ou n'a pas la bonne extension

Solution:
1. Vérifier que "Procfile" existe dans le dossier
2. IMPORTANT: Le fichier doit être nommé "Procfile" SANS ".txt"
   ❌ Mauvais: Procfile.txt
   ✅ Bon: Procfile

3. Vérifier que le contenu est exactement:
   web: node server.js

4. Pousser sur GitHub:
   git add Procfile
   git commit -m "Add Procfile"
   git push

5. Railway va redéployer automatiquement

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 3: "npm ERR! code ENOENT" (Dans les logs Railway)

Symptôme:
Railway dit: npm ERR! no such file or directory

Cause:
package.json n'existe pas ou est mal formé

Solution:
1. Vérifier que "package.json" existe dans le dossier
2. Ouvrir package.json avec Notepad
3. Vérifier que c'est du JSON valide (pas de caractères bizarres)
4. Vérifier que ça commence par { et finit par }
5. Si doute, supprimer et recreer:

   Créer un nouveau package.json avec ce contenu:

   {
     "name": "sharehub-realtime",
     "version": "1.0.0",
     "description": "Plateforme collaboratif temps réel",
     "main": "server.js",
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "socket.io": "^4.5.4",
       "multer": "^1.4.5-lts.1",
       "uuid": "^9.0.0"
     }
   }

6. Git push pour mettre à jour

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 4: "Cannot find module 'express'" (Logs Railway)

Symptôme:
Railway dit: Cannot find module 'express'

Cause:
Les dépendances npm ne sont pas installées

Solution:
C'est probablement automatique sur Railway, mais sinon:

1. Vérifier que package.json existe
2. Vérifier que dependencies contient express, socket.io, multer, uuid
3. Railway va installer automatiquement quand vous poussez

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 5: "Build failed" (Dashboard Railway)

Symptôme:
Railway montre "Build failed" en rouge

Cause:
Plusieurs possibilités

Solution A: Vérifier le Procfile
1. Assurez-vous que Procfile existe
2. Assurez-vous que le contenu est: web: node server.js
3. Git push

Solution B: Vérifier package.json
1. Assurez-vous que package.json existe
2. Assurez-vous qu'il est valide

Solution C: Regarder les logs
1. Cliquer sur le déploiement rouge
2. Cliquer l'onglet "Logs"
3. Lire le message d'erreur
4. Corriger le problème localement
5. Git push

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 6: "git push rejected"

Symptôme:
PowerShell dit: "rejected"

Cause A: Mauvais token
Solution A:
1. Aller sur GitHub → Settings → Developer settings
2. Générer un nouveau token
3. Copier
4. Relancer git push
5. Quand demandé, utiliser le nouveau token

Cause B: Repository vide sur GitHub
Solution B:
1. Vérifier que vous avez créé le repository sur GitHub
2. Vérifier que vous avez l'URL correcte
3. Vérifier que vous avez changé "VOTRENOM" par votre username

Cause C: Remote pas configuré
Solution C:
1. Vérifier que vous avez fait:
   git remote add origin https://github.com/VOTRENOM/sharehub.git
2. Vérifier l'URL avec:
   git remote -v
3. Si c'est faux, supprimer et recréer:
   git remote remove origin
   git remote add origin https://github.com/VOTRENOM/sharehub.git

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 7: "Le site se charge mais ne fonctionne pas"

Symptôme:
L'URL s'ouvre, mais le site ne marche pas correctement

Solution:

Étape 1: Vérifier localement
1. npm start
2. Tester http://localhost:3001
3. Si ça marche pas localement, c'est pas un problème de déploiement
4. Vérifier le code

Étape 2: Regarder les logs Railway
1. Railway Dashboard → Votre projet
2. Cliquer l'onglet "Logs"
3. Chercher les erreurs
4. Corriger le code
5. Git push

Étape 3: Rafraîchir (Ctrl+F5)
1. Parfois c'est du cache
2. Faire Ctrl+F5 pour vider le cache

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 8: "WebSocket/Socket.IO ne fonctionne pas"

Symptôme:
Le site se charge mais les mises à jour en temps réel ne marche pas
Ou vous voyez une erreur WebSocket dans la console

Cause:
Railway bloque les WebSockets ou configuration

Solution:

Vérifier que server.js contient:

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

C'est déjà dans votre code, donc ça devrait marcher!

Si ça marche pas:
1. Railway supporte les WebSockets
2. Regarder les logs Railway
3. Redéployer en repoussant le code

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 9: "Port déjà utilisé" (Localement)

Symptôme:
npm start dit: "EADDRINUSE: address already in use :::3000"

Cause:
Un autre processus utilise le port 3000

Solution:

Option A: Utiliser un autre port
$env:PORT=3001; npm start

Option B: Tuer le processus
Taper dans PowerShell:
Get-Process -Name node | Stop-Process

Puis: npm start

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 10: "Les fichiers ne s'uploadent pas sur Railway"

Symptôme:
Ça fonctionne localement mais pas sur Railway

Cause A: Les uploads vont à /tmp (qui est vidé au redémarrage)
Solution A:
C'est normal sur Railway. Les fichiers sont temporaires.
Ça doit s'exprimer après 5 minutes.

Cause B: Erreur de permission
Solution B:
1. Vérifier les logs Railway
2. Vérifier que le dossier uploads/ existe
3. Vérifier que server.js crée le dossier

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 11: "Comment vérifier que mon code s'est bien mis à jour?"

Solution:

Vérifier que git push a fonctionné:
1. Aller sur https://github.com/VOTRENOM/sharehub
2. Vérifier que les fichiers sont là
3. Voir la date du dernier commit

Vérifier que Railway a redéployé:
1. Aller sur Railway Dashboard
2. Cliquer sur le projet
3. Cliquer "Deployments"
4. Vérifier que y'a une nouvelle ligne
5. Attendre que le statut passe au vert

Rafraîchir le site:
1. Aller sur https://sharehub-production.up.railway.app
2. Faire Ctrl+Shift+R (vidage du cache)
3. Vérifier si la modification est là

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 12: "Erreur 'Cannot GET /api/upload'"

Symptôme:
Quand on upload, ça dit "Cannot GET /api/upload"

Cause:
C'est du navigateur (requête GET au lieu de POST)

Solution:
C'est probablement une erreur dans le code JS
Vérifier que script.js upload en POST:

fetch('/api/upload', {
  method: 'POST',
  body: formData
})

C'est déjà correct dans votre code!

═══════════════════════════════════════════════════════════════════════════════

PROBLÈME 13: "Railway me dit 'Deployment timeout'"

Symptôme:
Le déploiement prend trop longtemps et timeout

Cause:
L'application met trop de temps à démarrer

Solution:
1. Vérifier les logs pour voir où c'est bloqué
2. Simplifier server.js s'il y'a des tâches lourdes
3. Attendre quelques minutes et redéployer

═══════════════════════════════════════════════════════════════════════════════

CHECKLIST FINALE - Si RIEN ne fonctionne

Vérifier que vous avez:

□ Installer Git: https://git-scm.com
□ Créer compte GitHub: https://github.com
□ Créer repository GitHub nommé "sharehub"
□ Configurer git config globalement
□ Avoir un token GitHub
□ Avoir le fichier Procfile (sans .txt)
□ Avoir le fichier package.json
□ Avoir le fichier server.js
□ Avoir fait: git init
□ Avoir fait: git add .
□ Avoir fait: git commit
□ Avoir fait: git remote add origin
□ Avoir fait: git push
□ Créer compte Railway
□ Connecter GitHub à Railway
□ Créer un projet Railway
□ Voir le déploiement dans Railway Dashboard
□ Attendre la fin (status vert)
□ Avoir l'URL du déploiement
□ Visiter l'URL dans le navigateur

Si tout ça est fait, ça DOIT fonctionner!

═══════════════════════════════════════════════════════════════════════════════

ENCORE BESOIN D'AIDE?

1. Relire le GUIDE_HEBERGEMENT.md
2. Relire ce guide
3. Regarder les logs Railway
4. Chercher le message d'erreur dans ce guide

99% des réponses y sont! 💪
