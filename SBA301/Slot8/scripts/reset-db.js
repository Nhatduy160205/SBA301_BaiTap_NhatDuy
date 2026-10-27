import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.resolve(__dirname, "../db.seed.json");
const targetPath = path.resolve(__dirname, "../db.json");

try {
  fs.copyFileSync(seedPath, targetPath);
  console.log("Successfully reset db.json from db.seed.json clean state.");
} catch (error) {
  console.error("Failed to reset database:", error.message);
  process.exit(1);
}
