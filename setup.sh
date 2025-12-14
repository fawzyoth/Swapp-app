#!/bin/bash
echo "🚀 Configuration de la plateforme d'échange..."
echo ""

echo "📦 Nettoyage des dépendances..."
rm -rf node_modules package-lock.json

echo "📥 Installation des dépendances..."
npm install --force

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Pour démarrer l'application:"
echo "  npm run dev"
echo ""
echo "Puis ouvrez: http://localhost:5173"
