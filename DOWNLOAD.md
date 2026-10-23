# 📥 Скачать готовый архив «МедиаКоми»

## Быстрый способ (рекомендуется)

### Для macOS / Linux:
```bash
chmod +x scripts/build-zip.sh
./scripts/build-zip.sh
```

### Для Windows:
```cmd
scripts\build-zip.bat
```

После выполнения в корне проекта появятся два архива:
- `mediakomi-source-YYYYMMDD.zip` — исходники для разработки
- `mediakomi-dist-YYYYMMDD.zip` — готовая сборка для деплоя

---

## Альтернативные способы

### Способ 1: Только исходники (для разработки)

**macOS/Linux:**
```bash
zip -r mediakomi-source.zip src/ public/ index.html package.json package-lock.json tsconfig.json vite.config.js README.md -x "node_modules/*" "*.log" ".DS_Store" "dist/*"
```

**Windows (PowerShell):**
```powershell
Compress-Archive -Path src, public, index.html, package.json, package-lock.json, tsconfig.json, vite.config.js, README.md -DestinationPath mediakomi-source.zip -Force
```

### Способ 2: Только готовая сборка (для деплоя)

Сначала соберите проект:
```bash
npm run build
```

Затем создайте архив:

**macOS/Linux:**
```bash
zip -r mediakomi-dist.zip dist/
```

**Windows (PowerShell):**
```powershell
Compress-Archive -Path dist -DestinationPath mediakomi-dist.zip -Force
```

### Способ 3: Через Git (если проект в репозитории)

```bash
git archive --format=zip --output=mediakomi-source.zip HEAD
```

---

## Что внутри архивов?

### 📁 mediakomi-source.zip (исходники)
```
mediakomi-source/
├── src/                    # Исходный код
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Точка входа
│   ├── index.css          # Стили
│   ├── data/              # Данные о квартирах
│   └── components/        # Компоненты
├── public/                # Статические файлы
├── index.html             # HTML-шаблон
├── package.json           # Зависимости
├── tsconfig.json          # Конфигурация TypeScript
├── vite.config.js         # Конфигурация Vite
└── README.md              # Документация
```

**Для запуска после распаковки:**
```bash
npm install
npm run dev
```

### 📁 mediakomi-dist.zip (готовая сборка)
```
mediakomi-dist/
└── dist/
    ├── index.html         # Главная страница
    └── assets/            # JS и CSS файлы
        ├── index-*.js
        └── index-*.css
```

**Для запуска:**
- Просто откройте `dist/index.html` в браузере
- Или загрузите папку `dist/` на любой хостинг (Vercel, Netlify, GitHub Pages)

---

## 🚀 Деплой готовой сборки

### Vercel (бесплатно)
```bash
npm i -g vercel
vercel --prod
```

### Netlify (бесплатно)
1. Зайдите на [netlify.com](https://netlify.com)
2. Перетащите папку `dist/` в браузер
3. Готово! Получите ссылку вида `https://random-name.netlify.app`

### GitHub Pages
```bash
npm run build
# Загрузите содержимое dist/ в ветку gh-pages
```

### Любой хостинг
Просто загрузите содержимое папки `dist/` через FTP или файловый менеджер.

---

## 📊 Размеры архивов

| Архив | Размер (приблизительно) |
|-------|------------------------|
| Исходники (source) | ~15-20 KB |
| Готовая сборка (dist) | ~50-60 KB |

Проект очень лёгкий — без тяжёлых библиотек и внешних зависимостей!

---

## ❓ Частые вопросы

**Q: Какой архив мне нужен?**
- Для разработки и изменения кода → `mediakomi-source.zip`
- Для быстрого запуска или деплоя → `mediakomi-dist.zip`

**Q: Могу ли я изменить данные о квартирах?**
Да! Отредактируйте файл `src/data/apartments.ts` в архиве с исходниками, затем пересоберите: `npm run build`

**Q: Архив не распаковывается**
- Убедитесь, что используете актуальную версию архиватора
- Попробуйте другой архиватор (7-Zip, The Unarchiver)

**Q: После распаковки npm install выдаёт ошибки**
- Убедитесь, что Node.js v18+ установлен
- Удалите `node_modules` и `package-lock.json`, затем снова `npm install`

---

## 📞 Нужна помощь?

Если возникли проблемы при скачивании или распаковке:
1. Проверьте, что все файлы на месте
2. Убедитесь, что Node.js установлен (`node --version`)
3. Попробуйте пересобрать проект: `npm run build`

Удачи с «МедиаКоми»! 🏠✨
