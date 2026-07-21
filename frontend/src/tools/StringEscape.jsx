import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = { width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const tabBtn = { background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5, padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };

const MODES = [
  { id: "js-escape",   label: "JS Escape" },
  { id: "js-unescape", label: "JS Unescape" },
  { id: "json-escape", label: "JSON Escape" },
  { id: "regex-escape",label: "Regex Escape" },
];

function process(input, mode) {
  try {
    switch (mode) {
      case "js-escape":   return JSON.stringify(input).slice(1, -1);
      case "js-unescape": return JSON.parse(`"${input}"`);
      case "json-escape": return JSON.stringify(input);
      case "regex-escape": return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      default: return input;
    }
  } catch (e) { return "Error: " + e.message; }
}

export default function StringEscape() {
  const [mode, setMode] = useState("js-escape");
  const [input, setInput] = useState(`Hello "world"!\nTab:\there\nBackslash: C:\\Users\\dev`);
  const output = useMemo(() => process(input, mode), [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ ...tabBtn, ...(mode === m.id ? tabBtnActive : {}) }}>{m.label}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 100 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} label="Result" />
    </div>
  );
}
