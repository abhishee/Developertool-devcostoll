const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { asyncHandler } = require("../middleware/asyncHandler");
const { requireString, requireOneOf, requireIntInRange, ValidationError } = require("../middleware/validate");

const CHAR_SETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnpqrstuvwxyz",
  digits: "23456789",
  symbols: "!@#$%^&*_-+=?",
};

function randomFrom(pool, count) {
  const bytes = crypto.randomBytes(count);
  return Array.from(bytes, (b) => pool[b % pool.length]);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// GET /api/tools -> registry, so any client can discover what this backend can do
router.get("/", (req, res) => {
  res.json({
    tools: [
      { id: "hash", method: "POST", path: "/api/tools/hash", desc: "Hash text with sha1/sha256/sha384/sha512" },
      { id: "uuid", method: "GET", path: "/api/tools/uuid?count=5", desc: "Generate cryptographically random UUIDs" },
      { id: "password", method: "POST", path: "/api/tools/password", desc: "Generate a password - simple or policy-based, with optional prefix/suffix" },
      { id: "json-validate", method: "POST", path: "/api/tools/json-validate", desc: "Validate + pretty-print JSON server-side" },
    ],
  });
});

router.post("/hash", asyncHandler(async (req, res) => {
  const { text, algo = "sha256" } = req.body || {};
  requireString(text, "text", { maxLength: 100000 });
  requireOneOf(algo, "algo", ["sha1", "sha256", "sha384", "sha512"]);
  const hash = crypto.createHash(algo).update(text, "utf8").digest("hex");
  res.json({ algo, hash });
}));

router.get("/uuid", (req, res) => {
  const count = requireIntInRange(req.query.count, "count", { min: 1, max: 100, fallback: 1 });
  const ids = Array.from({ length: count }, () => crypto.randomUUID());
  res.json({ count: ids.length, uuids: ids });
});

// POST /api/tools/password
// Body: { length, prefix, suffix, policy: { upper, lower, digits, symbols } }
// If `policy` is omitted, falls back to a simple mode using `charsets`
// (array of "upper"|"lower"|"digits"|"symbols") - mirrors the frontend's
// Simple / Policy-based toggle exactly, so both stay in sync.
router.post("/password", asyncHandler(async (req, res) => {
  const body = req.body || {};
  const length = requireIntInRange(body.length, "length", { min: 8, max: 128, fallback: 16 });
  const prefix = typeof body.prefix === "string" ? body.prefix.slice(0, 32) : "";
  const suffix = typeof body.suffix === "string" ? body.suffix.slice(0, 32) : "";
  const bodyLength = Math.max(length - prefix.length - suffix.length, 0);

  if (body.policy && typeof body.policy === "object") {
    const policy = {
      upper: Math.max(0, parseInt(body.policy.upper, 10) || 0),
      lower: Math.max(0, parseInt(body.policy.lower, 10) || 0),
      digits: Math.max(0, parseInt(body.policy.digits, 10) || 0),
      symbols: Math.max(0, parseInt(body.policy.symbols, 10) || 0),
    };
    const minTotal = Object.values(policy).reduce((a, b) => a + b, 0);
    if (minTotal > bodyLength) {
      throw new ValidationError(`Policy needs at least ${minTotal} characters but only ${bodyLength} are available after prefix/suffix.`);
    }
    let chars = [];
    Object.entries(policy).forEach(([k, n]) => { chars.push(...randomFrom(CHAR_SETS[k], n)); });
    const remaining = bodyLength - chars.length;
    const pool = Object.keys(policy).filter((k) => policy[k] > 0).map((k) => CHAR_SETS[k]).join("") || CHAR_SETS.lower;
    chars.push(...randomFrom(pool, remaining));
    shuffle(chars);
    return res.json({ password: prefix + chars.join("") + suffix, length, mode: "policy", policy });
  }

  const charsets = Array.isArray(body.charsets) && body.charsets.length ? body.charsets : ["upper", "lower", "digits", "symbols"];
  charsets.forEach((c) => requireOneOf(c, "charsets[]", Object.keys(CHAR_SETS)));
  const pool = charsets.map((c) => CHAR_SETS[c]).join("");
  const password = prefix + randomFrom(pool, bodyLength).join("") + suffix;
  res.json({ password, length, mode: "simple", charsets });
}));

router.post("/json-validate", asyncHandler(async (req, res) => {
  const { json } = req.body || {};
  requireString(json, "json", { maxLength: 200000 });
  try {
    const parsed = JSON.parse(json);
    res.json({ valid: true, formatted: JSON.stringify(parsed, null, 2) });
  } catch (err) {
    res.json({ valid: false, error: err.message });
  }
}));

module.exports = router;
