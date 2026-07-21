import React, { useMemo, useState } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const RULES = [
  { id: "no-latest",    re: /^FROM\s+\S+:latest/i,             msg: "Avoid :latest tag — pin to a specific version for reproducible builds.",                  level: "warn" },
  { id: "no-root",      re: /^(RUN|CMD|ENTRYPOINT)/i,          check: (lines) => !lines.some(l => /^USER /i.test(l)), msg: "No USER instruction found — container will run as root.",                             level: "warn" },
  { id: "apt-update",   re: /apt-get update/i,                  check: (_, l) => !/apt-get install/i.test(l),             msg: "apt-get update without install in same RUN layer — use RUN apt-get update && apt-get install -y ... in one layer.", level: "warn" },
  { id: "no-healthcheck", re: null,                             check: (lines) => !lines.some(l => /^HEALTHCHECK/i.test(l)), msg: "No HEALTHCHECK defined — consider adding one for production images.",             level: "info" },
  { id: "copy-not-add", re: /^ADD\s/i,                          msg: "Prefer COPY over ADD unless you need tar auto-extraction or remote URLs.",                level: "warn" },
  { id: "multi-run",    re: null,                               check: (lines) => lines.filter(l => /^RUN /i.test(l)).length > 4, msg: "Many RUN layers detected — combine into fewer layers with && to reduce image size.", level: "info" },
  { id: "no-from",      re: null,                               check: (lines) => !lines.some(l => /^FROM /i.test(l)), msg: "No FROM instruction found — every Dockerfile must start with FROM.",                 level: "error" },
  { id: "apt-rm",       re: /apt-get install/i,                 check: (_, l) => !/rm -rf \/var\/lib\/apt\/lists/i.test(l), msg: "Clean up apt cache after install: && rm -rf /var/lib/apt/lists/*",              level: "info" },
];

function lint(dockerfile) {
  const lines = dockerfile.split("\n").map(l => l.trim()).filter(Boolean);
  const issues = [];

  RULES.forEach(rule => {
    if (rule.re === null && rule.check) {
      if (rule.check(lines)) {
        issues.push({ ...rule, line: null });
      }
      return;
    }
    lines.forEach((line, i) => {
      if (rule.re && rule.re.test(line)) {
        if (rule.check && !rule.check(lines, line)) {
          issues.push({ ...rule, line: i + 1, text: line });
        } else if (!rule.check) {
          issues.push({ ...rule, line: i + 1, text: line });
        }
      }
    });
  });

  return issues;
}

const LEVEL_COLOR = { error: "#FF6B6B", warn: "#F59E0B", info: "#34E4B8" };
const LEVEL_BG   = { error: "rgba(255,107,107,0.08)", warn: "rgba(245,158,11,0.08)", info: "rgba(52,228,184,0.08)" };

export default function DockerfileLinter() {
  const [input, setInput] = useState(`FROM node:latest
WORKDIR /app
ADD . .
RUN npm install
RUN npm run build
RUN rm -rf .git
EXPOSE 3000
CMD ["node", "server.js"]`);

  const issues = useMemo(() => lint(input), [input]);
  const errors = issues.filter(i => i.level === "error").length;
  const warns  = issues.filter(i => i.level === "warn").length;

  return (
    <div>
      <label style={fieldLabel}>Dockerfile</label>
      <textarea style={{ ...inputStyle, height: 200 }} value={input} onChange={e => setInput(e.target.value)} />

      <div style={{ display: "flex", gap: 16, margin: "12px 0 10px", fontSize: 12 }}>
        <span style={{ color: "#FF6B6B" }}>{errors} error{errors !== 1 ? "s" : ""}</span>
        <span style={{ color: "#F59E0B" }}>{warns} warning{warns !== 1 ? "s" : ""}</span>
        <span style={{ color: "#34E4B8" }}>{issues.filter(i => i.level === "info").length} suggestion{issues.filter(i => i.level === "info").length !== 1 ? "s" : ""}</span>
      </div>

      {issues.length === 0 && (
        <div style={{ padding: "14px 16px", background: "rgba(52,228,184,0.08)", border: "1px solid rgba(52,228,184,0.2)", borderRadius: 8, fontSize: 13, color: "#34E4B8" }}>
          ✓ No issues found
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {issues.map((issue, i) => (
          <div key={i} style={{
            padding: "10px 14px", borderRadius: 8, background: LEVEL_BG[issue.level],
            border: `1px solid ${LEVEL_COLOR[issue.level]}44`,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: LEVEL_COLOR[issue.level], textTransform: "uppercase", letterSpacing: 1 }}>{issue.level}</span>
              {issue.line && <span style={{ fontSize: 11, color: "#7A8099" }}>line {issue.line}</span>}
            </div>
            <div style={{ fontSize: 12.5, color: "#E7E9F2" }}>{issue.msg}</div>
            {issue.text && <div style={{ marginTop: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7A8099" }}>{issue.text}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
