import React, { useMemo, useState } from "react";

const inputStyle = { width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, resize: "vertical", outline: "none", boxSizing: "border-box" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const METHOD_COLORS = { get: "#22C55E", post: "#3B82F6", put: "#F59E0B", patch: "#F97316", delete: "#EF4444" };

const SAMPLE = `{
  "openapi": "3.0.0",
  "info": { "title": "DevCostoll API", "version": "1.0.0" },
  "paths": {
    "/api/tools": {
      "get": { "summary": "List all tools", "tags": ["Tools"] },
      "post": { "summary": "Create a tool", "tags": ["Tools"] }
    },
    "/api/tools/{id}": {
      "get": { "summary": "Get a tool by ID", "tags": ["Tools"] },
      "put": { "summary": "Update a tool", "tags": ["Tools"] },
      "delete": { "summary": "Delete a tool", "tags": ["Tools"] }
    },
    "/api/auth/login": {
      "post": { "summary": "Login", "tags": ["Auth"] }
    },
    "/api/auth/logout": {
      "post": { "summary": "Logout", "tags": ["Auth"] }
    }
  }
}`;

function parse(json) {
  try {
    const spec = JSON.parse(json);
    if (!spec.paths) return null;
    const endpoints = [];
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, op]) => {
        if (["get","post","put","patch","delete","options","head"].includes(method)) {
          endpoints.push({ path, method, summary: op.summary || "", tags: op.tags || [] });
        }
      });
    });
    return { title: spec.info?.title || "API", version: spec.info?.version || "", endpoints };
  } catch { return null; }
}

export default function OpenApiViewer() {
  const [json, setJson] = useState(SAMPLE);
  const [filter, setFilter] = useState("");
  const spec = useMemo(() => parse(json), [json]);

  const filtered = spec?.endpoints.filter(e =>
    e.path.toLowerCase().includes(filter.toLowerCase()) ||
    e.method.includes(filter.toLowerCase()) ||
    e.summary.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  return (
    <div>
      <label style={fieldLabel}>OpenAPI / Swagger JSON</label>
      <textarea style={{ ...inputStyle, height: 130 }} value={json} onChange={e => setJson(e.target.value)} />

      {spec ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 8px" }}>
            <div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#E7E9F2" }}>{spec.title}</span>
              <span style={{ marginLeft: 10, fontSize: 11, color: "#7C5CFF" }}>v{spec.version}</span>
              <span style={{ marginLeft: 10, fontSize: 11, color: "#4E5468" }}>{spec.endpoints.length} endpoints</span>
            </div>
            <input style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 6, padding: "5px 10px", color: "#E7E9F2", fontSize: 12, outline: "none" }}
              value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter…" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 320, overflowY: "auto" }}>
            {filtered.map((e, i) => {
              const c = METHOD_COLORS[e.method] || "#7A8099";
              return (
                <div key={i} style={{ background: "#0D0F16", border: "1px solid #1F2330", borderRadius: 8, padding: "9px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c, background: `${c}22`, padding: "3px 8px", borderRadius: 5, fontFamily: "monospace", minWidth: 52, textAlign: "center", textTransform: "uppercase" }}>{e.method}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#E7E9F2", flex: 1 }}>{e.path}</span>
                  <span style={{ fontSize: 12, color: "#7A8099" }}>{e.summary}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : json.trim() && (
        <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ Invalid JSON or missing "paths" field</div>
      )}
    </div>
  );
}
