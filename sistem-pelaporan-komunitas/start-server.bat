@echo off
title Sistem Pelaporan Komunitas - Server
cd /d "%~dp0"

if not exist node_modules (
  echo Menginstal dependensi terlebih dahulu...
  call npm install
)

if not exist ".env" (
  echo Tidak menemukan file .env. Salin dari .env.example lalu isi DATABASE_URL dan AUTH_SECRET.
  pause
  exit /b 1
)

echo Memastikan client Prisma tersedia...
if not exist "src\generated\prisma\client.ts" (
  call npx prisma generate
)

echo Menjalankan aplikasi di http://localhost:3001
start "" http://localhost:3001
call npm run dev

pause