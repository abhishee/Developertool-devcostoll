import React, { useMemo, useState } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box",
};
const fieldLabel = {
  fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
  color: "#7A8099", marginBottom: 6, display: "block",
};

function computeDiff(a, b) {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result = [];
  let i = 0, j = 0;
  while (i < aLines.length || j < bLines.length) {
    if (i >= aLines.length) {
      result.push({ type: "add", text: bLines[j++] });
    } else if (j >= bLines.length) {
      result.push({ type: "remove", text: aLines[i++] });
    } else if (aLines[i] === bLines[j]) {
      result.push({ type: "same", text: aLines[i++] }); j++;
    } else {
      result.push({ type: "remove", text: aLines[i++] });
      result.push({ type: "add", text: bLines[j++] });
    }
  }
  return result;
}

export default function TextDiff() {
  const [left, setLeft] = useState("function greet(name) {\n  return 'Hello ' + name;\n}\n\nconsole.log(greet('world'));");
  const [right, setRight] = useState("function greet(name, greeting = 'Hello') {\n  return `${greeting}, ${name}!`;\n}\n\nconsole.log(greet('DevCostoll'));");

  const diff = useMemo(() => computeDiff(left, right), [left, right]);
  const adds = diff.filter(l => l.type === "add").length;
  const removes = diff.filter(l => l.type === "remove").length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={fieldLabel}>Original</label>
          <textarea style={{ ...inputStyle, height: 130 }} value={left} onChange={e => setLeft(e.target.value)} />
        </div>
        <div>
          <label style={fieldLabel}>Modified</label>
          <textarea style={{ ...inputStyle, height: 130 }} value={right} onChange={e => setRight(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 12 }}>
        <span style={{ color: "#34E4B8" }}>+{adds} added</span>
        <span style={{ color: "#FF6B6B" }}>−{removes} removed</span>
      </div>

      <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, overflow: "auto", maxHeight: 320 }}>
        {diff.map((line, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, padding: "2px 12px",
            background: line.type === "add" ? "rgba(52,228,184,0.08)" : line.type === "remove" ? "rgba(255,107,107,0.08)" : "transparent",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: line.type === "add" ? "#34E4B8" : line.type === "remove" ? "#FF6B6B" : "#4E5468",
              flexShrink: 0, width: 14,
            }}>
              {line.type === "add" ? "+" : line.type === "remove" ? "−" : " "}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              color: line.type === "same" ? "#7A8099" : "#E7E9F2",
              whiteSpace: "pre",
            }}>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
