/**
 * PM2 config — SkripsiMentor (web + bot Telegram).
 *
 * Pakai di VPS (dari root proyek):
 *   pm2 start ecosystem.config.js
 *   pm2 save && pm2 startup      # auto-start saat reboot
 *   pm2 logs                     # log gabungan
 *   pm2 restart all              # restart setelah update .env / deploy baru
 *
 * Catatan:
 * - .env dibaca otomatis oleh Next.js (web) dan dotenv (bot) — tidak perlu daftar di sini.
 * - Prasyarat: `npm install` dan `npm run build` sudah dijalankan.
 */
module.exports = {
  apps: [
    {
      name: "skripsi-web",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      out_file: "./logs/web-out.log",
      error_file: "./logs/web-err.log",
      time: true,
    },
    {
      name: "skripsi-bot",
      script: "npx",
      args: "tsx src/bot/run.ts",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "256M",
      // PENTING: bot memakai long-polling — WAJIB hanya satu instance.
      env: {
        NODE_ENV: "production",
      },
      out_file: "./logs/bot-out.log",
      error_file: "./logs/bot-err.log",
      time: true,
    },
  ],
};
