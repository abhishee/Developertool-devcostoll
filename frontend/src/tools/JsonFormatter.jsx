import React, { useState, useMemo } from "react";
import { Zap } from "lucide-react";
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
const liveNote = {
  display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px",
  borderRadius: 10, background: "#111419", border: "1px solid #232735", color: "#B7BBD0", fontSize: 12,
};

function sortKeysDeep(obj) {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj && typeof obj === "object") {
    return Object.keys(obj).sort().reduce((acc, k) => {
      acc[k] = sortKeysDeep(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}

function autoCleanJson(raw) {
  let s = raw.trim();

  const tryParse = (str) => {
    try { return { ok: true, value: JSON.parse(str) }; }
    catch (e) { return { ok: false, error: e.message }; }
  };

  const unescapeOnce = (str) => str
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "")
    .replace(/\\\\/g, "\\");

  const parseDeep = (str, depth = 0) => {
    const attempt = tryParse(str);
    if (!attempt.ok) return attempt;
    if (typeof attempt.value === "string" && depth < 4 && /^[\[{]/.test(attempt.value.trim())) {
      return parseDeep(attempt.value, depth + 1);
    }
    return attempt;
  };

  let attempt = parseDeep(s);
  if (attempt.ok && typeof attempt.value !== "string") {
    return { formatted: JSON.stringify(attempt.value, null, 2), cleaned: false };
  }

  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  s = unescapeOnce(s);
  attempt = parseDeep(s);
  if (attempt.ok && typeof attempt.value !== "string") {
    return { formatted: JSON.stringify(attempt.value, null, 2), cleaned: true };
  }

  s = unescapeOnce(s);
  attempt = parseDeep(s);
  if (attempt.ok && typeof attempt.value !== "string") {
    return { formatted: JSON.stringify(attempt.value, null, 2), cleaned: true };
  }

  throw new Error(`Still not valid JSON after cleanup attempts: ${attempt.error || "result was a plain string, not an object/array"}`);
}

export default function JsonFormatter() {
  const [input, setInput] = useState('{"project":"DevCostoll","tools":30,"offline":true}');
  const [mode, setMode] = useState("format");
  const [error, setError] = useState("");
  const [wasCleaned, setWasCleaned] = useState(false);

  const output = useMemo(() => {
    try {
      if (mode === "escape") { setError(""); return JSON.stringify(input); }
      if (mode === "unescape") { const v = JSON.parse(input); setError(""); return typeof v === "string" ? v : String(v); }
      if (mode === "clean") {
        const { formatted, cleaned } = autoCleanJson(input);
        setError(""); setWasCleaned(cleaned);
        return formatted;
      }
      const parsed = JSON.parse(input);
      setError("");
      if (mode === "minify") return JSON.stringify(parsed);
      if (mode === "sort") return JSON.stringify(sortKeysDeep(parsed), null, 2);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      setError(e.message);
      return "";
    }
  }, [input, mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {[ ["format", "Format"], ["minify", "Minify"], ["sort", "Sort keys"], ["clean", "Auto-Clean"], ["escape", "Escape"], ["unescape", "Unescape"] ].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{ ...tabBtn, ...(mode === id ? tabBtnActive : {}) }}>{label}</button>
        ))}
      </div>
      <label style={fieldLabel}>{mode === "unescape" ? "Escaped JSON string" : mode === "clean" ? "Messy / over-escaped JSON" : "Raw JSON"}</label>
      <textarea style={{ ...inputStyle, height: 120 }} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === "clean" ? '"{\\"key\\": \\"value\\", \\"n\\": 1}"' : undefined} />
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ {error}</div>}
      <OutputBar value={output} label="Output" />
      {mode === "clean" && wasCleaned && (
        <div style={{ ...liveNote, marginTop: 12 }}>
          <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Stripped wrapping quotes and unescaped \" \\n \\t \\ to recover valid JSON.</span>
        </div>
      )}
    </div>
  );
}
