# DevCostoll Backend

Node.js + Express API powering the live parts of DevCostoll: a Jira issue
lookup proxy (so API tokens never sit in the browser) and a few server-side
mirrors of the client-side dev tools.

## Stack
- Node.js 18+ (uses the built-in `fetch`)
- Express 4
- `crypto` (Node core) for hashing / UUIDs / passwords
- `dotenv` for config, `cors` + `express-rate-limit` for basic hardening

## Setup

```bash
cd devcostoll-backend
npm install
cp .env.example .env
# edit .env: set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN
npm start
```

Server runs on `http://localhost:4000` by default.

Get a Jira API token at:
https://id.atlassian.com/manage-profile/security/api-tokens

## Endpoints

| Method | Path                        | Description                                    |
|--------|-----------------------------|-------------------------------------------------|
| GET    | `/api/health`               | Liveness check                                   |
| GET    | `/api/jira/status`          | Whether Jira credentials are configured          |
| GET    | `/api/jira/ticket/:key`     | Live summary/status/assignee for one ticket      |
| POST   | `/api/jira/tickets`         | Batch lookup — body `{ "keys": ["PROJ-1"] }`     |
| GET    | `/api/tools`                | List of available server-side tool endpoints     |
| POST   | `/api/tools/hash`           | `{ "text": "...", "algo": "sha256" }`            |
| GET    | `/api/tools/uuid?count=5`   | Bulk UUID generation                             |
| POST   | `/api/tools/password`       | See below — simple or policy-based generation    |
| POST   | `/api/tools/json-validate`  | `{ "json": "..." }` → validate + pretty-print    |
| POST   | `/api/ai/assist`            | `{ "code": "...", "action": "explain" }` → Claude|
| GET    | `/api/ai/status`            | Whether an Anthropic API key is configured       |

### POST /api/tools/password

```json
// Simple mode
{ "length": 16, "prefix": "@Dev_", "suffix": "!26", "charsets": ["upper","lower","digits","symbols"] }

// Policy-based mode — guarantees at least N of each character type
{ "length": 20, "prefix": "", "suffix": "", "policy": { "upper": 2, "lower": 2, "digits": 2, "symbols": 1 } }
```
The frontend's Password Generator tool calls this same endpoint when its
"generate via backend" toggle is on, so both the client-side and
server-side implementations follow identical rules.

## Security hardening in this backend

- **`helmet`** — sets standard security headers (no separate config needed for local dev)
- **`morgan`** — request logging (`dev` format locally, `combined` in production)
- **Two-tier rate limiting** — 60 req/min for local utility routes, a tighter 15 req/min specifically on `/api/jira/*` and `/api/ai/*` since those call paid/rate-limited third-party APIs
- **Shared `asyncHandler`** (`src/middleware/asyncHandler.js`) — every route uses the same wrapper for catching async errors, instead of each file repeating its own try/catch
- **Shared `validate` helpers** (`src/middleware/validate.js`) — every route validates input the same way (`requireString`, `requireOneOf`, `requireIntInRange`), so a new route follows the existing pattern instead of inventing a new one
- **CORS allowlist** — only origins listed in `CORS_ORIGIN` can call this API
- Secrets (Jira token, Anthropic key) never leave the server — the browser only ever talks to this backend, never directly to Jira or Anthropic

## Example

```bash
curl http://localhost:4000/api/jira/ticket/DEVC-142

curl -X POST http://localhost:4000/api/tools/hash \
  -H "Content-Type: application/json" \
  -d '{"text":"DevCostoll","algo":"sha256"}'
```

## Why a backend at all

The React frontend can do JSON formatting, hashing, Base64, etc. entirely in
the browser — no server needed for those. But a real Jira lookup needs an API
token with access to your Jira site, and that token must never be exposed to
the browser (anyone could read it from devtools and hit your Jira as you).
This backend holds the token server-side and exposes a narrow proxy endpoint
instead, which is the standard pattern for wiring a frontend to any
third-party API that requires a secret.

## Next steps (not built yet)
- Persist recent lookups / snippets in a database (SQLite or Postgres)
- Auth (JWT) if this becomes multi-user
- Deploy as an AWS Lambda behind API Gateway (fits your existing AWS stack)
