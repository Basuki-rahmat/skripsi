import "dotenv/config";
import { startBot } from "./index";

startBot().catch((err) => {
  console.error("Bot gagal dijalankan:", err);
  process.exit(1);
});