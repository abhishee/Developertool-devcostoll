import React, { useState, useEffect } from "react";

const LS_KEY = "devcostoll_notes";
const inputStyle = { width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 12px", color: "#E7E9F2", fontFamily: "Inter, sans-serif", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}

export default function QuickNotes() {
  const [notes, setNotes] = useState(load);
  const [active, setActive] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(notes)); }, [notes]);

  const newNote = () => {
    const n = { id: Date.now(), title: "Untitled", body: "", created: new Date().toISOString() };
    setNotes(ns => [n, ...ns]);
    open(n);
  };

  const open = (n) => { setActive(n.id); setTitle(n.title); setBody(n.body); };

  const save = () => {
    setNotes(ns => ns.map(n => n.id === active ? { ...n, title: title || "Untitled", body } : n));
  };

  const del = (id) => {
    setNotes(ns => ns.filter(n => n.id !== id));
    if (active === id) { setActive(null); setTitle(""); setBody(""); }
  };

  const activeNote = notes.find(n => n.id === active);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, minHeight: 340 }}>
      <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <button onClick={newNote} style={{ padding: "10px 14px", background: "#7C5CFF", border: "none", color: "#0A0C10", fontWeight: 700, fontSize: 12.5, cursor: "pointer", textAlign: "left" }}>
          + New Note
        </button>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notes.length === 0 && <div style={{ padding: "12px 14px", fontSize: 12, color: "#4E5468" }}>No notes yet</div>}
          {notes.map(n => (
            <div key={n.id} onClick={() => open(n)} style={{
              padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid #171A24",
              background: active === n.id ? "rgba(124,92,255,0.12)" : "transparent",
            }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: active === n.id ? "#E7E9F2" : "#B7BBD0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title || "Untitled"}</div>
              <div style={{ fontSize: 11, color: "#4E5468", marginTop: 2 }}>{new Date(n.created).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        {activeNote ? (
          <>
            <input value={title} onChange={e => setTitle(e.target.value)} onBlur={save}
              style={{ ...inputStyle, marginBottom: 10, fontSize: 15, fontWeight: 700, border: "none", background: "transparent", padding: "4px 0", borderBottom: "1px solid #232735", borderRadius: 0 }}
              placeholder="Note title" />
            <textarea value={body} onChange={e => setBody(e.target.value)} onBlur={save}
              style={{ ...inputStyle, height: 240, lineHeight: 1.6 }}
              placeholder="Start writing…" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#4E5468" }}>{body.split(/\s+/).filter(Boolean).length} words</span>
              <button onClick={() => del(active)} style={{ fontSize: 11.5, color: "#FF6B6B", background: "none", border: "none", cursor: "pointer" }}>Delete note</button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#4E5468", fontSize: 13 }}>
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
}
