#!/bin/bash
# ============================================
# 📦 МедиаКоми — Создание ZIP-архива (macOS/Linux)
# ============================================

set -e

PROJECT_NAME="mediakomi"
VERSION=$(date +%Y%m%d)

echo "🏠 МедиаКоми — Сборка архива..."
echo ""

# 1. Сборка проекта
echo "⚙️  Сборка production-версии..."
npm run build

# 2. Архив с исходниками (для разработки)
echo "📝 Создание архива с исходниками..."
zip -r "${PROJECT_NAME}-source-${VERSION}.zip" \
  src/ \
  public/ \
  index.html \
  package.json \
  package-lock.json \
  tsconfig.json \
  vite.config.js \
  README.md \
  -x "node_modules/*" "*.log" ".DS_Store" "dist/*"

# 3. Архив с готовой сборкой (для деплоя)
echo "🚀 Создание архива с готовой сборкой..."
zip -r "${PROJECT_NAME}-dist-${VERSION}.zip" dist/

echo ""
echo "✅ Готово! Созданы архивы:"
echo "   📁 ${PROJECT_NAME}-source-${VERSION}.zip  — исходники для разработки"
echo "   📁 ${PROJECT_NAME}-dist-${VERSION}.zip    — готовая сборка для деплоя"
echo ""
echo "📋 Размеры:"
ls -lh "${PROJECT_NAME}"-*.zip | awk '{print "   " $5 "  " $9}'
echo ""
echo "🎉 Запустите 'npm run dev' для локального запуска или загрузите dist/ на хостинг"
