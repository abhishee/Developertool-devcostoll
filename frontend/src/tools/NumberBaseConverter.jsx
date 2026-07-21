import React, { useMemo, useState } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "9px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const BASES = [
  { id: "bin", label: "Binary",  base: 2,  prefix: "0b", placeholder: "e.g. 1010 1111" },
  { id: "oct", label: "Octal",   base: 8,  prefix: "0o", placeholder: "e.g. 377" },
  { id: "dec", label: "Decimal", base: 10, prefix: "",   placeholder: "e.g. 255" },
  { id: "hex", label: "Hex",     base: 16, prefix: "0x", placeholder: "e.g. FF" },
];

function convertFrom(val, base) {
  const clean = val.trim().replace(/^0[bBoOxX]/, "").replace(/\s/g, "");
  if (!clean) return null;
  const n = parseInt(clean, base);
  if (isNaN(n)) return null;
  return n;
}

export default function NumberBaseConverter() {
  const [values, setValues] = useState({ bin: "", oct: "", dec: "255", hex: "" });
  const [source, setSource] = useState("dec");

  const results = useMemo(() => {
    const base = BASES.find(b => b.id === source);
    const n = convertFrom(values[source], base.base);
    if (n === null) return {};
    return {
      bin: n.toString(2).replace(/(.{4})/g, "$1 ").trim(),
      oct: n.toString(8),
      dec: n.toString(10),
      hex: n.toString(16).toUpperCase(),
    };
  }, [values, source]);

  const handleChange = (id, val) => {
    setSource(id);
    setValues(v => ({ ...v, [id]: val }));
  };

  return (
    <div>
      <p style={{ fontSize: 12.5, color: "#7A8099", marginBottom: 16 }}>
        Edit any field — all others update instantly.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {BASES.map(b => (
          <div key={b.id}>
            <label style={{ ...fieldLabel, color: source === b.id ? "#7C5CFF" : "#7A8099" }}>
              {b.label} {b.prefix && <span style={{ color: "#4E5468" }}>({b.prefix}…)</span>}
            </label>
            <input
              style={{ ...inputStyle, borderColor: source === b.id ? "#7C5CFF66" : "#232735" }}
              value={source === b.id ? values[b.id] : (results[b.id] ?? "")}
              onChange={e => handleChange(b.id, e.target.value)}
              onFocus={() => setSource(b.id)}
              placeholder={b.placeholder}
            />
          </div>
        ))}
      </div>
      {Object.keys(results).length === 0 && values[source]?.trim() && (
        <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ Invalid {BASES.find(b => b.id === source)?.label?.toLowerCase()} value</div>
      )}
    </div>
  );
}
