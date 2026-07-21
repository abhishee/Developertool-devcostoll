import React, { useState, useMemo } from "react";

function alignPairs(pairs) {
  const maxKey = pairs.reduce((max, [key]) => Math.max(max, key.length), 0);
  return pairs.map(([key, value]) => `${key.padEnd(maxKey)} = ${value}`).join("\n");
}

function formatToml(raw) {
  const lines = raw.split("\n");
  const sections = [];
  let current = { header: null, pairs: [] };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (current.pairs.length || current.header) {
        sections.push(current);
        current = { header: null, pairs: [] };
      }
      continue;
    }
    if (line.startsWith("#") || line.startsWith(";")) {
      if (current.pairs.length || current.header) {
        sections.push(current);
        current = { header: null, pairs: [] };
      }
      sections.push({ header: null, pairs: [[line, ""]], comment: true });
      continue;
    }
    if (line.startsWith("[") && line.endsWith("]")) {
      if (current.pairs.length || current.header) {
        sections.push(current);
      }
      current = { header: line, pairs: [] };
      continue;
    }
    const idx = line.indexOf("=");
    if (idx >= 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      current.pairs.push([key, value]);
    } else {
      current.pairs.push([line, ""]);
    }
  }
  if (current.pairs.length || current.header) sections.push(current);

  return sections.map((section) => {
    if (section.comment) return section.pairs[0][0];
    const body = alignPairs(section.pairs);
    return section.header ? [section.header, body].filter(Boolean).join("\n") : body;
  }).join("\n\n");
}

export default function TomlFormatter() {
  const [input, setInput] = useState('[title]\nname = "DevCostoll"\nenabled = true\n\n[database]\nserver = "192.168.1.1"\nports = [ 8001, 8001, 8002 ]');
  const output = useMemo(() => {
    try {
      return formatToml(input);
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [input]);

  return (
    <div>
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" }}>TOML Input</label>
      <textarea style={{ width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, resize: "vertical", outline: "none", boxSizing: "border-box", height: 160 }} value={input} onChange={(e) => setInput(e.target.value)} />
      <pre style={{ marginTop: 14, background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#34E4B8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{output}</pre>
    </div>
  );
}
