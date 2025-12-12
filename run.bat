@echo off
echo.
echo ========================================
echo ShareHub - Plateforme de Partage
echo ========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé!
    echo.
    echo Veuillez installer Node.js depuis https://nodejs.org/
    echo Après l'installation, relancez ce fichier.
    echo.
    pause
    exit /b 1
)

REM Vérifier si npm est installé
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé!
    pause
    exit /b 1
)

REM Installer les dépendances si node_modules n'existe pas
if not exist "node_modules\" (
    echo 📦 Installation des dépendances...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation
        pause
        exit /b 1
    )
)

echo.
echo ✅ Tout est prêt!
echo.
echo 🚀 Démarrage du serveur...
echo.

REM Démarrer le serveur
call npm start

pause
