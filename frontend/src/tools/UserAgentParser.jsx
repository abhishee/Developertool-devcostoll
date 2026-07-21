import React, { useMemo, useState } from "react";

const inputStyle = { width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "9px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, outline: "none", boxSizing: "border-box" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const statCard = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 14px" };

function parseUA(ua) {
  const result = { browser: "Unknown", browserVersion: "", os: "Unknown", osVersion: "", engine: "Unknown", device: "Desktop", raw: ua };

  // Browser
  if (/Edg\//.test(ua))          { result.browser = "Edge";    result.browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || ""; }
  else if (/OPR\//.test(ua))     { result.browser = "Opera";   result.browserVersion = ua.match(/OPR\/([\d.]+)/)?.[1] || ""; }
  else if (/Chrome\//.test(ua))  { result.browser = "Chrome";  result.browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || ""; }
  else if (/Firefox\//.test(ua)) { result.browser = "Firefox"; result.browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || ""; }
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) { result.browser = "Safari"; result.browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || ""; }

  // Engine
  if (/Gecko\//.test(ua) && /rv:/.test(ua)) result.engine = "Gecko";
  else if (/WebKit\//.test(ua)) result.engine = "WebKit";
  else if (/Trident\//.test(ua)) result.engine = "Trident";
  else if (/Presto\//.test(ua)) result.engine = "Presto";
  if (/Blink/.test(ua)) result.engine = "Blink";

  // OS
  if (/Windows NT 10/.test(ua))  { result.os = "Windows"; result.osVersion = "10/11"; }
  else if (/Windows NT 6.1/.test(ua)) { result.os = "Windows"; result.osVersion = "7"; }
  else if (/Mac OS X ([\d_]+)/.test(ua)) { result.os = "macOS"; result.osVersion = ua.match(/Mac OS X ([\d_.]+)/)?.[1].replace(/_/g, ".") || ""; }
  else if (/Android ([\d.]+)/.test(ua)) { result.os = "Android"; result.osVersion = ua.match(/Android ([\d.]+)/)?.[1] || ""; result.device = "Mobile"; }
  else if (/iPhone OS ([\d_]+)/.test(ua)) { result.os = "iOS"; result.osVersion = ua.match(/iPhone OS ([\d_]+)/)?.[1].replace(/_/g, ".") || ""; result.device = "Mobile"; }
  else if (/iPad/.test(ua)) { result.os = "iPadOS"; result.device = "Tablet"; }
  else if (/Linux/.test(ua)) { result.os = "Linux"; }

  return result;
}

const UAS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

export default function UserAgentParser() {
  const [ua, setUa] = useState(UAS[0]);
  const parsed = useMemo(() => parseUA(ua), [ua]);

  const fields = [
    ["Browser",          parsed.browser],
    ["Browser Version",  parsed.browserVersion || "—"],
    ["Engine",           parsed.engine],
    ["OS",               parsed.os],
    ["OS Version",       parsed.osVersion || "—"],
    ["Device type",      parsed.device],
  ];

  return (
    <div>
      <label style={fieldLabel}>User-Agent string</label>
      <textarea style={{ ...inputStyle, height: 70, resize: "vertical", fontFamily: "'JetBrains Mono', monospace" }} value={ua} onChange={e => setUa(e.target.value)} />
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 14px" }}>
        {UAS.map((u, i) => (
          <button key={i} onClick={() => setUa(u)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: "#0D0F16", border: "1px solid #232735", color: "#7A8099", cursor: "pointer" }}>
            Sample {i + 1}
          </button>
        ))}
        <button onClick={() => setUa(navigator.userAgent)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, background: "rgba(124,92,255,0.15)", border: "1px solid #7C5CFF44", color: "#7C5CFF", cursor: "pointer" }}>
          My Browser
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
        {fields.map(([label, val]) => (
          <div key={label} style={statCard}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "#34E4B8" }}>{val}</div>
            <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
