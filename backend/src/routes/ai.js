const express = require("express");
const router  = express.Router();
const { asyncHandler } = require("../middleware/asyncHandler");
const { requireString, requireOneOf } = require("../middleware/validate");

const ACTIONS = {
  explain: "Explain what this code does in plain language in under 150 words.",
  fix:     "Find any bugs in this code and return the corrected version with a one-line explanation of each fix.",
  format:  "Reformat and beautify this code (consistent indentation, spacing, naming) without changing its behaviour. Return only the formatted code.",
  tests:   "Write a small set of unit tests for this code, in the same language, covering the main cases.",
};

// POST /api/ai/assist  { code, action }
router.post("/assist", asyncHandler(async (req, res) => {
  const { code, action = "explain" } = req.body || {};

  requireString(code, "code", { maxLength: 12000 });
  requireOneOf(action, "action", Object.keys(ACTIONS));

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "AI assistant is not configured on this server yet.",
      hint:  "Set GROQ_API_KEY in your backend .env file. Get one free at https://console.groq.com",
    });
  }

  // Call Groq's OpenAI-compatible chat completions endpoint
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       "llama-3.3-70b-versatile",
      max_tokens:  1024,
      temperature: 0.2,
      messages: [
        {
          role:    "system",
          content: "You are a helpful developer assistant. Be concise and precise.",
        },
        {
          role:    "user",
          content: `${ACTIONS[action]}\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
    }),
  });

  if (!r.ok) {
    const detail = await r.text();
    const err    = new Error(`Groq API returned ${r.status}: ${detail}`);
    err.publicMessage = "The AI request failed. Check your GROQ_API_KEY and try again.";
    err.status = 502;
    throw err;
  }

  const data = await r.json();
  const text = data?.choices?.[0]?.message?.content || "";

  res.json({ action, result: text });
}));

// GET /api/ai/status  — used by FE to show/hide "requires backend" badge
router.get("/status", (req, res) => {
  res.json({ configured: Boolean(process.env.GROQ_API_KEY) });
});

// POST /api/ai/regex  { description }  → { pattern, flags, explanation }
router.post("/regex", asyncHandler(async (req, res) => {
  const { description } = req.body || {};
  requireString(description, "description", { maxLength: 500 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI not configured. Set GROQ_API_KEY in backend .env" });
  }

  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are a regex expert. When given a plain-English description, respond with ONLY valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "pattern": "the regex pattern string (no surrounding slashes)",
  "flags": "recommended flags string e.g. gi or gm",
  "explanation": "one sentence explaining what the regex matches",
  "examples": ["example1 that would match", "example2 that would match"]
}
Rules:
- pattern must be valid JavaScript regex syntax
- escape backslashes properly for JSON strings (\\d not \d)
- prefer named capture groups when useful
- keep patterns as simple as possible while being correct`
        },
        {
          role: "user",
          content: `Generate a regex for: ${description}`
        }
      ],
    }),
  });

  if (!r.ok) {
    const detail = await r.text();
    const err = new Error(`Groq API returned ${r.status}: ${detail}`);
    err.publicMessage = "AI request failed. Check GROQ_API_KEY.";
    err.status = 502;
    throw err;
  }

  const data = await r.json();
  const raw  = data?.choices?.[0]?.message?.content || "{}";

  // Strip markdown code fences if model wraps in ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return res.status(502).json({ error: "AI returned invalid JSON. Try rephrasing your description.", raw: cleaned });
  }

  // Validate the pattern actually compiles
  try {
    new RegExp(parsed.pattern, parsed.flags || "g");
  } catch (e) {
    return res.status(422).json({ error: `AI generated an invalid pattern: ${e.message}`, raw: parsed.pattern });
  }

  res.json({
    pattern:     parsed.pattern,
    flags:       parsed.flags || "g",
    explanation: parsed.explanation || "",
    examples:    Array.isArray(parsed.examples) ? parsed.examples : [],
  });
}));

module.exports = router;
