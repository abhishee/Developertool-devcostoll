import React, { useState } from "react";

const fieldStyle = {
  width: "100%",
  background: "#0D0F16",
  border: "1px solid #232735",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#E7E9F2",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5,
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#7C5CFF",
  border: "none",
  color: "#0A0C10",
  fontWeight: 600,
  fontSize: 12.5,
  padding: "8px 14px",
  borderRadius: 7,
  cursor: "pointer",
};

export default function GraphqlExplorer() {
  const [endpoint, setEndpoint] = useState("https://countries.trevorblades.com/");
  const [query, setQuery] = useState(`query {
  countries {
    code
    name
    emoji
  }
}`);
  const [variables, setVariables] = useState("{}");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const vars = variables.trim() ? JSON.parse(variables) : {};
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: vars }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setError(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" }}>GraphQL Endpoint</label>
      <input style={{ ...fieldStyle, marginBottom: 10 }} value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://api.example.com/graphql" />
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" }}>Query</label>
      <textarea style={{ ...fieldStyle, height: 140, marginBottom: 10 }} value={query} onChange={(e) => setQuery(e.target.value)} />
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" }}>Variables (JSON)</label>
      <textarea style={{ ...fieldStyle, height: 90, marginBottom: 10 }} value={variables} onChange={(e) => setVariables(e.target.value)} placeholder='{"key":"value"}' />
      <button onClick={runQuery} disabled={loading} style={btnPrimary}>
        {loading ? "Running…" : "Run Query"}
      </button>
      {error && (
        <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>
      )}
      <div style={{ marginTop: 12, background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", minHeight: 180, color: "#34E4B8", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, whiteSpace: "pre-wrap", wordBreak: "break-word", overflow: "auto" }}>
        {response || "Response will appear here."}
      </div>
    </div>
  );
}
