import React, { useState, useMemo } from "react";

function formatIni(raw) {
  const lines = raw.split("\n");
  const sections = [];
  let current = { header: null, pairs: [] };

  const flush = () => {
    if (current.header || current.pairs.length) {
      sections.push(current);
      current = { header: null, pairs: [] };
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith(";") || line.startsWith("#")) {
      flush();
      sections.push({ header: null, pairs: [[line, ""]], comment: true });
      continue;
    }
    if (line.startsWith("[") && line.endsWith("]")) {
      flush();
      current = { header: line, pairs: [] };
      continue;
    }
    const idx = line.indexOf("=");
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    current.pairs.push([key, value]);
  }
  flush();

  return sections.map((section) => {
    if (section.comment) return section.pairs[0][0];
    const maxKey = section.pairs.reduce((max, [key]) => Math.max(max, key.length), 0);
    const body = section.pairs.map(([key, value]) => `${key.padEnd(maxKey)} = ${value}`).join("\n");
    return section.header ? `${section.header}\n${body}` : body;
  }).join("\n\n");
}

export default function IniFormatter() {
  const [input, setInput] = useState('[general]\nappname=DevCostoll\nenabled = true\n\n[network]\nport=8080\n');
  const output = useMemo(() => {
    try {
      return formatIni(input);
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [input]);

  return (
    <div>
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" }}>INI Input</label>
      <textarea style={{ width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, resize: "vertical", outline: "none", boxSizing: "border-box", height: 160 }} value={input} onChange={(e) => setInput(e.target.value)} />
      <pre style={{ marginTop: 14, background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#34E4B8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{output}</pre>
    </div>
  );
}
