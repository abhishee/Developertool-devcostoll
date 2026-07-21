import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = {
  background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "9px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box",
};
const statCard = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 14px" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const PALETTES = [
  { name: "Violet", hex: "#7C5CFF" },
  { name: "Mint", hex: "#34E4B8" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#22C55E" },
  { name: "Amber", hex: "#F59E0B" },
  { name: "Red", hex: "#EF4444" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Orange", hex: "#F97316" },
];

export default function ColorConverter() {
  const [hex, setHex] = useState("#7C5CFF");
  const [native, setNative] = useState("#7C5CFF");

  const result = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { ...rgb, ...hsl };
  }, [hex]);

  const syncNative = (val) => { setNative(val); setHex(val); };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={fieldLabel}>HEX</label>
          <input style={inputStyle} value={hex} onChange={e => { setHex(e.target.value); }} placeholder="#7C5CFF" />
        </div>
        <div>
          <label style={fieldLabel}>Picker</label>
          <input type="color" value={native} onChange={e => syncNative(e.target.value)} style={{ width: 48, height: 40, border: "1px solid #232735", borderRadius: 8, background: "none", cursor: "pointer", padding: 2 }} />
        </div>
      </div>

      {result ? (
        <>
          <div style={{ width: "100%", height: 60, borderRadius: 12, background: hex, marginBottom: 16, border: "1px solid #232735" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
            {[
              ["HEX", hex.toUpperCase()],
              ["RGB", `rgb(${result.r}, ${result.g}, ${result.b})`],
              ["HSL", `hsl(${result.h}, ${result.s}%, ${result.l}%)`],
              ["R", result.r], ["G", result.g], ["B", result.b],
            ].map(([label, val]) => (
              <div key={label} style={statCard}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#34E4B8" }}>{val}</div>
                <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ color: "#FF6B6B", fontSize: 12 }}>⚠ Enter a valid HEX color (e.g. #7C5CFF or #FFF)</div>
      )}

      <label style={fieldLabel}>Quick palette</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PALETTES.map(p => (
          <button
            key={p.hex}
            onClick={() => { setHex(p.hex); setNative(p.hex); }}
            title={`${p.name} – ${p.hex}`}
            style={{ width: 32, height: 32, borderRadius: 8, background: p.hex, border: hex === p.hex ? "2px solid #E7E9F2" : "2px solid transparent", cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}
