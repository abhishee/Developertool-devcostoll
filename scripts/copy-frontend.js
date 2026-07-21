/**
 * copy-frontend.js
 * Copies frontend/dist → backend/public so Express can serve the
 * React app as static files on the same port as the API.
 */
const fs   = require("fs");
const path = require("path");

const src  = path.join(__dirname, "..", "frontend", "dist");
const dest = path.join(__dirname, "..", "backend", "public");

if (!fs.existsSync(src)) {
  console.error("❌  frontend/dist not found — run `npm run build:frontend` first");
  process.exit(1);
}

// Remove old public dir
if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });

// Recursive copy
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to,   entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(src, dest);
console.log(`✅  frontend/dist → backend/public  (${fs.readdirSync(path.join(dest,"assets") || dest).length} files)`);
