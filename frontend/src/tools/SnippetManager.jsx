import React, { useState, useEffect } from "react";
import OutputBar from "../components/OutputBar.jsx";

const LS_KEY = "devcostoll_snippets";
const inputStyle = { width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "9px 12px", color: "#E7E9F2", fontFamily: "Inter, sans-serif", fontSize: 12.5, outline: "none", boxSizing: "border-box" };
const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const DEFAULTS = [
  { id: 1, title: "Async fetch wrapper", lang: "js", code: `async function fetchJson(url, options = {}) {\n  const res = await fetch(url, options);\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return res.json();\n}` },
  { id: 2, title: "UUID v4 (browser)", lang: "js", code: `const uuid = () => crypto.randomUUID();` },
  { id: 3, title: "SQL: paginated query", lang: "sql", code: `SELECT * FROM users\nWHERE is_active = true\nORDER BY created_at DESC\nLIMIT :limit OFFSET :offset;` },
];

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || DEFAULTS; } catch { return DEFAULTS; }
}

export default function SnippetManager() {
  const [snippets, setSnippets] = useState(load);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", lang: "js", code: "" });

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(snippets)); }, [snippets]);

  const filtered = snippets.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.lang.toLowerCase().includes(search.toLowerCase())
  );

  const startNew = () => { setForm({ title: "", lang: "js", code: "" }); setActive(null); setEditing(true); };
  const startEdit = (s) => { setForm({ title: s.title, lang: s.lang, code: s.code }); setActive(s.id); setEditing(true); };

  const save = () => {
    if (!form.title.trim()) return;
    if (active) {
      setSnippets(ss => ss.map(s => s.id === active ? { ...s, ...form } : s));
    } else {
      setSnippets(ss => [{ id: Date.now(), ...form }, ...ss]);
    }
    setEditing(false); setActive(null);
  };

  const del = (id) => { setSnippets(ss => ss.filter(s => s.id !== id)); if (active === id) { setActive(null); setEditing(false); } };

  const activeSnippet = snippets.find(s => s.id === active);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input style={{ ...inputStyle, flex: 1 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search snippets…" />
        <button onClick={startNew} style={{ padding: "8px 16px", background: "#7C5CFF", border: "none", color: "#0A0C10", fontWeight: 700, fontSize: 12.5, borderRadius: 8, cursor: "pointer" }}>+ New</button>
      </div>

      {editing ? (
        <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Snippet title" />
            <select value={form.lang} onChange={e => setForm(f => ({ ...f, lang: e.target.value }))}
              style={{ ...inputStyle, width: 90 }}>
              {["js","ts","jsx","tsx","py","go","sql","sh","json","yaml","html","css"].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <textarea value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
            style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, height: 130, resize: "vertical" }}
            placeholder="Paste your code here…" />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={save} style={{ padding: "7px 20px", background: "#7C5CFF", border: "none", color: "#0A0C10", fontWeight: 700, fontSize: 12, borderRadius: 7, cursor: "pointer" }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ padding: "7px 14px", background: "#0D0F16", border: "1px solid #232735", color: "#7A8099", fontSize: 12, borderRadius: 7, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      ) : activeSnippet ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#E7E9F2" }}>{activeSnippet.title}</span>
              <span style={{ marginLeft: 10, fontSize: 11, color: "#7C5CFF", background: "rgba(124,92,255,0.15)", padding: "2px 8px", borderRadius: 10 }}>{activeSnippet.lang}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => startEdit(activeSnippet)} style={{ fontSize: 12, color: "#B7BBD0", background: "#0D0F16", border: "1px solid #232735", padding: "5px 12px", borderRadius: 6, cursor: "pointer" }}>Edit</button>
              <button onClick={() => del(activeSnippet.id)} style={{ fontSize: 12, color: "#FF6B6B", background: "#0D0F16", border: "1px solid #FF6B6B44", padding: "5px 12px", borderRadius: 6, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
          <OutputBar value={activeSnippet.code} label={activeSnippet.lang} />
          <button onClick={() => setActive(null)} style={{ marginTop: 8, fontSize: 12, color: "#7A8099", background: "none", border: "none", cursor: "pointer" }}>← Back to list</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.length === 0 && <div style={{ color: "#4E5468", fontSize: 13, padding: "12px 0" }}>No snippets found</div>}
          {filtered.map(s => (
            <div key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "10px 14px", background: "#0D0F16", border: "1px solid #1F2330",
              borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#7C5CFF44"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1F2330"}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#E7E9F2" }}>{s.title}</span>
                <span style={{ marginLeft: 8, fontSize: 11, color: "#7C5CFF" }}>{s.lang}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
