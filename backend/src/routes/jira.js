const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../middleware/asyncHandler");

const TICKET_KEY_RE = /^[A-Z][A-Z0-9]{1,9}-\d+$/;

function getJiraConfig() {
  const { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;
  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) return null;
  return { baseUrl: JIRA_BASE_URL.replace(/\/$/, ""), email: JIRA_EMAIL, token: JIRA_API_TOKEN };
}

function authHeader(cfg) {
  const raw = `${cfg.email}:${cfg.token}`;
  return "Basic " + Buffer.from(raw).toString("base64");
}

// GET /api/jira/ticket/:key  -> live status/title/assignee for one ticket
router.get("/ticket/:key", asyncHandler(async (req, res) => {
  const key = req.params.key.toUpperCase();
  if (!TICKET_KEY_RE.test(key)) {
    return res.status(400).json({ error: `"${key}" doesn't look like a valid ticket key (expected e.g. PROJ-123).` });
  }

  const cfg = getJiraConfig();
  if (!cfg) {
    return res.status(503).json({
      error: "Jira isn't configured on this server yet.",
      hint: "Set JIRA_BASE_URL, JIRA_EMAIL, and JIRA_API_TOKEN in your .env file.",
    });
  }

  const url = `${cfg.baseUrl}/rest/api/3/issue/${key}?fields=summary,status,assignee,issuetype,priority`;
  const jiraRes = await fetch(url, {
    headers: { Authorization: authHeader(cfg), Accept: "application/json" },
  });

  if (jiraRes.status === 404) {
    return res.status(404).json({ error: `Ticket ${key} not found (or you don't have access to it).` });
  }
  if (jiraRes.status === 401 || jiraRes.status === 403) {
    return res.status(502).json({ error: "Jira rejected the request. Check JIRA_EMAIL / JIRA_API_TOKEN." });
  }
  if (!jiraRes.ok) {
    return res.status(502).json({ error: `Jira API returned ${jiraRes.status}` });
  }

  const data = await jiraRes.json();
  res.json({
    key,
    summary: data.fields?.summary || null,
    status: data.fields?.status?.name || null,
    type: data.fields?.issuetype?.name || null,
    priority: data.fields?.priority?.name || null,
    assignee: data.fields?.assignee?.displayName || "Unassigned",
    url: `${cfg.baseUrl}/browse/${key}`,
  });
}));

// POST /api/jira/tickets  { keys: ["PROJ-1", "PROJ-2"] } -> batch lookup
// Batches sequentially against the single-issue endpoint since Jira Cloud's
// REST v3 doesn't offer a free-text multi-get without JQL; small lists only.
router.post("/tickets", asyncHandler(async (req, res) => {
  const keys = Array.isArray(req.body?.keys) ? req.body.keys : [];
  const valid = [...new Set(keys.map((k) => String(k).toUpperCase()))].filter((k) => TICKET_KEY_RE.test(k));

  if (valid.length === 0) {
    return res.status(400).json({ error: "Provide a non-empty array of ticket keys, e.g. [\"PROJ-1\"]." });
  }
  if (valid.length > 25) {
    return res.status(400).json({ error: "Max 25 tickets per batch request." });
  }

  const cfg = getJiraConfig();
  if (!cfg) {
    return res.status(503).json({ error: "Jira isn't configured on this server yet." });
  }

  const results = await Promise.all(
    valid.map(async (key) => {
      try {
        const url = `${cfg.baseUrl}/rest/api/3/issue/${key}?fields=summary,status,assignee`;
        const r = await fetch(url, { headers: { Authorization: authHeader(cfg), Accept: "application/json" } });
        if (!r.ok) return { key, error: r.status === 404 ? "not found" : `jira error ${r.status}` };
        const data = await r.json();
        return {
          key,
          summary: data.fields?.summary || null,
          status: data.fields?.status?.name || null,
          assignee: data.fields?.assignee?.displayName || "Unassigned",
          url: `${cfg.baseUrl}/browse/${key}`,
        };
      } catch {
        return { key, error: "request failed" };
      }
    })
  );
  res.json({ count: results.length, results });
}));

// GET /api/jira/status -> whether the server has Jira credentials configured
// (used by the frontend to decide whether to show "live lookup" or just the
// local regex-based link-out).
router.get("/status", (req, res) => {
  res.json({ configured: Boolean(getJiraConfig()) });
});

module.exports = router;
