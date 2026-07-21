import React, { useState, useEffect } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = {
  background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "9px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const statCard = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 14px" };

export default function TimestampConverter() {
  const [ts, setTs] = useState(String(Date.now()));
  const [dateStr, setDateStr] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTs = () => {
    const n = Number(ts);
    if (isNaN(n)) return null;
    // Handle both seconds and ms
    const d = new Date(ts.length <= 10 ? n * 1000 : n);
    return d;
  };

  const fromDate = () => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  const d = fromTs();
  const tsFields = d && !isNaN(d.getTime()) ? [
    ["UTC", d.toUTCString()],
    ["ISO 8601", d.toISOString()],
    ["Local", d.toLocaleString()],
    ["Date only", d.toISOString().slice(0, 10)],
    ["Time only", d.toISOString().slice(11, 19)],
    ["Unix (s)", String(Math.floor(d.getTime() / 1000))],
    ["Unix (ms)", String(d.getTime())],
  ] : [];

  const dateResult = fromDate();
  const dateTs = dateResult && !isNaN(dateResult.getTime())
    ? `Unix seconds: ${Math.floor(dateResult.getTime() / 1000)}\nUnix ms: ${dateResult.getTime()}`
    : "";

  return (
    <div>
      <div style={{ background: "rgba(124,92,255,0.08)", border: "1px solid rgba(124,92,255,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
        <span style={{ color: "#7A8099", fontSize: 11, marginRight: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Now</span>
        <span style={{ color: "#E7E9F2" }}>{now}</span>
        <span style={{ color: "#4E5468", margin: "0 8px" }}>·</span>
        <span style={{ color: "#34E4B8" }}>{new Date(now).toISOString()}</span>
      </div>

      <label style={fieldLabel}>Unix timestamp → date</label>
      <input style={{ ...inputStyle, marginBottom: 8 }} value={ts} onChange={e => setTs(e.target.value)} placeholder="e.g. 1700000000 or 1700000000000" />
      <button onClick={() => setTs(String(Date.now()))} style={{ fontSize: 11.5, color: "#7C5CFF", background: "none", border: "none", cursor: "pointer", padding: "0 0 10px" }}>
        Use current time
      </button>

      {tsFields.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginBottom: 20 }}>
          {tsFields.map(([label, val]) => (
            <div key={label} style={statCard}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34E4B8", wordBreak: "break-all" }}>{val}</div>
              <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      ) : ts && (
        <div style={{ color: "#FF6B6B", fontSize: 12, marginBottom: 16 }}>⚠ Not a valid timestamp</div>
      )}

      <label style={fieldLabel}>Date string → Unix timestamp</label>
      <input style={inputStyle} value={dateStr} onChange={e => setDateStr(e.target.value)} placeholder="e.g. 2026-01-15T09:00:00Z or 2026-01-15" />
      {dateStr && <OutputBar value={dateTs || "⚠ Invalid date string"} label="Unix timestamps" />}
    </div>
  );
}
