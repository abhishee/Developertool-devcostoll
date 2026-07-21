import React, { useState, useMemo } from "react";

function formatMarkdown(raw) {
  const lines = raw.split("\n").map((line) => line.trimRight());
  const normalized = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      normalized.push("");
      continue;
    }
    if (/^(#{1,6})\s*/.test(line)) {
      normalized.push(line.replace(/\s+/g, " "));
      continue;
    }
    if (/^([*+-]|\d+\.)\s+/.test(line)) {
      normalized.push(line.replace(/\s+/g, " "));
      continue;
    }
    normalized.push(line.replace(/\s+/g, " "));
  }

  const output = [];
  for (let i = 0; i < normalized.length; i += 1) {
    const line = normalized[i];
    if (!line) {
      if (output[output.length - 1] !== "") output.push("");
      continue;
    }
    const prev = output[output.length - 1] || "";
    if (/^(#{1,6})\s/.test(line) && prev && prev !== "") {
      output.push("");
    }
    output.push(line);
  }

  return output.join("\n");
}

export default function MarkdownFormatter() {
  const [input, setInput] = useState("# DevCostoll\n\nThis is a sample markdown snippet.   \\nUse it to check heading spacing, list formatting, and line wrapping.\n\n- item one\n- item two\n");
  const output = useMemo(() => {
    try {
      return formatMarkdown(input);
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [input]);

  return (
    <div>
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" }}>Markdown Input</label>
      <textarea style={{ width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, resize: "vertical", outline: "none", boxSizing: "border-box", height: 170 }} value={input} onChange={(e) => setInput(e.target.value)} />
      <pre style={{ marginTop: 14, background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#34E4B8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{output}</pre>
    </div>
  );
}
