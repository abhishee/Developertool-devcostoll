import React, { useState, useEffect } from "react";

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "10px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12, resize: "none", outline: "none", boxSizing: "border-box", height: 220,
};
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const SAMPLES = {
  sequence: `@startuml
actor User
participant API
database DB
User -> API : POST /login
API -> DB : SELECT user
DB --> API : user row
API --> User : JWT token
@enduml`,
  class: `@startuml
class User {
  +id: String
  +email: String
  +login()
}
class Order {
  +userId: String
  +total: Float
  +place()
}
User "1" --> "0..*" Order
@enduml`,
  component: `@startuml
package "DevCostoll" {
  [Frontend] --> [API Gateway]
  [API Gateway] --> [Auth Service]
  [API Gateway] --> [Tool Service]
  [Tool Service] --> [Database]
}
@enduml`,
};

// Encode to plantuml hex format for the public server
function encodePlantUml(str) {
  const deflated = unescape(encodeURIComponent(str));
  const charArr = deflated.split("").map(c => c.charCodeAt(0));
  const encode64 = (b) => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    return chars[b];
  };
  let result = "";
  for (let i = 0; i < charArr.length; i += 3) {
    const b0 = charArr[i], b1 = charArr[i+1] ?? 0, b2 = charArr[i+2] ?? 0;
    result += encode64(b0 >> 2);
    result += encode64(((b0 & 3) << 4) | (b1 >> 4));
    result += encode64(((b1 & 15) << 2) | (b2 >> 6));
    result += encode64(b2 & 63);
  }
  return result;
}

export default function PlantUmlRenderer() {
  const [code, setCode] = useState(SAMPLES.sequence);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    try {
      const encoded = encodePlantUml(code);
      setImgUrl(`https://www.plantuml.com/plantuml/png/${encoded}`);
    } catch { setImgUrl(""); }
  }, [code]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {Object.keys(SAMPLES).map(k => (
          <button key={k} onClick={() => setCode(SAMPLES[k])}
            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", cursor: "pointer" }}>
            {k}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={fieldLabel}>PlantUML</label>
          <textarea style={inputStyle} value={code} onChange={e => setCode(e.target.value)} />
        </div>
        <div>
          <label style={fieldLabel}>Preview (via plantuml.com)</label>
          <div style={{ height: 220, background: "#fff", borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {imgUrl && <img src={imgUrl} alt="PlantUML diagram" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <a href={imgUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#7C5CFF", textDecoration: "none" }}>Open full size ↗</a>
      </div>
    </div>
  );
}
