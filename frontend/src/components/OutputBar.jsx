import useCopy from "../hooks/useCopy.ts";

const outputBox = {
  background: "#0D0F16",
  border: "1px solid #232735",
  borderRadius: 8,
  padding: "12px 14px",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5,
  color: "#34E4B8",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  maxHeight: 260,
  overflow: "auto",
  margin: 0,
  lineHeight: 1.6,
};

const btnGhost = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  border: "1px solid #232735",
  color: "#B7BBD0",
  fontSize: 12,
  padding: "5px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
};

export default function OutputBar({ value, label = "Output" }) {
  const [copied, copy] = useCopy();
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099" }}>{label}</span>
        <button onClick={() => copy(value)} style={btnGhost}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={outputBox}>{value || "—"}</pre>
    </div>
  );
}
