#!/usr/bin/env bash
# Setup one-shot untuk deploy VPS Ubuntu (asumsi: node 20+, npm, mariadb sudah terpasang).
# Pakai: bash deploy/setup-vps.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_USER="${SUDO_USER:-$USER}"

echo "==> 1/7 Log dir & izin"
sudo mkdir -p /var/log/skripsi
sudo chown "$APP_USER":"$APP_USER" /var/log/skripsi

echo "==> 2/7 Dependencies"
# DevDeps ikut dipasang: bot runtime butuh tsx
cd "$APP_DIR"
npm ci

echo "==> 3/7 Prisma client generate"
npx prisma generate

echo "==> 4/7 Migrasi database (deploy, tidak me-reset data)"
npx prisma migrate deploy

echo "==> 5/7 Seed (idempotent — aman diulang)"
npm run seed

echo "==> 6/7 Build"
npm run build

echo "==> 7/7 Pasang systemd units"
sudo cp deploy/skripsi-web.service deploy/skripsi-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now skripsi-web.service skripsi-bot.service
systemctl --no-pager --lines=3 status skripsi-web.service skripsi-bot.service || true

echo ""
echo "✅ Selesai. Cek: systemctl status skripsi-web skripsi-bot"
echo "   Log: /var/log/skripsi/*.log — pastikan .env sudah diisi dengan nilai produksi!"
