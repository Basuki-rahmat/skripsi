#!/usr/bin/env bash
# Restore backup yang dibuat backup-db.sh.
#
# Pakai:
#   bash deploy/restore-db.sh /var/backups/skripsi/skripsi_db-20260921-020000.sql.gz
#
# PERINGATAN: menimpa seluruh isi database target dengan isi backup!
set -euo pipefail

FILE="${1:-}"
[ -n "$FILE" ] && [ -f "$FILE" ] || { echo "Pemakaian: $0 <file.sql.gz>"; exit 1; }

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -z "${DATABASE_URL:-}" ] && [ -f "$APP_DIR/.env" ]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$APP_DIR/.env" | tail -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"
fi
[ -n "${DATABASE_URL:-}" ] || { echo "ERROR: DATABASE_URL tidak ditemukan"; exit 1; }

HOST="$(echo "$DATABASE_URL" | sed -E 's|.*@([^:/]+).*|\1|')"
PORT="$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')"
USER="$(echo "$DATABASE_URL" | sed -E 's|mysql://([^:]+):.*|\1|')"
PASS="$(echo "$DATABASE_URL" | sed -E 's|mysql://[^:]+:([^@]+)@.*|\1|')"
DB="$(echo "$DATABASE_URL" | sed -E 's|.*/([^/?]+).*|\1|')"

echo "Akan MENIMPA database '$DB' di $HOST:$PORT dengan isi: $FILE"
read -r -p "Ketik nama database untuk konfirmasi: " CONFIRM
[ "$CONFIRM" = "$DB" ] || { echo "Dibatalkan."; exit 1; }

gunzip -c "$FILE" | mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASS" "$DB"
echo "✅ Restore selesai."
