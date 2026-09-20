#!/usr/bin/env bash
# Backup database SkripsiMentor (mysqldump + gzip + rotasi).
#
# Pasang di VPS via cron (contoh: setiap hari jam 02.00, simpan 14 hari):
#   sudo crontab -e
#   0 2 * * * /var/www/skripsi/deploy/backup-db.sh >> /var/log/skripsi/backup.log 2>&1
#
# Env yang dipakai (baca otomatis dari .env proyek jika tidak di-export):
#   DATABASE_URL="mysql://user:pass@localhost:3306/skripsi_db"
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/skripsi}"
RETAIN_DAYS="${RETAIN_DAYS:-14}"

# Baca DATABASE_URL dari .env jika belum di-set di environment
if [ -z "${DATABASE_URL:-}" ] && [ -f "$APP_DIR/.env" ]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$APP_DIR/.env" | tail -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
[ -n "${DATABASE_URL:-}" ] || { echo "ERROR: DATABASE_URL tidak ditemukan (.env atau env)"; exit 1; }

HOST="$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')"
PORT="$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')"
USER="$(echo "$DATABASE_URL" | sed -E 's|mysql://([^:]+):.*|\1|')"
PASS="$(echo "$DATABASE_URL" | sed -E 's|mysql://[^:]+:([^@]+)@.*|\1|')"
DB="$(echo "$DATABASE_URL" | sed -E 's|.*/([^/?]+).*|\1|')"

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="$BACKUP_DIR/${DB}-${STAMP}.sql.gz"

echo "[$(date '+%F %T')] Backup $DB -> $OUT"
mysqldump -h "$HOST" -P "$PORT" -u "$USER" -p"$PASS" \
  --single-transaction --quick --routines --triggers \
  "$DB" | gzip -9 > "$OUT"

SIZE="$(du -h "$OUT" | cut -f1)"
echo "[$(date '+%F %T')] Selesai ($SIZE). Rotasi: hapus backup > ${RETAIN_DAYS} hari"
find "$BACKUP_DIR" -name "${DB}-*.sql.gz" -mtime +"$RETAIN_DAYS" -delete
echo "[$(date '+%F %T')] OK"
