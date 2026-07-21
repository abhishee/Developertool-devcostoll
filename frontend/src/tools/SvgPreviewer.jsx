import React, { useState, useMemo } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11.5, resize: "vertical", outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C5CFF"/>
      <stop offset="100%" stop-color="#34E4B8"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="24" fill="url(#g)" opacity="0.15"/>
  <rect x="16" y="16" width="168" height="168" rx="18" fill="none" stroke="url(#g)" stroke-width="2"/>
  <text x="100" y="90" text-anchor="middle" font-family="monospace" font-size="32" font-weight="bold" fill="url(#g)">&lt;/&gt;</text>
  <text x="100" y="130" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#E7E9F2">DevCostoll</text>
</svg>`;

export default function SvgPreviewer() {
  const [code, setCode] = useState(SAMPLE);
  const [bg, setBg] = useState("dark");

  const isValid = useMemo(() => {
    try {
      const p = new DOMParser().parseFromString(code, "image/svg+xml");
      return !p.querySelector("parsererror");
    } catch { return false; }
  }, [code]);

  const dataUrl = useMemo(() => {
    if (!isValid) return "";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(code);
  }, [code, isValid]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={fieldLabel}>SVG markup</label>
          <textarea style={{ ...inputStyle, height: 260 }} value={code} onChange={e => setCode(e.target.value)} />
          {!isValid && code.trim() && (
            <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 6 }}>⚠ Invalid SVG</div>
          )}
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={fieldLabel}>Preview</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[["dark","#14171F"],["light","#F8FAFC"],["checker","repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 16px 16px"]].map(([id, bgVal]) => (
                <button key={id} onClick={() => setBg(id)} style={{
                  width: 22, height: 22, borderRadius: 4, cursor: "pointer",
                  background: bgVal, border: `2px solid ${bg === id ? "#7C5CFF" : "#232735"}`,
                }} title={id} />
              ))}
            </div>
          </div>
          <div style={{
            height: 260, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            border: "1px solid #232735",
            background: bg === "dark" ? "#14171F" : bg === "light" ? "#F8FAFC" : "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 16px 16px",
          }}>
            {isValid ? (
              <img src={dataUrl} alt="SVG preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
            ) : (
              <span style={{ color: "#4E5468", fontSize: 12 }}>Waiting for valid SVG…</span>
            )}
          </div>
        </div>
      </div>
      {isValid && (
        <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
          <a href={dataUrl} download="preview.svg" style={{ fontSize: 12, color: "#7C5CFF", textDecoration: "none" }}>Download SVG ↓</a>
        </div>
      )}
    </div>
  );
}
