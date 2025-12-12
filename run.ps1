#!/bin/bash
# Configuration du projet ShareHub pour Windows PowerShell

# Ce script aide à installer et configurer ShareHub

Write-Host ""
Write-Host "========================================"
Write-Host "  ShareHub - Plateforme de Partage     "
Write-Host "========================================"
Write-Host ""

# Vérifier si Node.js est installé
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($null -eq $nodeCheck) {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Veuillez installer Node.js depuis https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Après l'installation, relancez ce script."
    Write-Host ""
    exit 1
}

Write-Host "✅ Node.js détecté: $(node --version)" -ForegroundColor Green
Write-Host "✅ npm détecté: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Installer les dépendances
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Tout est prêt!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur
npm start
