import React, { useState, useMemo } from "react";
import OutputBar from "../components/OutputBar.jsx";

const tabBtn = {
  border: "1px solid #232735",
  background: "transparent",
  color: "#E7E9F2",
  borderRadius: 8,
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: 12.5,
};

const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "12px 14px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5, resize: "vertical", outline: "none", boxSizing: "border-box"
};

export default function Base64Tool() {
  const [input, setInput] = useState("DevCostoll");
  const [mode, setMode] = useState("encode");
  const output = useMemo(() => {
    try {
      return mode === "encode" ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
    } catch {
      return "Invalid input for decoding";
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["encode", "decode"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>{m}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 90 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} />
    </div>
  );
}
