import React, { useState, useEffect, useRef } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "none", outline: "none", boxSizing: "border-box", height: 220,
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const SAMPLE = `graph TD
  A[User] -->|HTTP Request| B(API Gateway)
  B --> C{Auth?}
  C -->|Valid| D[Service]
  C -->|Invalid| E[401 Error]
  D --> F[(Database)]`;

const SAMPLES = {
  flowchart: `graph TD
  A[User] -->|Request| B(API Gateway)
  B --> C{Auth?}
  C -->|Valid| D[Service]
  C -->|Invalid| E[Error]
  D --> F[(DB)]`,
  sequence: `sequenceDiagram
  participant U as User
  participant A as API
  participant D as Database
  U->>A: POST /login
  A->>D: SELECT user
  D-->>A: user data
  A-->>U: JWT token`,
  class: `classDiagram
  class User {
    +String id
    +String email
    +login()
  }
  class Order {
    +String userId
    +placeOrder()
  }
  User "1" --> "0..*" Order`,
  gantt: `gantt
  title DevCostoll Sprint
  dateFormat YYYY-MM-DD
  section Backend
  Auth API :a1, 2026-01-01, 3d
  Tool Routes :a2, after a1, 5d
  section Frontend
  Dashboard :b1, 2026-01-01, 4d
  Tool UI :b2, after b1, 7d`,
};

export default function MermaidEditor() {
  const [code, setCode] = useState(SAMPLE);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const generateUrl = () => {
    try {
      // Use mermaid.ink public renderer (no dependency needed)
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify({ code, mermaid: { theme: "dark" } }))));
      setPreviewUrl(`https://mermaid.ink/img/${encoded}`);
      setError("");
    } catch (e) {
      setError("Couldn't encode diagram: " + e.message);
    }
  };

  useEffect(() => { generateUrl(); }, [code]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {Object.entries(SAMPLES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setCode(val)}
            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", cursor: "pointer" }}
          >
            {key}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={fieldLabel}>Mermaid code</label>
          <textarea style={inputStyle} value={code} onChange={e => setCode(e.target.value)} />
        </div>
        <div>
          <label style={fieldLabel}>Preview (via mermaid.ink)</label>
          <div style={{ height: 220, background: "#fff", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Mermaid diagram"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                onError={() => setError("Preview failed — check your Mermaid syntax.")}
              />
            ) : (
              <span style={{ color: "#7A8099", fontSize: 12 }}>Loading…</span>
            )}
          </div>
        </div>
      </div>
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ {error}</div>}
      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <a href={previewUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#7C5CFF", textDecoration: "none" }}>
          Open full diagram ↗
        </a>
        <a href={`https://mermaid.live/edit#base64:${btoa(unescape(encodeURIComponent(code)))}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#34E4B8", textDecoration: "none" }}>
          Open in Mermaid Live ↗
        </a>
      </div>
    </div>
  );
}
