import React, { useMemo, useState } from "react";

const inputStyle = {
  background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "9px 12px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13, outline: "none",
};
const statCard = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 12px" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

function ipToLong(ip) {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}
function longToIp(long) {
  return [(long >>> 24) & 255, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join(".");
}

function calc(cidr) {
  const [ip, prefix] = cidr.trim().split("/");
  const bits = parseInt(prefix, 10);
  if (!ip || isNaN(bits) || bits < 0 || bits > 32) return null;
  const parts = ip.split(".");
  if (parts.length !== 4 || parts.some(p => isNaN(+p) || +p < 0 || +p > 255)) return null;

  const mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
  const ipLong = ipToLong(ip);
  const network = (ipLong & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const total = Math.pow(2, 32 - bits);
  const usable = total <= 2 ? 0 : total - 2;

  return {
    network: longToIp(network),
    broadcast: longToIp(broadcast),
    first: total > 2 ? longToIp(network + 1) : "N/A",
    last: total > 2 ? longToIp(broadcast - 1) : "N/A",
    mask: longToIp(mask),
    wildcard: longToIp(~mask >>> 0),
    total: total.toLocaleString(),
    usable: usable.toLocaleString(),
    bits,
  };
}

export default function CidrCalculator() {
  const [cidr, setCidr] = useState("192.168.1.0/24");
  const result = useMemo(() => calc(cidr), [cidr]);

  const fields = result ? [
    ["Network Address", result.network],
    ["Broadcast Address", result.broadcast],
    ["Subnet Mask", result.mask],
    ["Wildcard Mask", result.wildcard],
    ["First Usable IP", result.first],
    ["Last Usable IP", result.last],
    ["Total Addresses", result.total],
    ["Usable Hosts", result.usable],
  ] : [];

  return (
    <div>
      <label style={fieldLabel}>CIDR Block</label>
      <input
        style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
        value={cidr}
        onChange={e => setCidr(e.target.value)}
        placeholder="e.g. 10.0.0.0/16"
      />
      {!result && cidr.trim() && (
        <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ Invalid CIDR notation</div>
      )}
      {result && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginTop: 16 }}>
          {fields.map(([label, val]) => (
            <div key={label} style={statCard}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#34E4B8" }}>{val}</div>
              <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
