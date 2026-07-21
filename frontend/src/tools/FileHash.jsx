import React, { useState } from "react";

const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const tabBtn = { background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5, padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };

async function hashBuffer(buf, algo) {
  const digest = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}

export default function FileHash() {
  const [file, setFile] = useState(null);
  const [algo, setAlgo] = useState("SHA-256");
  const [hash, setHash] = useState("");
  const [compare, setCompare] = useState("");
  const [loading, setLoading] = useState(false);

  const compute = async (f) => {
    setLoading(true); setHash("");
    const buf = await f.arrayBuffer();
    const h = await hashBuffer(buf, algo);
    setHash(h); setLoading(false);
  };

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f); compute(f);
  };

  const match = compare.trim() && hash ? compare.trim().toLowerCase() === hash.toLowerCase() : null;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["SHA-1","SHA-256","SHA-384","SHA-512"].map(a => (
          <button key={a} onClick={() => { setAlgo(a); if (file) compute(file); }} style={{ ...tabBtn, ...(algo===a?tabBtnActive:{}) }}>{a}</button>
        ))}
      </div>

      <label style={fieldLabel}>Select file</label>
      <input type="file" onChange={onFile} style={{ color: "#B7BBD0", fontSize: 13, marginBottom: 14 }} />

      {file && (
        <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12 }}>
          <span style={{ color: "#E7E9F2" }}>{file.name}</span>
          <span style={{ color: "#4E5468", marginLeft: 12 }}>{(file.size / 1024).toFixed(1)} KB</span>
          <span style={{ color: "#4E5468", marginLeft: 12 }}>{file.type || "unknown type"}</span>
        </div>
      )}

      {loading && <div style={{ color: "#7C5CFF", fontSize: 13 }}>Computing hash…</div>}

      {hash && (
        <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "12px 14px" }}>
          <label style={fieldLabel}>{algo} Hash</label>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34E4B8", wordBreak: "break-all" }}>{hash}</div>
        </div>
      )}

      {hash && (
        <div style={{ marginTop: 14 }}>
          <label style={fieldLabel}>Verify — paste expected hash</label>
          <input
            style={{ background: "#0D0F16", border: `1px solid ${match===true?"#22C55E":match===false?"#EF4444":"#232735"}`, borderRadius: 8, padding: "9px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" }}
            value={compare} onChange={e => setCompare(e.target.value)} placeholder="paste hash to compare…"
          />
          {match === true && <div style={{ color: "#22C55E", fontSize: 12, marginTop: 6 }}>✓ Hashes match</div>}
          {match === false && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>✗ Hashes do NOT match</div>}
        </div>
      )}
    </div>
  );
}
