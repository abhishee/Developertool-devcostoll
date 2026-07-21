import React, { useState, useMemo } from "react";
import OutputBar from "../components/OutputBar.jsx";

const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "12px 14px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5, resize: "vertical", outline: "none", boxSizing: "border-box"
};

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => {
    if (!token.trim()) return { header: "", payload: "", error: "" };
    const parts = token.trim().split(".");
    if (parts.length < 2) return { header: "", payload: "", error: "Not a valid JWT (needs 3 dot-separated parts)" };
    try {
      const b64 = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));
      const header = JSON.stringify(JSON.parse(b64(parts[0])), null, 2);
      const payload = JSON.stringify(JSON.parse(b64(parts[1])), null, 2);
      return { header, payload, error: "" };
    } catch (e) {
      return { header: "", payload: "", error: "Could not decode: " + e.message };
    }
  }, [token]);

  return (
    <div>
      <label style={fieldLabel}>JWT Token</label>
      <textarea style={{ ...inputStyle, height: 80 }} placeholder="eyJhbGciOi..." value={token} onChange={e => setToken(e.target.value)} />
      {decoded.error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ {decoded.error}</div>}
      {decoded.header && <OutputBar value={decoded.header} label="Header" />}
      {decoded.payload && <OutputBar value={decoded.payload} label="Payload" />}
    </div>
  );
}
