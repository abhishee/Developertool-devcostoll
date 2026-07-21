import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = { width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const tabBtn = { background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5, padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };

const OPERATIONS = [
  { id: "sort-asc",   label: "Sort A→Z" },
  { id: "sort-desc",  label: "Sort Z→A" },
  { id: "dedup",      label: "Deduplicate" },
  { id: "reverse",    label: "Reverse" },
  { id: "shuffle",    label: "Shuffle" },
  { id: "trim",       label: "Trim whitespace" },
  { id: "filter-empty", label: "Remove empty" },
  { id: "number",     label: "Add line numbers" },
  { id: "count",      label: "Count occurrences" },
];

function applyOp(lines, op) {
  switch (op) {
    case "sort-asc":   return [...lines].sort((a,b) => a.localeCompare(b));
    case "sort-desc":  return [...lines].sort((a,b) => b.localeCompare(a));
    case "dedup":      return [...new Set(lines)];
    case "reverse":    return [...lines].reverse();
    case "shuffle":    { const a = [...lines]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
    case "trim":       return lines.map(l => l.trim());
    case "filter-empty": return lines.filter(l => l.trim());
    case "number":     return lines.map((l,i) => `${String(i+1).padStart(3,' ')} │ ${l}`);
    case "count": {
      const counts = {};
      lines.forEach(l => { const k = l.trim(); counts[k] = (counts[k]||0)+1; });
      return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${String(v).padStart(4,' ')}× ${k}`);
    }
    default: return lines;
  }
}

export default function LineTools() {
  const [input, setInput] = useState("banana\napple\norange\napple\ngrape\nbanana\nkiwi");
  const [op, setOp] = useState("sort-asc");

  const lines = input.split("\n");
  const result = useMemo(() => applyOp(lines, op).join("\n"), [input, op]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {OPERATIONS.map(o => (
          <button key={o.id} onClick={() => setOp(o.id)} style={{ ...tabBtn, ...(op === o.id ? tabBtnActive : {}) }}>{o.label}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input ({lines.length} lines)</label>
      <textarea style={{ ...inputStyle, height: 120 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={result} label={`${result.split("\n").length} lines`} />
    </div>
  );
}
