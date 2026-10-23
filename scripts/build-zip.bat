@echo off
REM ============================================
REM 📦 МедиаКоми — Создание ZIP-архива (Windows)
REM ============================================

setlocal enabledelayedexpansion

set PROJECT_NAME=mediakomi
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set VERSION=%datetime:~0,8%

echo.
echo 🏠 МедиаКоми — Сборка архива...
echo.

REM 1. Сборка проекта
echo ⚙️  Сборка production-версии...
call npm run build
if errorlevel 1 (
    echo ❌ Ошибка сборки! Проверьте, что зависимости установлены (npm install)
    pause
    exit /b 1
)

REM 2. Удаляем старые архивы
if exist "%PROJECT_NAME%-source-*.zip" del "%PROJECT_NAME%-source-*.zip"
if exist "%PROJECT_NAME%-dist-*.zip" del "%PROJECT_NAME%-dist-*.zip"

REM 3. Архив с исходниками (для разработки)
echo 📝 Создание архива с исходниками...
powershell -Command "Compress-Archive -Path 'src','public','index.html','package.json','package-lock.json','tsconfig.json','vite.config.js','README.md' -DestinationPath '%PROJECT_NAME%-source-%VERSION%.zip' -Force"

REM 4. Архив с готовой сборкой (для деплоя)
echo 🚀 Создание архива с готовой сборкой...
powershell -Command "Compress-Archive -Path 'dist' -DestinationPath '%PROJECT_NAME%-dist-%VERSION%.zip' -Force"

echo.
echo ✅ Готово! Созданы архивы:
echo    📁 %PROJECT_NAME%-source-%VERSION%.zip  — исходники для разработки
echo    📁 %PROJECT_NAME%-dist-%VERSION%.zip    — готовая сборка для деплоя
echo.
echo 📋 Размеры:
dir /a-d "%PROJECT_NAME%-*.zip" | findstr /i ".zip"
echo.
echo 🎉 Запустите 'npm run dev' для локального запуска или загрузите dist/ на хостинг
echo.
pause
