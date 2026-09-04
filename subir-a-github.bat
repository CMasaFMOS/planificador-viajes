@echo off
cd /d "%~dp0"

if not exist ".git" (
  echo Configurando conexion con GitHub por primera vez...
  git init
  git remote add origin https://github.com/CMasaFMOS/planificador-viajes.git
  git fetch origin
  git checkout -B main origin/main
)

echo.
echo Subiendo cambios a GitHub...
git add -A
git commit -m "Actualizacion del planificador"
git push origin main

echo.
echo Listo. Vercel deberia desplegar los cambios en un minuto.
pause
