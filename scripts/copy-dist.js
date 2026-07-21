/**
 * copy-dist.js
 * Copies frontend/dist/* → backend/public/
 * Cross-platform (Windows, macOS, Linux) — no extra dependencies.
 *
 * Run via: node scripts/copy-dist.js
 * Or via:  npm run copy  (from the repo root)
 */

const fs   = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC  = path.join(ROOT, "frontend", "dist");
const DEST = path.join(ROOT, "backend", "public");

if (!fs.existsSync(SRC)) {
  console.error("❌  frontend/dist not found. Run `npm run build` first (or `npm run build --prefix frontend`).");
  process.exit(1);
}

// Recursively copy a directory
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`📦  Copying  frontend/dist  →  backend/public ...`);
copyDir(SRC, DEST);
console.log(`✅  Done! backend/public is ready.`);
console.log(`▶   Start the server: npm start   (or cd backend && node server.js)`);
