import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const tabBtn = { background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5, padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };

const SAMPLE = `# App settings
NODE_ENV=production
PORT=4000
APP_NAME=DevCostoll

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devcostoll_db
DB_USER=admin
DB_PASSWORD=supersecret123

# Auth
JWT_SECRET=my-jwt-secret-key
JWT_EXPIRES_IN=7d`;

function parseEnv(raw) {
  const vars = [];
  raw.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    vars.push({ key, val, sensitive: /secret|password|token|key|pass|api_key/i.test(key) });
  });
  return vars;
}

export default function EnvParser() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState("table");
  const [showValues, setShowValues] = useState(false);

  const vars = useMemo(() => parseEnv(input), [input]);

  const exportOutput = vars.map(v => `export ${v.key}="${v.val}"`).join("\n");
  const dockerOutput = vars.map(v => `  - ${v.key}=${v.val}`).join("\n");
  const jsonOutput = JSON.stringify(Object.fromEntries(vars.map(v => [v.key, v.val])), null, 2);

  return (
    <div>
      <label style={fieldLabel}>.env content</label>
      <textarea style={{ ...inputStyle, height: 160 }} value={input} onChange={e => setInput(e.target.value)} />

      <div style={{ display: "flex", gap: 8, margin: "12px 0", alignItems: "center" }}>
        {[["table", "Table"], ["export", "Shell Export"], ["docker", "Docker Compose"], ["json", "JSON"]].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{ ...tabBtn, ...(mode === id ? tabBtnActive : {}) }}>{label}</button>
        ))}
        <label style={{ fontSize: 12, color: "#B7BBD0", display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <input type="checkbox" checked={showValues} onChange={e => setShowValues(e.target.checked)} />
          Show sensitive values
        </label>
      </div>

      {mode === "table" ? (
        <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "8px 14px", borderBottom: "1px solid #1F2330" }}>
            <span style={{ fontSize: 11, color: "#4E5468", textTransform: "uppercase", letterSpacing: 0.5 }}>Key</span>
            <span style={{ fontSize: 11, color: "#4E5468", textTransform: "uppercase", letterSpacing: 0.5 }}>Value</span>
          </div>
          {vars.map((v, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "7px 14px", borderBottom: "1px solid #171A24" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34E4B8" }}>{v.key}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: v.sensitive && !showValues ? "#4E5468" : "#B7BBD0" }}>
                {v.sensitive && !showValues ? "••••••••" : v.val}
                {v.sensitive && <span style={{ marginLeft: 8, fontSize: 10, color: "#F59E0B" }}>sensitive</span>}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <OutputBar
          value={mode === "export" ? exportOutput : mode === "docker" ? `environment:\n${dockerOutput}` : jsonOutput}
          label={`${vars.length} variables`}
        />
      )}
    </div>
  );
}
