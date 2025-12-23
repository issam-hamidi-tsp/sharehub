// ═══════════════════════════════════════════════════════════════
// SYSTÈME DE LOGIN
// ═══════════════════════════════════════════════════════════════

const CORRECT_PASSWORD = 'ShareHub123';
const LOGIN_KEY = 'sharehub_authenticated';
const PASSWORD_VERSION_KEY = 'sharehub_password_version';
const CURRENT_PASSWORD_VERSION = 'v3_ShareHub123'; // Changer cette valeur à chaque changement de mot de passe

// Vérifier si l'utilisateur est déjà authentifié
function checkAuthentication() {
  const loginScreen = document.getElementById('loginScreen');
  const mainContent = document.getElementById('mainContent');
  
  // Utiliser la vérification pré-chargée pour éviter le flash
  if (window.__authChecked && window.__isAuthenticated) {
    loginScreen.style.display = 'none';
    mainContent.style.display = 'block';
    document.body.classList.add('ready');
    initializeApp();
  } else {
    loginScreen.style.display = 'flex';
    mainContent.style.display = 'none';
    document.body.classList.add('ready');
  }
}

// Gérer la soumission du formulaire de login
function handleLogin(event) {
  event.preventDefault();
  
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('loginError');
  const password = passwordInput.value;
  
  if (password === CORRECT_PASSWORD) {
    localStorage.setItem(LOGIN_KEY, 'true');
    localStorage.setItem(PASSWORD_VERSION_KEY, CURRENT_PASSWORD_VERSION);
    loginError.textContent = '';
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    initializeApp();
  } else {
    loginError.textContent = '❌ Mot de passe incorrect';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// Fonction de déconnexion (optionnel)
function logout() {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
    localStorage.removeItem(LOGIN_KEY);
    location.reload();
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALISATION DE L'APPLICATION
// ═══════════════════════════════════════════════════════════════

function initializeApp() {
  // Connexion WebSocket
  const socket = io();
  window.socket = socket; // Rendre socket accessible globalement

  // Éléments DOM
  const sharedTextarea = document.getElementById('sharedText');
  const fileDropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('fileInput');
  const filesList = document.getElementById('filesList');
  const usersCount = document.getElementById('usersCount');
  const autoSaveIndicator = document.getElementById('autoSaveIndicator');
  const statusMessage = document.getElementById('statusMessage');

  // État local
  let isTyping = false;
  let typingTimeout;
  let filesRefreshTimeout = null;
  let currentFiles = [];
  let isPageVisible = true;

  // Gérer la visibilité de la page pour optimiser les rafraîchissements
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && currentFiles.length > 0) {
      // Rafraîchir l'affichage quand l'utilisateur revient sur la page
      displayFiles(currentFiles, true);
    } else if (!isPageVisible && filesRefreshTimeout) {
      // Arrêter les rafraîchissements quand l'utilisateur quitte la page
      clearTimeout(filesRefreshTimeout);
      filesRefreshTimeout = null;
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // ÉVÉNEMENTS WEBSOCKET
  // ═══════════════════════════════════════════════════════════════

  // Réception de l'état initial
  socket.on('state_update', (data) => {
    sharedTextarea.value = data.text;
    usersCount.textContent = data.users;
    // Filtrer les fichiers expirés avant affichage
    const now = new Date();
    const validFiles = data.files.filter(f => {
      if (!f.expiresAt) return true;
      return new Date(f.expiresAt) > now;
    });
    displayFiles(validFiles);
  });

  // Mise à jour du texte en temps réel
  socket.on('text_updated', (data) => {
    // Sauvegarder la position du curseur
    const cursorPos = sharedTextarea.selectionStart;
    sharedTextarea.value = data.text;
    // Restaurer la position du curseur
    sharedTextarea.selectionStart = sharedTextarea.selectionEnd = cursorPos;
  });

  // Mise à jour de la liste des fichiers
  socket.on('files_updated', (data) => {
    // Filtrer les fichiers expirés avant affichage
    const now = new Date();
    const validFiles = data.files.filter(f => {
      if (!f.expiresAt) return true;
      return new Date(f.expiresAt) > now;
    });
    displayFiles(validFiles);
  });

  // Notification de suppression automatique
  socket.on('file_auto_deleted', (data) => {
    showNotification(data.message, 'info');
  });

  // Mise à jour du nombre d'utilisateurs
  socket.on('users_count', (data) => {
    usersCount.textContent = data.count;
    showNotification(`👥 ${data.count} utilisateur(s) connecté(s)`, 'info');
  });

  // ═══════════════════════════════════════════════════════════════
  // GESTION DU TEXTE
  // ═══════════════════════════════════════════════════════════════

  // Écouter les changements de texte
  sharedTextarea.addEventListener('input', (e) => {
    isTyping = true;
    
    // Envoyer la mise à jour au serveur
    socket.emit('text_update', {
      text: sharedTextarea.value
    });
    
    // Afficher l'indicateur de sauvegarde
    autoSaveIndicator.textContent = '⏳ Sauvegarde...';
    autoSaveIndicator.classList.add('saving');
    
    // Effacer le timeout précédent
    clearTimeout(typingTimeout);
    
    // Afficher "Sauvegardé" après 1 seconde
    typingTimeout = setTimeout(() => {
      autoSaveIndicator.textContent = '✅ Sauvegardé';
      autoSaveIndicator.classList.remove('saving');
    }, 1000);
  });

  // Sélectionner tout le texte
  window.selectAllText = function() {
    sharedTextarea.select();
    showNotification('Texte sélectionné', 'info');
  };

  // Copier le texte
  window.copyText = function() {
    sharedTextarea.select();
    navigator.clipboard.writeText(sharedTextarea.value)
      .then(() => {
        showNotification('Texte copié dans le presse-papiers!', 'success');
        // Désélectionner après la copie
        sharedTextarea.selectionStart = sharedTextarea.selectionEnd = 0;
      })
      .catch(err => {
        // Fallback pour anciens navigateurs
        try {
          document.execCommand('copy');
          showNotification('Texte copié dans le presse-papiers!', 'success');
        } catch (e) {
          showNotification('Impossible de copier le texte', 'error');
        }
      });
  };

  // Coller du texte
  window.pasteText = async function() {
    try {
      // Vérifier si l'API clipboard est disponible
      if (!navigator.clipboard) {
        throw new Error('API Clipboard non disponible');
      }
      
      const text = await navigator.clipboard.readText();
      const cursorPos = sharedTextarea.selectionStart;
      const textBefore = sharedTextarea.value.substring(0, cursorPos);
      const textAfter = sharedTextarea.value.substring(sharedTextarea.selectionEnd);
      sharedTextarea.value = textBefore + text + textAfter;
      
      // Mettre à jour la position du curseur
      const newPos = cursorPos + text.length;
      sharedTextarea.selectionStart = sharedTextarea.selectionEnd = newPos;
      
      // Déclencher l'événement input pour synchroniser
      const event = new Event('input', { bubbles: true });
      sharedTextarea.dispatchEvent(event);
      
      showNotification('Texte collé!', 'success');
    } catch (err) {
      // Alternative : utiliser un champ temporaire invisible pour le collage
      const tempInput = document.createElement('textarea');
      tempInput.style.position = 'fixed';
      tempInput.style.top = '-9999px';
      tempInput.style.left = '-9999px';
      document.body.appendChild(tempInput);
      tempInput.focus();
      
      // Attendre un peu pour que le collage se fasse
      setTimeout(() => {
        try {
          document.execCommand('paste');
          const pastedText = tempInput.value;
          
          if (pastedText) {
            const cursorPos = sharedTextarea.selectionStart;
            const textBefore = sharedTextarea.value.substring(0, cursorPos);
            const textAfter = sharedTextarea.value.substring(sharedTextarea.selectionEnd);
            sharedTextarea.value = textBefore + pastedText + textAfter;
            
            const newPos = cursorPos + pastedText.length;
            sharedTextarea.selectionStart = sharedTextarea.selectionEnd = newPos;
            
            // Déclencher l'événement input pour synchroniser
            const event = new Event('input', { bubbles: true });
            sharedTextarea.dispatchEvent(event);
            
            showNotification('Texte collé!', 'success');
          } else {
            sharedTextarea.focus();
            showNotification('Utilisez Ctrl+V pour coller directement dans la zone de texte', 'info');
          }
        } catch (e) {
          sharedTextarea.focus();
          showNotification('Utilisez Ctrl+V pour coller directement dans la zone de texte', 'info');
        } finally {
          document.body.removeChild(tempInput);
        }
      }, 100);
    }
  };

  // Effacer tout le texte (sans confirmation)
  window.clearText = function() {
    sharedTextarea.value = '';
    socket.emit('text_update', { text: '' });
    showNotification('Texte effacé pour tous', 'success');
  };

  // ═══════════════════════════════════════════════════════════════
  // GESTION DES FICHIERS
  // ═══════════════════════════════════════════════════════════════

  // Drag and Drop
  fileDropZone.addEventListener('click', () => fileInput.click());

  fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.classList.add('dragover');
  });

  fileDropZone.addEventListener('dragleave', () => {
    fileDropZone.classList.remove('dragover');
  });

  fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      uploadFile(fileInput.files[0]);
    }
  });

  // Upload de fichier
  window.uploadFile = function(file) {
    if (file.size > 100 * 1024 * 1024) {
      showNotification('Fichier trop volumineux (max 100 MB)', 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    showNotification(`Envoi de ${file.name}...`, 'info');
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showNotification(`${file.name} ajouté(e)!`, 'success');
        fileInput.value = '';
        // Pas besoin de rafraîchir manuellement, le socket s'en charge
      } else {
        showNotification('Erreur lors de l\'upload', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      showNotification('Erreur: ' + err.message, 'error');
    });
  };

  // Afficher la liste des fichiers
  window.displayFiles = function(files, isRefresh = false) {
    // Annuler le timer précédent pour éviter les conflits
    if (filesRefreshTimeout) {
      clearTimeout(filesRefreshTimeout);
      filesRefreshTimeout = null;
    }
    
    // Toujours mettre à jour la liste des fichiers depuis le serveur
    currentFiles = files;
    
    if (currentFiles.length === 0) {
      filesList.innerHTML = '<p class="empty-state">Aucun fichier pour le moment</p>';
      return;
    }
    
    filesList.innerHTML = currentFiles.map(file => {
      const uploadDate = new Date(file.uploadedAt);
      const now = new Date();
      
      // Vérifier si le fichier a une date d'expiration
      let expiresText = '';
      let expiresClass = '';
      
      if (file.expiresAt) {
        const expiresDate = new Date(file.expiresAt);
        const timeLeft = Math.max(0, Math.ceil((expiresDate - now) / 1000)); // en secondes
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (timeLeft > 60) {
          expiresText = `Expire dans ${minutes}m`;
          expiresClass = 'expires-soon';
        } else if (timeLeft > 0) {
          expiresText = `Expire dans ${seconds}s`;
          expiresClass = 'expires-very-soon';
        } else {
          // Fichier expiré - ne pas l'afficher
          return '';
        }
      } else {
        // Pas de date d'expiration
        expiresText = 'Permanent';
        expiresClass = '';
      }
      
      return `
      <div class="file-item">
        <div class="file-info">
          <span class="file-icon">📄</span>
          <div class="file-details">
            <p class="file-name">${escapeHtml(file.originalName)}</p>
            <p class="file-meta">${formatFileSize(file.size)} • ${uploadDate.toLocaleTimeString('fr-FR')} • <span class="file-expires ${expiresClass}">${expiresText}</span></p>
          </div>
        </div>
        <div class="file-actions">
          <button class="btn btn-small" onclick="downloadFile('${file.id}')" title="Télécharger">
            <span>⬇️</span>
          </button>
          <button class="btn btn-small btn-danger" onclick="deleteFile('${file.id}')" title="Supprimer">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    `}).join('');
    
    // Filtrer les fichiers expirés de la liste affichée
    currentFiles = currentFiles.filter(f => {
      if (!f.expiresAt) return true;
      const expiresDate = new Date(f.expiresAt);
      return expiresDate > new Date();
    });
    
    // Mettre à jour l'affichage du temps chaque seconde seulement s'il y a des fichiers ET si la page est visible
    if (currentFiles.length > 0 && isPageVisible) {
      filesRefreshTimeout = setTimeout(() => {
        displayFiles(currentFiles, true);
      }, 1000);
    } else if (currentFiles.length === 0) {
      filesList.innerHTML = '<p class="empty-state">Aucun fichier pour le moment</p>';
    }
  };

  // Télécharger un fichier
  window.downloadFile = function(fileId) {
    window.location.href = `/api/download/${fileId}`;
  };

  // Supprimer un fichier
  window.deleteFile = function(fileId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier?\n\nLes autres utilisateurs ne pourront plus le télécharger!')) {
      fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotification('Fichier supprimé', 'success');
        } else {
          showNotification('Erreur lors de la suppression', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showNotification('Erreur: ' + err.message, 'error');
      });
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════

  // Formater la taille des fichiers
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // Afficher une notification
  function showNotification(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message show ${type}`;
    
    setTimeout(() => {
      statusMessage.classList.remove('show');
    }, 3000);
  }

  // Échapper les caractères HTML
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Charger l'état initial
  fetch('/api/state')
    .then(res => res.json())
    .then(data => {
      sharedTextarea.value = data.text;
      // Filtrer les fichiers expirés avant affichage
      const now = new Date();
      const validFiles = data.files.filter(f => {
        if (!f.expiresAt) return true;
        return new Date(f.expiresAt) > now;
      });
      displayFiles(validFiles);
      usersCount.textContent = data.users;
    })
    .catch(err => console.error(err));
}

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', checkAuthentication);

