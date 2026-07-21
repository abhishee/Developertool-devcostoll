import React, { useMemo, useState } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const SAMPLE = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: devcostoll-api
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devcostoll
  template:
    metadata:
      labels:
        app: devcostoll
    spec:
      containers:
        - name: api
          image: devcostoll/api:1.2.0
          ports:
            - containerPort: 4000`;

function validateK8s(yaml) {
  const issues = [];
  const lines = yaml.split("\n");

  if (!yaml.includes("apiVersion:")) issues.push({ level: "error", msg: "Missing required field: apiVersion" });
  if (!yaml.includes("kind:")) issues.push({ level: "error", msg: "Missing required field: kind" });
  if (!yaml.includes("metadata:")) issues.push({ level: "error", msg: "Missing required field: metadata" });
  if (!yaml.includes("name:")) issues.push({ level: "error", msg: "Missing metadata.name" });

  if (yaml.includes("kind: Deployment") || yaml.includes("kind: StatefulSet")) {
    if (!yaml.includes("resources:")) issues.push({ level: "warn", msg: "No resource limits/requests defined — set resources.limits and resources.requests for production." });
    if (!yaml.includes("livenessProbe") && !yaml.includes("readinessProbe")) issues.push({ level: "warn", msg: "No liveness/readiness probes — Kubernetes won't know when a pod is healthy." });
    if (!yaml.includes("replicas:")) issues.push({ level: "info", msg: "replicas not set — defaults to 1." });
  }

  if (yaml.includes(":latest")) issues.push({ level: "warn", msg: "Avoid :latest image tag — pin to a specific version for reproducibility." });

  lines.forEach((line, i) => {
    const spaces = line.match(/^ */)?.[0].length ?? 0;
    if (line.trim() && spaces % 2 !== 0) issues.push({ level: "warn", msg: `Line ${i + 1}: Odd indentation (${spaces} spaces) — YAML conventionally uses 2-space indent.` });
  });

  if (issues.filter(i => i.level === "error").length === 0 && issues.length === 0) {
    issues.push({ level: "ok", msg: "Structure looks valid — no obvious issues found." });
  }

  return issues;
}

const COLORS = { error: "#FF6B6B", warn: "#F59E0B", info: "#34E4B8", ok: "#22C55E" };
const BGS    = { error: "rgba(255,107,107,0.08)", warn: "rgba(245,158,11,0.08)", info: "rgba(52,228,184,0.08)", ok: "rgba(34,197,94,0.08)" };

export default function K8sValidator() {
  const [input, setInput] = useState(SAMPLE);
  const issues = useMemo(() => validateK8s(input), [input]);

  return (
    <div>
      <label style={fieldLabel}>Kubernetes YAML</label>
      <textarea style={{ ...inputStyle, height: 220 }} value={input} onChange={e => setInput(e.target.value)} />
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {issues.map((issue, i) => (
          <div key={i} style={{ padding: "10px 14px", borderRadius: 8, background: BGS[issue.level], border: `1px solid ${COLORS[issue.level]}44` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: COLORS[issue.level], textTransform: "uppercase", letterSpacing: 1, marginRight: 10 }}>{issue.level}</span>
            <span style={{ fontSize: 12.5, color: "#E7E9F2" }}>{issue.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
