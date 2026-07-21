import React, { useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "9px 12px", color: "#E7E9F2", fontFamily: "Inter, sans-serif",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const TYPES = [
  { value: "feat",     label: "feat",     color: "#22C55E", desc: "New feature" },
  { value: "fix",      label: "fix",      color: "#EF4444", desc: "Bug fix" },
  { value: "docs",     label: "docs",     color: "#3B82F6", desc: "Documentation" },
  { value: "style",    label: "style",    color: "#EC4899", desc: "Formatting" },
  { value: "refactor", label: "refactor", color: "#F59E0B", desc: "Code refactor" },
  { value: "perf",     label: "perf",     color: "#00B8D9", desc: "Performance" },
  { value: "test",     label: "test",     color: "#A855F7", desc: "Tests" },
  { value: "build",    label: "build",    color: "#F97316", desc: "Build system" },
  { value: "ci",       label: "ci",       color: "#6366F1", desc: "CI/CD" },
  { value: "chore",    label: "chore",    color: "#7A8099", desc: "Miscellaneous" },
  { value: "revert",   label: "revert",   color: "#FF6B6B", desc: "Revert commit" },
];

export default function ConventionalCommit() {
  const [type, setType] = useState("feat");
  const [scope, setScope] = useState("");
  const [breaking, setBreaking] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");

  const header = `${type}${scope ? `(${scope})` : ""}${breaking ? "!" : ""}: ${subject}`;
  const full = [header, body && `\n${body}`, footer && `\n${footer}`].filter(Boolean).join("\n");

  const subjectLen = subject.length;
  const headerLen = header.length;

  return (
    <div>
      <label style={fieldLabel}>Type</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            title={t.desc}
            style={{
              padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
              border: `1px solid ${type === t.value ? t.color : "#232735"}`,
              background: type === t.value ? `${t.color}22` : "#0D0F16",
              color: type === t.value ? t.color : "#7A8099",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={fieldLabel}>Scope (optional)</label>
          <input style={inputStyle} value={scope} onChange={e => setScope(e.target.value)} placeholder="e.g. auth, api, ui" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
          <input type="checkbox" id="breaking" checked={breaking} onChange={e => setBreaking(e.target.checked)} />
          <label htmlFor="breaking" style={{ fontSize: 13, color: breaking ? "#FF6B6B" : "#B7BBD0", cursor: "pointer" }}>
            Breaking change (!)
          </label>
        </div>
      </div>

      <label style={fieldLabel}>
        Subject
        <span style={{ float: "right", color: subjectLen > 72 ? "#FF6B6B" : "#4E5468" }}>{subjectLen}/72</span>
      </label>
      <input style={{ ...inputStyle, borderColor: subjectLen > 72 ? "#FF6B6B" : "#232735" }} value={subject} onChange={e => setSubject(e.target.value)} placeholder="short, imperative description" />

      <label style={{ ...fieldLabel, marginTop: 12 }}>Body (optional)</label>
      <textarea style={{ ...inputStyle, height: 70, resize: "vertical" }} value={body} onChange={e => setBody(e.target.value)} placeholder="More detailed explanation..." />

      <label style={{ ...fieldLabel, marginTop: 12 }}>Footer (optional)</label>
      <input style={inputStyle} value={footer} onChange={e => setFooter(e.target.value)} placeholder="Fixes #123 / BREAKING CHANGE: ..." />

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099" }}>Generated commit</span>
          <span style={{ fontSize: 11, color: headerLen > 100 ? "#FF6B6B" : "#4E5468" }}>header: {headerLen} chars</span>
        </div>
        <OutputBar value={full || "(fill in the fields above)"} />
      </div>
    </div>
  );
}
