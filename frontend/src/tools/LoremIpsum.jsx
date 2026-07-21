import React, { useMemo, useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };
const inputStyle = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "7px 10px", color: "#E7E9F2", fontFamily: "Inter, sans-serif", fontSize: 13, outline: "none" };
const tabBtn = { background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5, padding: "6px 12px", borderRadius: 6, cursor: "pointer" };
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };

function randomWord(i) { return WORDS[i % WORDS.length]; }

function buildSentence(start) {
  const len = 8 + (start % 7);
  const words = Array.from({ length: len }, (_, i) => randomWord(start + i));
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function buildParagraph(start) {
  const sentences = 4 + (start % 3);
  return Array.from({ length: sentences }, (_, i) => buildSentence(start + i * 12)).join(" ");
}

export default function LoremIpsum() {
  const [unit, setUnit] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [startClassic, setStartClassic] = useState(true);

  const output = useMemo(() => {
    if (unit === "words") {
      const w = Array.from({ length: count }, (_, i) => randomWord(i + (startClassic ? 0 : 50)));
      return (startClassic ? "Lorem ipsum " : "") + w.join(" ");
    }
    if (unit === "sentences") {
      return Array.from({ length: count }, (_, i) => buildSentence(i * 12 + (startClassic ? 0 : 30))).join(" ");
    }
    return Array.from({ length: count }, (_, i) => {
      const p = buildParagraph(i * 40 + (startClassic ? 0 : 20));
      return i === 0 && startClassic ? "Lorem ipsum dolor sit amet, " + p.slice(p.indexOf(" ") + 1) : p;
    }).join("\n\n");
  }, [unit, count, startClassic]);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["words","sentences","paragraphs"].map(u => (
            <button key={u} onClick={() => setUnit(u)} style={{ ...tabBtn, ...(unit === u ? tabBtnActive : {}) }}>{u}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ ...fieldLabel, marginBottom: 0 }}>Count</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(Math.max(1, +e.target.value))} style={{ ...inputStyle, width: 64 }} />
        </div>
        <label style={{ fontSize: 12, color: "#B7BBD0", display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={startClassic} onChange={e => setStartClassic(e.target.checked)} />
          Start with "Lorem ipsum"
        </label>
      </div>
      <OutputBar value={output} label={`${count} ${unit}`} />
    </div>
  );
}
