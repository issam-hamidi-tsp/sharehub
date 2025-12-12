## 🚀 Démarrage Rapide ShareHub

### Pour les Pressés (30 secondes)

1. **Installer Node.js**
   - https://nodejs.org/ → Version LTS
   - Installez et redémarrez

2. **Installer ShareHub**
   ```bash
   npm install
   ```

3. **Lancer ShareHub**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

✅ C'est fait! Vous pouvez maintenant partager du texte et des fichiers.

---

### Version la Plus Simple (Windows)

**Double-cliquez simplement sur `run.bat`** et c'est tout!

---

### Partager sur le Même Réseau

1. Obtenez votre adresse IP:
   ```bash
   ipconfig
   ```
   Cherchez "Adresse IPv4" (ex: 192.168.1.100)

2. Depuis un autre appareil, allez à:
   ```
   http://192.168.1.100:3000
   ```

---

### Commandes Utiles

```bash
# Installer les dépendances
npm install

# Lancer le serveur
npm start

# Lancer sur un port différent
PORT=8080 npm start

# Arrêter le serveur
Ctrl + C
```

---

### Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| "npm n'est pas reconnu" | Installez Node.js https://nodejs.org/ |
| "Port déjà utilisé" | `PORT=3001 npm start` |
| "Pas de réponse" | Vérifiez http://localhost:3000 |
| "Fichiers ne s'upload pas" | Redémarrez le serveur |

---

**Besoin d'aide détaillée?** Consultez `INSTALLATION.md` ou `README.md`

Bon partage! 🎉
