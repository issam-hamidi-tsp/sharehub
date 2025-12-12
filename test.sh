#!/bin/bash
# test.sh - Script de test pour ShareHub

echo "🧪 ShareHub - Tests de Fonctionnalité"
echo "======================================"
echo ""

# Vérifier si le serveur est accessible
echo "1️⃣ Vérification de la connexion au serveur..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Serveur accessible"
else
    echo "❌ Serveur non accessible - Assurez-vous qu'il est lancé avec 'npm start'"
    exit 1
fi

echo ""
echo "2️⃣ Test de partage de texte..."
SHARE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/share \
  -H "Content-Type: application/json" \
  -d '{"text":"Texte de test"}')

SHARE_ID=$(echo $SHARE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$SHARE_ID" ]; then
    echo "✅ Partage créé avec ID: $SHARE_ID"
    
    echo ""
    echo "3️⃣ Test de récupération de texte..."
    RETRIEVE=$(curl -s http://localhost:3000/api/share/$SHARE_ID)
    echo $RETRIEVE | grep -q "Texte de test"
    
    if [ $? -eq 0 ]; then
        echo "✅ Texte récupéré correctement"
    else
        echo "❌ Erreur lors de la récupération"
    fi
else
    echo "❌ Erreur lors de la création du partage"
fi

echo ""
echo "4️⃣ Test des pages..."
curl -s http://localhost:3000 | grep -q "ShareHub"
if [ $? -eq 0 ]; then
    echo "✅ Page d'accueil chargée"
else
    echo "❌ Page d'accueil non accessible"
fi

echo ""
echo "======================================"
echo "✨ Tests terminés!"
