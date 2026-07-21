import React, { useState, useEffect, useRef } from "react";

const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const MODES = [
  { id: "focus",  label: "Focus",       mins: 25, color: "#7C5CFF" },
  { id: "short",  label: "Short Break", mins: 5,  color: "#34E4B8" },
  { id: "long",   label: "Long Break",  mins: 15, color: "#3B82F6" },
];

export default function PomodoroTimer() {
  const [mode, setMode] = useState("focus");
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const currentMode = MODES.find(m => m.id === mode);

  const reset = (m) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    const mins = MODES.find(x => x.id === m).mins;
    setSecs(mins * 60);
  };

  const switchMode = (m) => { setMode(m); reset(m); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === "focus") setSessions(n => n + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const total = currentMode.mins * 60;
  const pct = ((total - secs) / total) * 100;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const r = 64;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => switchMode(m.id)} style={{
            padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
            border: `1px solid ${mode === m.id ? m.color : "#232735"}`,
            background: mode === m.id ? `${m.color}22` : "#0D0F16",
            color: mode === m.id ? m.color : "#7A8099",
          }}>{m.label}</button>
        ))}
      </div>

      <div style={{ position: "relative", width: 180, height: 180 }}>
        <svg width={180} height={180} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={90} cy={90} r={r} fill="none" stroke="#1F2330" strokeWidth={8} />
          <circle cx={90} cy={90} r={r} fill="none" stroke={currentMode.color} strokeWidth={8}
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "#E7E9F2", letterSpacing: 2 }}>{mm}:{ss}</span>
          <span style={{ fontSize: 11, color: currentMode.color, textTransform: "uppercase", letterSpacing: 1 }}>{currentMode.label}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "10px 28px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700,
          background: currentMode.color, border: "none", color: "#0A0C10",
        }}>{running ? "Pause" : secs === 0 ? "Restart" : "Start"}</button>
        <button onClick={() => reset(mode)} style={{
          padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13,
          background: "#0D0F16", border: "1px solid #232735", color: "#7A8099",
        }}>Reset</button>
      </div>

      <div style={{ fontSize: 13, color: "#7A8099" }}>
        Sessions completed today: <strong style={{ color: "#E7E9F2" }}>{sessions}</strong>
      </div>
    </div>
  );
}
