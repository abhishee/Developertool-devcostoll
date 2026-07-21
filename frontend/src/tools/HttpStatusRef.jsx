import React, { useMemo, useState } from "react";

const inputStyle = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "9px 12px", color: "#E7E9F2", fontFamily: "Inter, sans-serif", fontSize: 13, outline: "none" };

const STATUSES = [
  [100,"Continue"],[101,"Switching Protocols"],[102,"Processing"],[103,"Early Hints"],
  [200,"OK"],[201,"Created"],[202,"Accepted"],[204,"No Content"],[206,"Partial Content"],
  [301,"Moved Permanently"],[302,"Found"],[304,"Not Modified"],[307,"Temporary Redirect"],[308,"Permanent Redirect"],
  [400,"Bad Request"],[401,"Unauthorized"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],
  [408,"Request Timeout"],[409,"Conflict"],[410,"Gone"],[422,"Unprocessable Entity"],[429,"Too Many Requests"],
  [500,"Internal Server Error"],[501,"Not Implemented"],[502,"Bad Gateway"],[503,"Service Unavailable"],[504,"Gateway Timeout"],
];

const DETAILS = {
  200: "The request succeeded.",
  201: "A new resource was created.",
  204: "Success with no response body.",
  400: "The server couldn't understand the request due to invalid syntax.",
  401: "Authentication is required. The client must authenticate itself.",
  403: "The client does not have access rights. Unlike 401, the client's identity is known.",
  404: "The server cannot find the requested resource.",
  405: "The request method is known but not supported by the target resource.",
  429: "The client has sent too many requests in a given time — rate limiting.",
  500: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
  502: "The server, acting as a gateway, received an invalid response from an upstream server.",
  503: "The server is not ready to handle the request — down for maintenance or overloaded.",
  504: "The gateway did not receive a timely response from an upstream server.",
};

function color(code) {
  if (code < 200) return "#6366F1";
  if (code < 300) return "#22C55E";
  if (code < 400) return "#3B82F6";
  if (code < 500) return "#F59E0B";
  return "#EF4444";
}
function label(code) {
  if (code < 200) return "1xx Info";
  if (code < 300) return "2xx Success";
  if (code < 400) return "3xx Redirect";
  if (code < 500) return "4xx Client Error";
  return "5xx Server Error";
}

export default function HttpStatusRef() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATUSES.filter(([code, name]) =>
      String(code).includes(q) || name.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div>
      <input style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 14 }}
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by code or name…" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflowY: "auto" }}>
        {filtered.map(([code, name]) => {
          const c = color(code);
          return (
            <div key={code} style={{ background: "#0D0F16", border: "1px solid #1F2330", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: c, width: 44 }}>{code}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E7E9F2" }}>{name}</div>
                  <div style={{ fontSize: 10, color: c, marginTop: 1 }}>{label(code)}</div>
                </div>
              </div>
              {DETAILS[code] && <div style={{ marginTop: 6, fontSize: 12, color: "#7A8099", paddingLeft: 56 }}>{DETAILS[code]}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
