import React, { useState } from "react";

const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const statCard = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 14px" };

export default function ImageInfo() {
  const [info, setInfo] = useState(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspect: (img.naturalWidth / img.naturalHeight).toFixed(3),
        mp: ((img.naturalWidth * img.naturalHeight) / 1_000_000).toFixed(2),
      });
    };
    img.src = url;
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handle(e.dataTransfer.files[0]);
  };

  const fields = info ? [
    ["File name", info.name],
    ["File size", info.size > 1024*1024 ? `${(info.size/1024/1024).toFixed(2)} MB` : `${(info.size/1024).toFixed(1)} KB`],
    ["MIME type", info.type],
    ["Width", `${info.width}px`],
    ["Height", `${info.height}px`],
    ["Aspect ratio", info.aspect],
    ["Megapixels", `${info.mp} MP`],
  ] : [];

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        style={{
          border: `2px dashed ${dragging ? "#7C5CFF" : "#232735"}`, borderRadius: 12,
          padding: "28px 16px", textAlign: "center", cursor: "pointer", marginBottom: 16,
          background: dragging ? "rgba(124,92,255,0.06)" : "#0D0F16",
          transition: "all 0.15s",
        }}
      >
        <input type="file" accept="image/*" onChange={e => handle(e.target.files[0])} style={{ display: "none" }} id="img-input" />
        <label htmlFor="img-input" style={{ cursor: "pointer", fontSize: 13, color: "#B7BBD0" }}>
          Drop an image here or <span style={{ color: "#7C5CFF" }}>click to browse</span>
        </label>
      </div>

      {preview && (
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "start" }}>
          <img src={preview} alt="preview" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: "1px solid #232735", objectFit: "contain", background: "#0D0F16" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {fields.map(([label, val]) => (
              <div key={label} style={statCard}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#34E4B8", wordBreak: "break-all" }}>{val}</div>
                <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
