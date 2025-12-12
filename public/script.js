// Connexion WebSocket
const socket = io();

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

// ═══════════════════════════════════════════════════════════════
// ÉVÉNEMENTS WEBSOCKET
// ═══════════════════════════════════════════════════════════════

// Réception de l'état initial
socket.on('state_update', (data) => {
  sharedTextarea.value = data.text;
  usersCount.textContent = data.users;
  displayFiles(data.files);
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
  displayFiles(data.files);
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

// Effacer tout le texte
function clearText() {
  if (confirm('Êtes-vous sûr de vouloir effacer tout le texte?\n\nCela affectera TOUS les utilisateurs connectés!')) {
    sharedTextarea.value = '';
    socket.emit('text_update', { text: '' });
    showNotification('Texte effacé pour tous', 'success');
  }
}

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
function uploadFile(file) {
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
    } else {
      showNotification('Erreur lors de l\'upload', 'error');
    }
  })
  .catch(err => {
    console.error(err);
    showNotification('Erreur: ' + err.message, 'error');
  });
}

// Afficher la liste des fichiers
function displayFiles(files) {
  if (files.length === 0) {
    filesList.innerHTML = '<p class="empty-state">Aucun fichier pour le moment</p>';
    return;
  }
  
  filesList.innerHTML = files.map(file => {
    const uploadDate = new Date(file.uploadedAt);
    const expiresDate = new Date(file.expiresAt);
    const now = new Date();
    const timeLeft = Math.max(0, Math.ceil((expiresDate - now) / 1000)); // en secondes
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    let expiresText = '';
    let expiresClass = '';
    if (timeLeft > 60) {
      expiresText = `Expire dans ${minutes}m`;
      expiresClass = 'expires-soon';
    } else if (timeLeft > 0) {
      expiresText = `Expire dans ${seconds}s`;
      expiresClass = 'expires-very-soon';
    } else {
      expiresText = 'Expiré';
      expiresClass = 'expired';
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
  
  // Mettre à jour l'affichage du temps chaque seconde
  setTimeout(() => {
    displayFiles(files);
  }, 1000);
}

// Télécharger un fichier
function downloadFile(fileId) {
  window.location.href = `/api/download/${fileId}`;
}

// Supprimer un fichier
function deleteFile(fileId) {
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
}

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
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/state')
    .then(res => res.json())
    .then(data => {
      sharedTextarea.value = data.text;
      displayFiles(data.files);
      usersCount.textContent = data.users;
    })
    .catch(err => console.error(err));
});

