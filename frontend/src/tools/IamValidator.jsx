import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box",
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const SAMPLE = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::my-bucket"
    }
  ]
}`;

function analyzePolicy(json) {
  const issues = [];
  const summary = [];
  let parsed;

  try { parsed = JSON.parse(json); } catch (e) {
    return { issues: [{ level: "error", msg: "Invalid JSON: " + e.message }], summary: [] };
  }

  if (!parsed.Version) issues.push({ level: "warn", msg: 'Missing "Version" field — add "Version": "2012-10-17"' });
  if (!parsed.Statement) { issues.push({ level: "error", msg: 'Missing "Statement" array' }); return { issues, summary }; }
  if (!Array.isArray(parsed.Statement)) { issues.push({ level: "error", msg: '"Statement" must be an array' }); return { issues, summary }; }

  parsed.Statement.forEach((stmt, i) => {
    const label = stmt.Sid ? `"${stmt.Sid}"` : `#${i + 1}`;

    if (!stmt.Effect) issues.push({ level: "error", msg: `Statement ${label}: missing Effect (must be Allow or Deny)` });
    if (stmt.Effect && !["Allow", "Deny"].includes(stmt.Effect)) issues.push({ level: "error", msg: `Statement ${label}: Effect must be "Allow" or "Deny", got "${stmt.Effect}"` });
    if (!stmt.Action && !stmt.NotAction) issues.push({ level: "error", msg: `Statement ${label}: missing Action or NotAction` });
    if (!stmt.Resource && !stmt.NotResource) issues.push({ level: "warn", msg: `Statement ${label}: no Resource — consider scoping to a specific ARN` });

    const actions = Array.isArray(stmt.Action) ? stmt.Action : stmt.Action ? [stmt.Action] : [];
    if (actions.includes("*")) issues.push({ level: "warn", msg: `Statement ${label}: Action "*" grants all permissions — scope down for least privilege.` });
    const resources = Array.isArray(stmt.Resource) ? stmt.Resource : stmt.Resource ? [stmt.Resource] : [];
    if (resources.includes("*")) issues.push({ level: "warn", msg: `Statement ${label}: Resource "*" applies to all resources — narrow the scope.` });

    summary.push({
      label,
      effect: stmt.Effect,
      actions: actions.slice(0, 3),
      more: Math.max(0, actions.length - 3),
      resource: resources[0] || "*",
    });
  });

  if (issues.length === 0) issues.push({ level: "ok", msg: "Policy structure is valid with no obvious privilege issues." });

  return { issues, summary };
}

const COLORS = { error: "#FF6B6B", warn: "#F59E0B", ok: "#22C55E" };

export default function IamValidator() {
  const [input, setInput] = useState(SAMPLE);
  const { issues, summary } = useMemo(() => analyzePolicy(input), [input]);

  return (
    <div>
      <label style={fieldLabel}>IAM Policy JSON</label>
      <textarea style={{ ...inputStyle, height: 200 }} value={input} onChange={e => setInput(e.target.value)} />

      {summary.length > 0 && (
        <div style={{ margin: "12px 0", display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={fieldLabel}>Statements</label>
          {summary.map((s, i) => (
            <div key={i} style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
              <span style={{ color: s.effect === "Allow" ? "#22C55E" : "#EF4444", fontWeight: 700, marginRight: 8 }}>{s.effect}</span>
              <span style={{ color: "#B7BBD0" }}>{s.actions.join(", ")}{s.more > 0 ? ` +${s.more} more` : ""}</span>
              <span style={{ color: "#4E5468", marginLeft: 8 }}>on</span>
              <span style={{ color: "#34E4B8", marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{s.resource}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {issues.map((issue, i) => (
          <div key={i} style={{ padding: "9px 14px", borderRadius: 8, background: `${COLORS[issue.level] || "#34E4B8"}11`, border: `1px solid ${COLORS[issue.level] || "#34E4B8"}33` }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: COLORS[issue.level] || "#34E4B8", textTransform: "uppercase", letterSpacing: 1, marginRight: 8 }}>{issue.level}</span>
            <span style={{ fontSize: 12.5, color: "#E7E9F2" }}>{issue.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
