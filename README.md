# DevCostoll 🛠️

A full-stack developer toolkit — 60+ browser-based dev tools with a Node.js/Express backend for live Jira lookups, AI assistance, and server-side utilities. No installation required for most tools; just open the app and start using them.

---

## What's Inside

| Area | What it does |
|------|-------------|
| **AI Assistant** | Explain, fix, format, or write tests for code via Groq (Llama 3.3). Also generates regexes and commit messages from plain English. |
| **API Studio** | REST Client, GraphQL Explorer, WebSocket Client, OpenAPI Viewer |
| **Code Tools** | JSON / YAML / XML / TOML / INI / Markdown formatters, CSS/HTML beautifier, Gzip, Text Diff, Dockerfile Linter, .gitignore Generator |
| **DevOps** | Jira Ticket Finder, Cron Builder, K8s YAML Validator, Docker Compose Helper, Conventional Commit Builder |
| **Cloud Toolkit** | AWS ARN Parser, IAM Policy Validator, Terraform Formatter, CIDR Calculator, Env File Parser |
| **Security** | JWT Decoder, Base64, Hash Generator (SHA-1/256/384/512), UUID Generator, Password Generator, AES Encrypt/Decrypt, HMAC Generator, CORS Tester |
| **Converters** | JSON ↔ YAML, JSON ↔ CSV, Unit Converter, Color Converter, Timestamp Converter, Number Base Converter |
| **Diagram Tools** | Mermaid Editor, PlantUML Renderer, ASCII Art Generator, SVG Previewer |
| **Text Utilities** | Regex Tester, Case Converter, Word Counter, Lorem Ipsum, String Escape, Line Tools |
| **File Tools** | Image Info, File Hash, File Diff, JSON → CSV |
| **Productivity** | Pomodoro Timer, Snippet Manager, Quick Notes, Checklist Builder |
| **Networking** | DNS Lookup, IP Info, User Agent Parser, HTTP Status Reference, MIME Type Lookup |

---

## Project Structure

```
devcostoll/
├── frontend/          # React + Vite + Tailwind (all browser-side tools)
│   ├── src/
│   │   ├── App.jsx              # Main app shell + sidebar navigation
│   │   ├── tools/               # One file per tool component
│   │   ├── registry/toolRegistry.js  # Master list of all tools
│   │   ├── components/          # Shared UI (OutputBar, ToolBadge)
│   │   ├── services/apiClient.ts
│   │   └── hooks/
│   └── package.json
│
└── backend/           # Node.js + Express API
    ├── server.js              # Entry point — serves API + static FE in combined mode
    ├── src/
    │   ├── routes/
    │   │   ├── tools.js        # /api/tools — hash, uuid, password, json-validate
    │   │   ├── ai.js           # /api/ai   — code assistant, regex generator (Groq)
    │   │   └── jira.js         # /api/jira — ticket lookup proxy
    │   └── middleware/
    │       ├── asyncHandler.js
    │       ├── errorHandler.js
    │       └── validate.js
    ├── public/                # Built frontend lives here (auto-detected by server.js)
    ├── .env.example
    └── package.json
```

---

## Quick Start — Development Mode (FE + BE on separate ports)

**Prerequisites:** Node.js 18 or later

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Open .env and fill in your values (see Environment Variables below)
npm run dev
```

Backend runs at **http://localhost:4000**

### 2. Frontend (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Production Build — Combined Mode (FE + BE on same port)

In combined mode the backend serves the built React app from `backend/public/`. Everything runs on a single port (4000).

### One-command build (recommended)

From the repo root:

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Build frontend and copy output into backend/public automatically
npm run build

# Start the combined server
npm start
```

Open [http://localhost:4000](http://localhost:4000) — both frontend and backend served from the same port.

You should see this in your terminal:

```
[DevCostoll] ✅  Running at http://localhost:4000  (BE + FE on same port)
```

### What each root script does

| Script | What it runs |
|--------|-------------|
| `npm run install:all` | `npm install` in both `frontend/` and `backend/` |
| `npm run build` | Vite build → then copies `frontend/dist/` into `backend/public/` |
| `npm run copy` | Copy step only (skips the Vite build) |
| `npm start` | `node backend/server.js` — starts the combined server |

### Manual steps (if you prefer)

```bash
# Step 1 — build the frontend
cd frontend && npm install && npm run build

# Step 2 — copy built files into backend
cd ..
node scripts/copy-dist.js

# Step 3 — start the server
cd backend && npm install && node server.js
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
PORT=4000

# ── Jira (optional) ────────────────────────────────────────────
# Required only for the Jira Ticket Finder tool to do live lookups.
# Without these, the tool still works — it just extracts ticket keys
# from text without fetching live status from your Jira instance.
JIRA_BASE_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=you@company.com
JIRA_API_TOKEN=your-jira-api-token-here
# Get a Jira API token at:
# https://id.atlassian.com/manage-profile/security/api-tokens

# ── Groq AI (optional) ─────────────────────────────────────────
# Required for: AI Assistant, Regex Generator, Commit Message Writer.
# Without this key those tools show a "not configured" message.
# Get a free key at: https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# ── CORS (dev only) ────────────────────────────────────────────
# Comma-separated list of origins allowed to call the API.
# Not needed in combined mode (FE and BE are same origin).
CORS_ORIGIN=http://localhost:5173
```

> **Never commit your `.env` file.** It is already in `.gitignore`.

---

## API Reference

All endpoints are prefixed with `/api`.

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness check — returns status, mode, and timestamp |

### Tools

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tools` | Lists available server-side tool endpoints |
| POST | `/api/tools/hash` | `{ "text": "...", "algo": "sha256" }` → hex hash |
| GET | `/api/tools/uuid?count=5` | Generate up to 100 cryptographic UUIDs |
| POST | `/api/tools/password` | Generate a password — see below |
| POST | `/api/tools/json-validate` | `{ "json": "..." }` → validate + pretty-print |

**Password generation — simple mode:**
```json
{ "length": 16, "charsets": ["upper", "lower", "digits", "symbols"], "prefix": "@Dev_", "suffix": "!26" }
```

**Password generation — policy mode (guarantees at least N of each type):**
```json
{ "length": 20, "policy": { "upper": 2, "lower": 2, "digits": 2, "symbols": 1 }, "prefix": "", "suffix": "" }
```

### AI (requires `GROQ_API_KEY`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/ai/status` | Whether a Groq API key is configured |
| POST | `/api/ai/assist` | `{ "code": "...", "action": "explain" }` — action: explain / fix / format / tests |
| POST | `/api/ai/regex` | `{ "description": "match a UK postcode" }` → `{ pattern, flags, explanation, examples }` |

### Jira (requires Jira credentials in `.env`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/jira/status` | Whether Jira credentials are configured |
| GET | `/api/jira/ticket/:key` | Live summary/status/assignee for one ticket (e.g. `/api/jira/ticket/PROJ-123`) |
| POST | `/api/jira/tickets` | Batch lookup — `{ "keys": ["PROJ-1", "PROJ-2"] }` (max 25) |

---

## Rate Limits

The server applies two tiers of rate limiting:

| Tier | Routes | Limit |
|------|--------|-------|
| Default | All `/api/*` routes | 60 requests / minute |
| External API | `/api/jira/*` and `/api/ai/*` | 15 requests / minute |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Icons | Lucide React, Simple Icons |
| Backend | Node.js 18+, Express 4 |
| AI | Groq API (Llama 3.3 70B) |
| Security | Helmet, express-rate-limit, CORS allowlist |
| Build | Vite (frontend only — backend is plain Node.js) |

---

## curl Examples

```bash
# Health check
curl http://localhost:4000/api/health

# Hash some text
curl -X POST http://localhost:4000/api/tools/hash \
  -H "Content-Type: application/json" \
  -d '{"text":"DevCostoll","algo":"sha256"}'

# Generate 5 UUIDs
curl "http://localhost:4000/api/tools/uuid?count=5"

# Look up a Jira ticket
curl http://localhost:4000/api/jira/ticket/PROJ-123

# Ask the AI to explain code
curl -X POST http://localhost:4000/api/ai/assist \
  -H "Content-Type: application/json" \
  -d '{"code":"const x = a ?? b","action":"explain"}'

# Generate a regex from a description
curl -X POST http://localhost:4000/api/ai/regex \
  -H "Content-Type: application/json" \
  -d '{"description":"match a date in DD/MM/YYYY format"}'
```

---

## Adding a New Tool

1. Create `frontend/src/tools/YourTool.jsx`
2. Add an entry to `frontend/src/registry/toolRegistry.js`
3. Import and wire it up in `frontend/src/App.jsx`
4. If it needs a backend endpoint, add a route file under `backend/src/routes/` and register it in `server.js`
5. Rebuild with `npm run build` from the repo root to update the combined server

---

## Security Notes

- Jira API tokens and Groq API keys are stored server-side only — the browser never sees them
- All secrets must be in `backend/.env` which is gitignored
- The backend validates and sanitizes all inputs before processing
- CORS is locked to the origins listed in `CORS_ORIGIN` (not needed in combined mode)

---

## License

MIT
