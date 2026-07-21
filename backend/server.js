require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");
const rateLimit = require("express-rate-limit");
const path    = require("path");
const fs      = require("fs");

const jiraRoutes  = require("./src/routes/jira");
const toolsRoutes = require("./src/routes/tools");
const aiRoutes    = require("./src/routes/ai");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 4000;

// Serve the built React app if backend/public/index.html exists.
// When it exists we're in "combined" mode — BE + FE on same port.
// When it doesn't exist we're in "dev" mode — Vite runs separately.
const STATIC_DIR   = path.join(__dirname, "public");
const COMBINED_MODE = fs.existsSync(path.join(STATIC_DIR, "index.html"));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

if (COMBINED_MODE) {
  // Same origin — no CORS needed
  app.use(cors({ origin: false }));
} else {
  // Dev mode — allow Vite dev server
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",").map(o => o.trim());
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
  }));
}

app.use(express.json({ limit: "256kb" }));

const defaultLimiter = rateLimit({
  windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false,
});
const externalApiLimiter = rateLimit({
  windowMs: 60_000, max: 15, standardHeaders: true, legacyHeaders: false,
  message: { error: "Too many requests to this endpoint. Wait a minute and try again." },
});
app.use(defaultLimiter);

// ── API routes ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "devcostoll-backend", time: new Date().toISOString(), mode: COMBINED_MODE ? "combined" : "dev" });
});
app.use("/api/jira",  externalApiLimiter, jiraRoutes);
app.use("/api/ai",    externalApiLimiter, aiRoutes);
app.use("/api/tools", toolsRoutes);

// ── Static frontend (combined mode only) ────────────────────
if (COMBINED_MODE) {
  app.use(express.static(STATIC_DIR));
  // SPA fallback — any non-API route serves index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(STATIC_DIR, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  if (COMBINED_MODE) {
    console.log(`[DevCostoll] ✅  Running at http://localhost:${PORT}  (BE + FE on same port)`);
  } else {
    console.log(`[DevCostoll] API only → http://localhost:${PORT}/api`);
    console.log(`[DevCostoll] Start frontend: cd ../frontend && npm run dev`);
  }
});
