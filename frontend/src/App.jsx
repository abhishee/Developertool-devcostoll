import React, { useState, useMemo, useCallback } from "react";
import anyAscii from "any-ascii";
import {
  Braces, KeyRound, Fingerprint, Regex, CaseSensitive,
  FileText, GitBranch, Binary, ShieldCheck,
  RefreshCw, Search, Terminal, Zap, ChevronRight,
  Send, Database, FileCode, Cloud, Table2, ArrowRightLeft, Server,
  Code2, Lock, Hash, Wifi, Link, Globe, Network, Timer, Palette,
  Workflow, Boxes, ScanLine, BarChart2, Image, FileArchive,
  FileSearch, Clipboard, BookOpen, LayoutDashboard, HardDrive,
  Smartphone, GitMerge, GitCommit, Settings, Star, Clock,
} from "lucide-react";
import {
  SiJson, SiYaml, SiDocker, SiKubernetes, SiTerraform,
  SiGraphql, SiPostman, SiAmazonwebservices, SiMongodb,
  SiPostgresql, SiMarkdown, SiToml, SiGit, SiSvg, SiMermaid, SiJira,
} from "@icons-pack/react-simple-icons";

import OutputBar from "./components/OutputBar.jsx";
import ToolBadge from "./components/ToolBadge.jsx";
import { GROUP_COLORS, TOOLS as TOOL_REGISTRY } from "./registry/toolRegistry.js";
import TomlFormatter from "./tools/TomlFormatter.jsx";
import IniFormatter from "./tools/IniFormatter.jsx";
import MarkdownFormatter from "./tools/MarkdownFormatter.jsx";
import GraphqlExplorer from "./tools/GraphqlExplorer.jsx";
import WebsocketClient from "./tools/WebsocketClient.jsx";
import JsonFormatter from "./tools/JsonFormatter.jsx";
import Base64Tool from "./tools/Base64Tool.jsx";
import JwtDecoder from "./tools/JwtDecoder.jsx";
import TextDiff from "./tools/TextDiff.jsx";
import GitignoreGenerator from "./tools/GitignoreGenerator.jsx";
import DockerfileLinter from "./tools/DockerfileLinter.jsx";
import K8sValidator from "./tools/K8sValidator.jsx";
import ConventionalCommit from "./tools/ConventionalCommit.jsx";
import IamValidator from "./tools/IamValidator.jsx";
import CidrCalculator from "./tools/CidrCalculator.jsx";
import EnvParser from "./tools/EnvParser.jsx";
import ColorConverter from "./tools/ColorConverter.jsx";
import TimestampConverter from "./tools/TimestampConverter.jsx";
import NumberBaseConverter from "./tools/NumberBaseConverter.jsx";
import MermaidEditor from "./tools/MermaidEditor.jsx";
import PlantUmlRenderer from "./tools/PlantUmlRenderer.jsx";
import AsciiArtGenerator from "./tools/AsciiArtGenerator.jsx";
import SvgPreviewer from "./tools/SvgPreviewer.jsx";
import LoremIpsum from "./tools/LoremIpsum.jsx";
import StringEscape from "./tools/StringEscape.jsx";
import LineTools from "./tools/LineTools.jsx";
import FileHash from "./tools/FileHash.jsx";
import ImageInfo from "./tools/ImageInfo.jsx";
import PomodoroTimer from "./tools/PomodoroTimer.jsx";
import QuickNotes from "./tools/QuickNotes.jsx";
import SnippetManager from "./tools/SnippetManager.jsx";
import HttpStatusRef from "./tools/HttpStatusRef.jsx";
import UserAgentParser from "./tools/UserAgentParser.jsx";
import OpenApiViewer from "./tools/OpenApiViewer.jsx";
import MongoQueryBuilder from "./tools/MongoQueryBuilder.jsx";

// ---------------------------------------------------------------
// DevCostoll — token system
// bg: #0A0C10 (near-black graphite)  surface: #14171F  surface2: #1B1F2A
// accent: #7C5CFF (signal violet)    accent2: #34E4B8 (terminal mint)
// text: #E7E9F2   muted: #7A8099     border: #232735
// display: "Space Grotesk"  body: "Inter"  mono: "JetBrains Mono"
// Signature: a live "scanline" cursor rail down the left of the active
// tool panel — evokes a terminal caret / build log, ties every tool
// back to the idea of a running process.
// ---------------------------------------------------------------

const inputStyle = {
  width: "100%", background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "12px 14px", color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5, resize: "vertical", outline: "none", boxSizing: "border-box"
};

const fieldLabel = { fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", marginBottom: 6, display: "block" };

const statCard = { background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "10px 8px", textAlign: "center" };

const tabBtn = {
  background: "#0D0F16", border: "1px solid #232735", color: "#B7BBD0", fontSize: 11.5,
  padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "Inter, sans-serif", textTransform: "capitalize"
};
const tabBtnActive = { background: "#7C5CFF", borderColor: "#7C5CFF", color: "#0A0C10", fontWeight: 600 };
const btnPrimary = {
  display: "flex", alignItems: "center", gap: 6, background: "#7C5CFF", border: "none",
  color: "#0A0C10", fontWeight: 600, fontSize: 12.5, padding: "8px 14px", borderRadius: 7, cursor: "pointer"
};
const btnGhost = {
  display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid #232735",
  color: "#B7BBD0", fontWeight: 500, fontSize: 12, padding: "7px 12px", borderRadius: 7, cursor: "pointer"
};
const pill = {
  fontSize: 11, padding: "5px 10px", borderRadius: 20, border: "1px solid",
  fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center"
};
const ticketCard = {
  background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "9px 12px"
};
const liveNote = {
  marginTop: 14, display: "flex", gap: 8, background: "rgba(124,92,255,0.08)",
  border: "1px solid rgba(124,92,255,0.25)", borderRadius: 8, padding: "10px 12px",
  fontSize: 12, color: "#B7BBD0", lineHeight: 1.5
};

const BACKEND_URL = "";

// ---------------- Individual tools ----------------

function UuidGenerator() {
  const [ids, setIds] = useState([crypto.randomUUID()]);
  const [count, setCount] = useState(5);
  const generate = () => setIds(Array.from({ length: count }, () => crypto.randomUUID()));
  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <label style={{ ...fieldLabel, marginBottom: 0 }}>Count</label>
        <input type="number" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)} style={{ ...inputStyle, width: 70, padding: "6px 10px" }} />
        <button onClick={generate} style={btnPrimary}><RefreshCw size={13} /> Generate</button>
      </div>
      <OutputBar value={ids.join("\n")} label={`${ids.length} UUIDs`} />
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [policyMode, setPolicyMode] = useState(false);
  const [policy, setPolicy] = useState({ upper: 2, lower: 2, digits: 2, symbols: 1 });
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [useBackend, setUseBackend] = useState(false);
  const [loading, setLoading] = useState(false);

  const sets = {
    upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
    lower: "abcdefghijkmnpqrstuvwxyz",
    digits: "23456789",
    symbols: "!@#$%^&*_-+=?",
  };

  const generateLocal = () => {
    const bodyLength = Math.max(length - prefix.length - suffix.length, 0);

    if (policyMode) {
      const minTotal = Object.values(policy).reduce((a, b) => a + b, 0);
      if (minTotal > bodyLength) {
        setError(`Policy needs at least ${minTotal} characters but only ${bodyLength} are available after prefix/suffix. Increase length or lower policy minimums.`);
        setPw("");
        return;
      }
      let chars = [];
      Object.entries(policy).forEach(([k, n]) => {
        const arr = crypto.getRandomValues(new Uint32Array(n));
        for (let i = 0; i < n; i++) chars.push(sets[k][arr[i] % sets[k].length]);
      });
      const remaining = bodyLength - chars.length;
      const pool = Object.keys(policy).filter(k => policy[k] > 0).map(k => sets[k]).join("") || sets.lower;
      const arr = crypto.getRandomValues(new Uint32Array(remaining));
      for (let i = 0; i < remaining; i++) chars.push(pool[arr[i] % pool.length]);
      for (let i = chars.length - 1; i > 0; i--) {
        const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      setPw(prefix + chars.join("") + suffix);
      return;
    }

    let pool = Object.keys(opts).filter(k => opts[k]).map(k => sets[k]).join("");
    if (!pool) pool = sets.lower;
    const arr = crypto.getRandomValues(new Uint32Array(bodyLength));
    const body = Array.from(arr, n => pool[n % pool.length]).join("");
    setPw(prefix + body + suffix);
  };

  const generateRemote = async () => {
    setLoading(true);
    try {
      const payload = { length, prefix, suffix };
      if (policyMode) payload.policy = policy;
      else payload.charsets = Object.keys(opts).filter(k => opts[k]);
      const r = await fetch(`${BACKEND_URL}/api/tools/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error || "Backend request failed"); setPw(""); }
      else { setPw(data.password); setError(""); }
    } catch {
      setError(`Can't reach backend — is it running on port 4000?`);
      generateLocal();
    } finally {
      setLoading(false);
    }
  };

  const generate = () => {
    setError("");
    useBackend ? generateRemote() : generateLocal();
  };

  React.useEffect(generateLocal, []);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setPolicyMode(false)} style={{ ...tabBtn, ...(!policyMode ? tabBtnActive : {}) }}>Simple</button>
        <button onClick={() => setPolicyMode(true)} style={{ ...tabBtn, ...(policyMode ? tabBtnActive : {}) }}>Policy-based</button>
        <label style={{ fontSize: 11.5, color: "#B7BBD0", display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <input type="checkbox" checked={useBackend} onChange={e => setUseBackend(e.target.checked)} />
          generate via backend
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={fieldLabel}>Total length: {length}</label>
          <input type="range" min={8} max={64} value={length} onChange={e => setLength(+e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={fieldLabel}>Prefix</label>
          <input value={prefix} onChange={e => setPrefix(e.target.value)} style={{ ...inputStyle, padding: "7px 10px" }} placeholder="e.g. @Dev_" />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={fieldLabel}>Suffix</label>
          <input value={suffix} onChange={e => setSuffix(e.target.value)} style={{ ...inputStyle, padding: "7px 10px" }} placeholder="e.g. !26" />
        </div>
      </div>

      {!policyMode ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 12 }}>
          {Object.keys(opts).map(k => (
            <label key={k} style={{ fontSize: 12, color: "#B7BBD0", display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={opts[k]} onChange={e => setOpts({ ...opts, [k]: e.target.checked })} />
              {k}
            </label>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
          {Object.keys(policy).map(k => (
            <div key={k}>
              <label style={fieldLabel}>min {k}</label>
              <input type="number" min={0} max={20} value={policy[k]} onChange={e => setPolicy({ ...policy, [k]: Math.max(0, +e.target.value) })} style={{ ...inputStyle, padding: "6px 8px" }} />
            </div>
          ))}
        </div>
      )}

      <button onClick={generate} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}>
        <RefreshCw size={13} /> {loading ? "Generating…" : "Generate"}
      </button>
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>}
      {pw && <OutputBar value={pw} label={useBackend ? "Password (backend)" : "Password (local)"} />}
    </div>
  );
}

function HashGenerator() {
  const [input, setInput] = useState("DevCostoll");
  const [algo, setAlgo] = useState("SHA-256");
  const [hash, setHash] = useState("");
  React.useEffect(() => {
    (async () => {
      if (!input) return setHash("");
      const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(input));
      setHash(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join(""));
    })();
  }, [input, algo]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map(a => (
          <button key={a} onClick={() => setAlgo(a)} style={{ ...tabBtn, ...(algo === a ? tabBtnActive : {}) }}>{a}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 70 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={hash} label={algo} />
    </div>
  );
}

// ─── Advanced Regex Tester ────────────────────────────────────────────────────
// Features: flag toggles (g i m s u v d), named capture groups, live highlight,
// replace mode, match details table, unicode categories, common pattern library.
function RegexTester() {
  const [pattern, setPattern] = useState("[A-Z][A-Z0-9]{1,9}-\\d+");
  const [text, setText]       = useState("fix(auth): resolve login bug DEVC-142\nfeat(api): add gRPC support PROJ-98\nchore: bump deps ENG-4\nEmail: user@example.com | IP: 192.168.1.1");
  const [replaceWith, setReplaceWith] = useState("[$&]");
  const [mode, setMode]       = useState("match");
  const [flags, setFlags]     = useState({ g: true, i: false, m: true, s: false, u: true, d: false });
  const [activePreset, setActivePreset] = useState(null);

  // ── AI Regex Generator ──────────────────────────────────────────────────
  const [aiDesc,        setAiDesc]        = useState("");
  const [aiLoading,     setAiLoading]     = useState(false);
  const [aiError,       setAiError]       = useState("");
  const [aiResult,      setAiResult]      = useState(null);   // { pattern, flags, explanation, examples }
  const [showAiPanel,   setShowAiPanel]   = useState(true);

  const generateRegex = async () => {
    if (!aiDesc.trim()) return;
    setAiLoading(true); setAiError(""); setAiResult(null);
    try {
      const r = await fetch("/api/ai/regex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: aiDesc }),
      });
      const data = await r.json();
      if (!r.ok) { setAiError(data.error || "Request failed"); return; }
      setAiResult(data);
      // Auto-apply to the tester
      setPattern(data.pattern);
      setActivePreset(null);
      const newFlags = { g: false, i: false, m: false, s: false, u: false, d: false };
      for (const f of (data.flags || "").split("")) if (f in newFlags) newFlags[f] = true;
      setFlags(newFlags);
    } catch {
      setAiError("Can't reach backend — is it running? (cd backend && npm start)");
    } finally {
      setAiLoading(false);
    }
  };

  const FLAG_DOCS = {
    g: "global — find all matches",
    i: "ignore case",
    m: "multiline — ^ and $ match line boundaries",
    s: "dotAll — dot matches newlines too",
    u: "unicode — full Unicode support",
    d: "indices — include match start/end indices",
  };

  const PRESETS = [
    { label: "Jira Ticket",    pattern: "[A-Z][A-Z0-9]{1,9}-\\d+",          flags: "g" },
    { label: "Email",          pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "gi" },
    { label: "URL",            pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*",  flags: "gi" },
    { label: "IPv4",           pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",  flags: "g" },
    { label: "Hex Color",      pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b", flags: "g" },
    { label: "ISO Date",       pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", flags: "g" },
    { label: "Semver",         pattern: "\\bv?(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-[\\w.]+)?\\b", flags: "gi" },
    { label: "UUID",           pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", flags: "gi" },
    { label: "CC Number",      pattern: "\\b(?:\\d[ -]?){13,16}\\b",         flags: "g" },
    { label: "Phone (intl)",   pattern: "\\+?[1-9]\\d{1,14}",                flags: "g" },
    { label: "Named Groups",   pattern: "(?<proj>[A-Z]+)-(?<num>\\d+)",       flags: "g" },
    { label: "HTML Tag",       pattern: "<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>", flags: "gis" },
  ];

  const flagStr = Object.entries(flags).filter(([,v]) => v).map(([k]) => k).join("");

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: "", replaced: "" };
    try {
      const re = new RegExp(pattern, flagStr);
      if (mode === "replace") {
        const replaced = text.replace(re, replaceWith);
        return { matches: [], error: "", replaced };
      }
      const allMatches = [...text.matchAll(new RegExp(pattern, flagStr.includes("g") ? flagStr : flagStr + "g"))];
      return { matches: allMatches, error: "", replaced: "" };
    } catch (e) {
      return { matches: [], error: e.message, replaced: "" };
    }
  }, [pattern, flagStr, text, mode, replaceWith]);

  // Build highlighted HTML for the test string
  const highlighted = useMemo(() => {
    if (!pattern || result.error || mode === "replace") return null;
    try {
      const re = new RegExp(pattern, flagStr.includes("g") ? flagStr : flagStr + "g");
      const COLORS = ["#7C5CFF","#3B82F6","#10B981","#F59E0B","#EC4899","#EF4444","#06B6D4"];
      let html = "";
      let last = 0;
      let idx  = 0;
      const escaped = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      for (const m of result.matches) {
        const start = m.index;
        const end   = start + m[0].length;
        html += escaped(text.slice(last, start));
        const c = COLORS[idx % COLORS.length];
        html += `<mark style="background:${c}33;color:${c};border-radius:3px;padding:0 2px;border:1px solid ${c}55">${escaped(m[0])}</mark>`;
        last = end;
        idx++;
      }
      html += escaped(text.slice(last));
      return html.replace(/\n/g, "<br/>");
    } catch { return null; }
  }, [pattern, flagStr, text, result]);

  const applyPreset = (p) => {
    setPattern(p.pattern);
    const pf = {};
    for (const k of Object.keys(flags)) pf[k] = p.flags.includes(k);
    setFlags(pf);
    setActivePreset(p.label);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── AI Regex Generator ── */}
      <div style={{ background: "linear-gradient(135deg,rgba(124,92,255,0.1),rgba(52,228,184,0.06))", border: "1px solid rgba(124,92,255,0.3)", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showAiPanel ? 12 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13.5, color: "#E7E9F2" }}>AI Regex Generator</span>
            <span style={{ fontSize: 10, background: "#7C5CFF", color: "#fff", borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>AI</span>
          </div>
          <button onClick={() => setShowAiPanel(v => !v)} style={{ background: "none", border: "none", color: "#7A8099", cursor: "pointer", fontSize: 12 }}>
            {showAiPanel ? "▲ collapse" : "▼ expand"}
          </button>
        </div>

        {showAiPanel && (
          <>
            <div style={{ fontSize: 11.5, color: "#9195AB", marginBottom: 10 }}>
              Describe what you want to match in plain English — the AI writes the regex for you.
            </div>

            {/* Example prompts */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {[
                "Date in DD/MM/YYYY format",
                "Valid email address",
                "Phone number with country code",
                "Semantic version like 1.2.3",
                "Jira ticket key like PROJ-123",
                "Strong password (8+ chars, upper, lower, digit, symbol)",
                "IPv4 address",
                "Credit card number",
                "URL with optional path",
                "Named: first and last name",
              ].map(ex => (
                <button key={ex} onClick={() => setAiDesc(ex)} style={{
                  fontSize: 10.5, padding: "3px 9px", borderRadius: 6, cursor: "pointer",
                  background: aiDesc === ex ? "rgba(124,92,255,0.2)" : "#0D0F16",
                  border: `1px solid ${aiDesc === ex ? "#7C5CFF55" : "#232735"}`,
                  color: aiDesc === ex ? "#7C5CFF" : "#7A8099",
                }}>{ex}</button>
              ))}
            </div>

            {/* Description input + generate button */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={aiDesc}
                onChange={e => setAiDesc(e.target.value)}
                onKeyDown={e => e.key === "Enter" && generateRegex()}
                placeholder="e.g. 'match a date in YYYY-MM-DD format' or 'UK postcode'"
                style={{ ...inputStyle, flex: 1, padding: "9px 12px" }}
              />
              <button
                onClick={generateRegex}
                disabled={aiLoading || !aiDesc.trim()}
                style={{ ...btnPrimary, opacity: aiLoading || !aiDesc.trim() ? 0.6 : 1, whiteSpace: "nowrap", flexShrink: 0 }}
              >
                <Zap size={13} /> {aiLoading ? "Generating…" : "Generate Regex"}
              </button>
            </div>

            {/* Error */}
            {aiError && (
              <div style={{ marginTop: 8, color: "#FF6B6B", fontSize: 12, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 7, padding: "7px 10px" }}>
                ⚠ {aiError}
              </div>
            )}

            {/* AI result card */}
            {aiResult && (
              <div style={{ marginTop: 10, background: "#0D0F16", border: "1px solid #1C2030", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#34E4B8", background: "rgba(52,228,184,0.1)", border: "1px solid rgba(52,228,184,0.25)", borderRadius: 6, padding: "3px 10px" }}>
                    /{aiResult.pattern}/{aiResult.flags}
                  </span>
                  <span style={{ fontSize: 10.5, color: "#4E5468" }}>✅ applied to tester</span>
                </div>

                {aiResult.explanation && (
                  <div style={{ fontSize: 12, color: "#B7BBD0", lineHeight: 1.5 }}>
                    <span style={{ color: "#7A8099" }}>Explanation: </span>{aiResult.explanation}
                  </div>
                )}

                {aiResult.examples?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Example matches</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {aiResult.examples.map((ex, i) => (
                        <button key={i} onClick={() => setText(ex)} title="Click to use as test string"
                          style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#7C5CFF", background: "rgba(124,92,255,0.1)", border: "1px solid rgba(124,92,255,0.25)", borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pattern input + flag toggles */}
      <div>
        <label style={fieldLabel}>Regular Expression</label>
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          <span style={{ background: "#0D0F16", border: "1px solid #232735", borderRight: "none", borderRadius: "8px 0 0 8px", padding: "0 10px", display: "flex", alignItems: "center", color: "#7A8099", fontSize: 15, fontFamily: "JetBrains Mono, monospace" }}>/</span>
          <input
            value={pattern}
            onChange={e => { setPattern(e.target.value); setActivePreset(null); }}
            style={{ ...inputStyle, flex: 1, borderRadius: 0, borderLeft: "none", borderRight: "none" }}
            placeholder="Enter regex pattern…"
            spellCheck={false}
          />
          <span style={{ background: "#0D0F16", border: "1px solid #232735", borderLeft: "none", borderRadius: "0 8px 8px 0", padding: "0 10px", display: "flex", alignItems: "center", color: "#7A8099", fontSize: 15, fontFamily: "JetBrains Mono, monospace" }}>/{flagStr}</span>
        </div>

        {/* Flag toggles */}
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {Object.entries(flags).map(([k, on]) => (
            <button
              key={k}
              title={FLAG_DOCS[k]}
              onClick={() => setFlags(f => ({ ...f, [k]: !f[k] }))}
              style={{
                padding: "3px 10px", borderRadius: 6, border: `1px solid ${on ? "#7C5CFF" : "#232735"}`,
                background: on ? "rgba(124,92,255,0.15)" : "#0D0F16",
                color: on ? "#7C5CFF" : "#7A8099", fontSize: 11.5, fontWeight: on ? 700 : 400,
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {k}
            </button>
          ))}
          <span style={{ fontSize: 10.5, color: "#4E5468", alignSelf: "center", marginLeft: 4 }}>
            Hover flags for info
          </span>
        </div>
      </div>

      {/* Common pattern presets */}
      <div>
        <label style={fieldLabel}>Common Patterns</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{
              padding: "3px 10px", borderRadius: 6, fontSize: 11,
              border: `1px solid ${activePreset === p.label ? "#34E4B8" : "#232735"}`,
              background: activePreset === p.label ? "rgba(52,228,184,0.12)" : "#0D0F16",
              color: activePreset === p.label ? "#34E4B8" : "#9195AB",
              cursor: "pointer",
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {["match", "replace"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>
            {m === "match" ? "🔍 Match" : "✏️ Replace"}
          </button>
        ))}
      </div>

      {/* Replace input */}
      {mode === "replace" && (
        <div>
          <label style={fieldLabel}>Replace with <span style={{ color: "#7A8099", textTransform: "none", fontWeight: 400 }}>($& = full match, $1 = group 1, ${"<name>"} = named group)</span></label>
          <input value={replaceWith} onChange={e => setReplaceWith(e.target.value)}
            style={{ ...inputStyle, padding: "9px 12px" }} placeholder="$&  or  $1  or  [$&]" />
        </div>
      )}

      {/* Test string */}
      <div>
        <label style={fieldLabel}>Test String</label>
        <textarea
          style={{ ...inputStyle, height: 110, lineHeight: 1.7 }}
          value={text}
          onChange={e => setText(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {result.error && (
        <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, padding: "8px 12px", color: "#FF6B6B", fontSize: 12 }}>
          ⚠ {result.error}
        </div>
      )}

      {/* Match mode results */}
      {mode === "match" && !result.error && (
        <>
          {/* Highlighted test string */}
          {highlighted && result.matches.length > 0 && (
            <div>
              <label style={fieldLabel}>Live Highlight — {result.matches.length} match{result.matches.length !== 1 ? "es" : ""}</label>
              <div
                style={{ ...inputStyle, height: "auto", minHeight: 80, resize: "none", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </div>
          )}
          {result.matches.length === 0 && !result.error && (
            <div style={{ color: "#7A8099", fontSize: 12.5, padding: "10px 0" }}>No matches found.</div>
          )}

          {/* Matches table */}
          {result.matches.length > 0 && (
            <div>
              <label style={fieldLabel}>Match Details</label>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace" }}>
                  <thead>
                    <tr>
                      {["#", "Match", "Index", ...(result.matches[0] && Object.keys(result.matches[0].groups || {}).length ? Object.keys(result.matches[0].groups) : [])].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "5px 10px", borderBottom: "1px solid #232735", color: "#7A8099", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.matches.map((m, i) => {
                      const namedGroups = Object.keys(m.groups || {});
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #13161F" }}>
                          <td style={{ padding: "5px 10px", color: "#4E5468" }}>{i + 1}</td>
                          <td style={{ padding: "5px 10px", color: "#34E4B8", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m[0]}</td>
                          <td style={{ padding: "5px 10px", color: "#7A8099" }}>{m.index}</td>
                          {namedGroups.map(g => (
                            <td key={g} style={{ padding: "5px 10px", color: "#B7BBD0" }}>{m.groups[g] ?? "—"}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Capture groups (numbered) */}
          {result.matches.length > 0 && result.matches[0].length > 1 && (
            <div>
              <label style={fieldLabel}>Capture Groups (first match)</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.matches[0].slice(1).map((g, i) => (
                  <div key={i} style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 7, padding: "5px 10px" }}>
                    <div style={{ fontSize: 9.5, color: "#7A8099", marginBottom: 2 }}>Group {i + 1}</div>
                    <div style={{ fontSize: 12, color: "#E7E9F2", fontFamily: "'JetBrains Mono', monospace" }}>{g ?? "undefined"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Replace mode result */}
      {mode === "replace" && !result.error && (
        <OutputBar value={result.replaced} label="Result after replace" />
      )}

      {/* Regex cheat sheet */}
      <details style={{ marginTop: 4 }}>
        <summary style={{ fontSize: 11.5, color: "#7A8099", cursor: "pointer", userSelect: "none" }}>📖 Quick Regex Cheat Sheet</summary>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginTop: 10 }}>
          {[
            [".","Any char except newline"],["\\d","Digit [0-9]"],["\\w","Word char [a-zA-Z0-9_]"],["\\s","Whitespace"],
            ["^","Start of string/line"],["$","End of string/line"],["*","0 or more"],["+ ","1 or more"],
            ["?","0 or 1 (optional)"],["\\b","Word boundary"],["[abc]","Character class"],["[^abc]","Negated class"],
            ["(abc)","Capture group"],["(?:abc)","Non-capturing group"],["(?<name>...)","Named capture group"],["(?=abc)","Positive lookahead"],
            ["(?!abc)","Negative lookahead"],["(?<=abc)","Positive lookbehind"],["\\p{L}","Unicode letter (u flag)"],["\\p{Emoji}","Unicode emoji (u flag)"],
          ].map(([sym, desc]) => (
            <div key={sym} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#34E4B8", background: "#0D0F16", border: "1px solid #232735", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>{sym}</code>
              <span style={{ fontSize: 11, color: "#7A8099" }}>{desc}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

function CaseConverter() {
  const [input, setInput] = useState("DevCostoll all developer tools one place");
  const toCase = (type) => {
    const words = input.trim().split(/\s+/);
    switch (type) {
      case "upper": return input.toUpperCase();
      case "lower": return input.toLowerCase();
      case "title": return words.map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      case "camel": return words.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
      case "snake": return words.map(w => w.toLowerCase()).join("_");
      case "kebab": return words.map(w => w.toLowerCase()).join("-");
      case "pascal": return words.map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join("");
      default: return input;
    }
  };
  const [active, setActive] = useState("title");
  return (
    <div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 70 }} value={input} onChange={e => setInput(e.target.value)} />
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {["upper", "lower", "title", "camel", "pascal", "snake", "kebab"].map(t => (
          <button key={t} onClick={() => setActive(t)} style={{ ...tabBtn, ...(active === t ? tabBtnActive : {}) }}>{t}</button>
        ))}
      </div>
      <OutputBar value={toCase(active)} />
    </div>
  );
}

function WordCounter() {
  const [text, setText] = useState("Paste your commit message, README, or doc draft here.");
  const stats = useMemo(() => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const lines = text.split("\n").length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    return { words: words.length, chars, charsNoSpace, lines, sentences };
  }, [text]);
  return (
    <div>
      <textarea style={{ ...inputStyle, height: 120 }} value={text} onChange={e => setText(e.target.value)} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 12 }}>
        {[["Words", stats.words], ["Chars", stats.chars], ["No spaces", stats.charsNoSpace], ["Lines", stats.lines], ["Sentences", stats.sentences]].map(([label, val]) => (
          <div key={label} style={statCard}>
            <div style={{ fontSize: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#7C5CFF" }}>{val}</div>
            <div style={{ fontSize: 10.5, color: "#7A8099", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Jira Ticket Finder ----

function JiraTicketFinder() {
  const [commitText, setCommitText] = useState(
    "git log --oneline\n\nfa21c3e fix(auth): handle expired token refresh DEVC-142\n8b9e01a feat(api): add gRPC client support PROJ-98\n1c4a77f chore: bump deps ENG-4"
  );
  const [domain, setDomain] = useState("yourcompany.atlassian.net");
  const [live, setLive] = useState({});
  const [backendUp, setBackendUp] = useState(null);

  const tickets = useMemo(() => {
    const re = /\b[A-Z][A-Z0-9]{1,9}-\d+\b/g;
    return [...new Set((commitText.match(re) || []))];
  }, [commitText]);

  const checkBackend = useCallback(async () => {
    try {
      const r = await fetch(`${BACKEND_URL}/api/health`);
      setBackendUp(r.ok);
    } catch {
      setBackendUp(false);
    }
  }, []);

  const fetchLive = async (key) => {
    setLive((s) => ({ ...s, [key]: { loading: true } }));
    try {
      const r = await fetch(`${BACKEND_URL}/api/jira/ticket/${key}`);
      const data = await r.json();
      setLive((s) => ({ ...s, [key]: { loading: false, data: r.ok ? data : null, error: r.ok ? null : data.error } }));
    } catch {
      setLive((s) => ({ ...s, [key]: { loading: false, error: "Can't reach backend — is it running on port 4000?" } }));
    }
  };

  const fetchAll = () => tickets.forEach(fetchLive);

  return (
    <div>
      <label style={fieldLabel}>Commit log / message(s)</label>
      <textarea style={{ ...inputStyle, height: 130 }} value={commitText} onChange={e => setCommitText(e.target.value)} placeholder="paste `git log` output or a commit message" />

      <label style={{ ...fieldLabel, marginTop: 12 }}>Jira domain</label>
      <input style={{ ...inputStyle, padding: "8px 12px" }} value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourcompany.atlassian.net" />

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <button onClick={fetchAll} style={btnPrimary}><Zap size={13} /> Fetch live status ({tickets.length})</button>
        <button onClick={checkBackend} style={btnGhost}><RefreshCw size={13} /> Check backend</button>
        {backendUp === true && <span style={{ ...pill, color: "#34E4B8", borderColor: "rgba(52,228,184,0.3)" }}>backend online</span>}
        {backendUp === false && <span style={{ ...pill, color: "#FF6B6B", borderColor: "rgba(255,107,107,0.3)" }}>backend unreachable</span>}
      </div>

      <div style={{ marginTop: 14 }}>
        <span style={{ ...fieldLabel, display: "block" }}>Detected tickets ({tickets.length})</span>
        {tickets.length === 0 && <div style={{ color: "#7A8099", fontSize: 12.5 }}>No ticket keys found — expects patterns like PROJ-123.</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {tickets.map(t => {
            const l = live[t];
            return (
              <div key={t} style={ticketCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href={`https://${domain}/browse/${t}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                    <GitBranch size={14} color="#34E4B8" />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: "#E7E9F2" }}>{t}</span>
                  </a>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => fetchLive(t)} style={{ ...btnGhost, padding: "4px 8px" }}>
                      {l?.loading ? "…" : "Fetch"}
                    </button>
                    <a href={`https://${domain}/browse/${t}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, color: "#7C5CFF", fontSize: 11.5, textDecoration: "none" }}>
                      Open <ChevronRight size={13} />
                    </a>
                  </div>
                </div>
                {l?.error && <div style={{ color: "#FF6B6B", fontSize: 11.5, marginTop: 6 }}>⚠ {l.error}</div>}
                {l?.data && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#B7BBD0", display: "grid", gap: 3 }}>
                    <div><strong style={{ color: "#E7E9F2" }}>{l.data.summary}</strong></div>
                    <div>Status: <span style={{ color: "#34E4B8" }}>{l.data.status}</span> · Assignee: {l.data.assignee}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={liveNote}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          Ticket-key detection runs locally. "Fetch live status" calls the Node/Express backend
          (devcostoll-backend) at {BACKEND_URL}, which holds your Jira API token server-side and
          proxies the real Jira REST API. Run it locally with `npm start` inside the backend
          folder — see its README.
        </span>
      </div>
    </div>
  );
}



// ---- Beautifier / Minifier (CSS + basic JS/HTML whitespace normalization) ----
// Note: this is a lightweight, dependency-free formatter — not a full
// language-aware engine like Prettier. Good enough for quick cleanup;
// flagged honestly rather than pretending it's more than it is.
function beautifyCss(css) {
  return css
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/,\s*/g, ",\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").trim();
}
function beautifyHtml(html) {
  let indent = 0;
  return html
    .replace(/></g, ">\n<")
    .split("\n")
    .map((line) => {
      if (/^<\//.test(line)) indent = Math.max(indent - 1, 0);
      const out = "  ".repeat(indent) + line.trim();
      if (/^<[^/!][^>]*[^/]>$/.test(line) && !/^<(br|img|input|hr|meta|link)/.test(line)) indent++;
      return out;
    })
    .join("\n");
}
function minifyHtml(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();
}

function Beautifier() {
  const [lang, setLang] = useState("css");
  const [mode, setMode] = useState("beautify");
  const [input, setInput] = useState(".card{padding:12px;  color:#fff; background:#111}\n.card:hover{opacity:.9}");
  const output = useMemo(() => {
    try {
      if (lang === "css") return mode === "beautify" ? beautifyCss(input) : minifyCss(input);
      return mode === "beautify" ? beautifyHtml(input) : minifyHtml(input);
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [lang, mode, input]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["css", "html"].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{ ...tabBtn, ...(lang === l ? tabBtnActive : {}) }}>{l}</button>
        ))}
        <span style={{ width: 1, background: "#232735", margin: "0 4px" }} />
        {["beautify", "minify"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>{m}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input ({lang.toUpperCase()})</label>
      <textarea style={{ ...inputStyle, height: 110 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} label={mode === "beautify" ? "Beautified" : "Minified"} />
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Lightweight, dependency-free formatter — good for quick cleanup, not a full Prettier-level engine yet.</span>
      </div>
    </div>
  );
}

// ---- AI Assistant — calls the Node/Express backend, which calls Claude ----
function AiAssistant() {
  const [code, setCode] = useState('function add(a, b) {\n  retun a + b\n}');
  const [action, setAction] = useState("explain");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const r = await fetch(`${BACKEND_URL}/api/ai/assist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action }),
      });
      const data = await r.json();
      if (!r.ok) setError(data.error || "Request failed");
      else setResult(data.result);
    } catch {
      setError(`Can't reach backend — is it running? Run: cd backend && npm start`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {[["explain", "Explain"], ["fix", "Fix bugs"], ["format", "Format"], ["tests", "Generate tests"]].map(([id, label]) => (
          <button key={id} onClick={() => setAction(id)} style={{ ...tabBtn, ...(action === id ? tabBtnActive : {}) }}>{label}</button>
        ))}
      </div>
      <label style={fieldLabel}>Code</label>
      <textarea style={{ ...inputStyle, height: 130 }} value={code} onChange={e => setCode(e.target.value)} />
      <button onClick={run} disabled={loading} style={{ ...btnPrimary, marginTop: 10, opacity: loading ? 0.6 : 1 }}>
        <Zap size={13} /> {loading ? "Thinking…" : "Run"}
      </button>
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>}
      {result && <OutputBar value={result} label="Result" />}
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Calls the backend (`/api/ai/assist`), which calls Claude with your `GROQ_API_KEY`. The key stays server-side, never in this page.</span>
      </div>
    </div>
  );
}

// ================= API Studio =================

// REST Client — genuine fetch() call from the browser. Works for any API
// that allows CORS from your origin; APIs that don't will show a CORS
// error, which is a browser security limit, not a bug in this tool.
function RestClient() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setLoading(true); setError(""); setResp(null);
    const started = performance.now();
    try {
      let parsedHeaders = {};
      try { parsedHeaders = headers.trim() ? JSON.parse(headers) : {}; } catch { throw new Error("Headers must be valid JSON"); }
      const r = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method !== "GET" && method !== "HEAD" && body.trim() ? body : undefined,
      });
      const ms = Math.round(performance.now() - started);
      const text = await r.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}
      setResp({ status: r.status, ok: r.ok, ms, body: pretty });
    } catch (e) {
      setError(e.message + " (often a CORS restriction from the target API, not this tool)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <select value={method} onChange={e => setMethod(e.target.value)} style={{ ...inputStyle, width: 100, padding: "8px 10px" }}>
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input value={url} onChange={e => setUrl(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="https://api.example.com/resource" />
        <button onClick={send} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}>
          <Send size={13} /> {loading ? "…" : "Send"}
        </button>
      </div>
      <label style={fieldLabel}>Headers (JSON)</label>
      <textarea style={{ ...inputStyle, height: 60 }} value={headers} onChange={e => setHeaders(e.target.value)} />
      {method !== "GET" && (
        <>
          <label style={{ ...fieldLabel, marginTop: 10 }}>Body</label>
          <textarea style={{ ...inputStyle, height: 80 }} value={body} onChange={e => setBody(e.target.value)} placeholder='{"key":"value"}' />
        </>
      )}
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>}
      {resp && (
        <OutputBar
          value={resp.body}
          label={`${resp.status} ${resp.ok ? "OK" : "ERROR"} · ${resp.ms}ms`}
        />
      )}
    </div>
  );
}

// ================= Database =================

function SqlFormatter() {
  const KEYWORDS = ["SELECT","FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","ON","GROUP BY","ORDER BY","HAVING","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","AND","OR","LIMIT","AS","NOT","NULL","IS","IN"];
  const [input, setInput] = useState("select id, name, email from users where status = 'active' and created_at > '2026-01-01' order by created_at desc limit 20");
  const output = useMemo(() => {
    let sql = input.trim();
    // Uppercase known keywords (word-boundary, case-insensitive)
    KEYWORDS.sort((a, b) => b.length - a.length).forEach(kw => {
      const re = new RegExp(`\\b${kw.replace(/\s+/g, "\\s+")}\\b`, "gi");
      sql = sql.replace(re, kw);
    });
    // Break major clauses onto new lines
    ["SELECT","FROM","WHERE","GROUP BY","ORDER BY","HAVING","LIMIT","LEFT JOIN","RIGHT JOIN","INNER JOIN","JOIN","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM"].forEach(kw => {
      sql = sql.replace(new RegExp(`\\s+${kw}\\b`, "g"), `\n${kw}`);
    });
    sql = sql.replace(/,\s*/g, ",\n  ").replace(/\n\s*\n/g, "\n");
    return sql.trim();
  }, [input]);
  return (
    <div>
      <label style={fieldLabel}>Raw SQL</label>
      <textarea style={{ ...inputStyle, height: 100 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} label="Formatted" />
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Keyword-based formatter for common clauses — not a full SQL parser, so deeply nested subqueries may format imperfectly.</span>
      </div>
    </div>
  );
}

const FIRST_NAMES = ["Aarav","Priya","Rohan","Ananya","Vikram","Neha","Arjun","Divya","Karan","Isha","Liam","Emma","Noah","Olivia","Mateo","Sofia"];
const LAST_NAMES = ["Sharma","Verma","Iyer","Gupta","Nair","Reddy","Khan","Patel","Silva","Johnson","Garcia","Muller"];
const DOMAINS = ["example.com","mail.dev","corp.io","test.org"];

function MockDataGenerator() {
  const [schema, setSchema] = useState("id: number\nfirst_name: name\nemail: email\nis_active: boolean\nsignup_date: date");
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState("json");

  const genValue = (type, i) => {
    const t = type.trim().toLowerCase();
    if (t === "number" || t === "int") return i + 1;
    if (t === "name") return `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[(i * 3) % LAST_NAMES.length]}`;
    if (t === "email") return `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${i}@${DOMAINS[i % DOMAINS.length]}`;
    if (t === "boolean") return i % 2 === 0;
    if (t === "date") { const d = new Date(2025, 0, 1 + i * 11); return d.toISOString().slice(0, 10); }
    if (t === "uuid") return crypto.randomUUID();
    return `value_${i + 1}`;
  };

  const rows = useMemo(() => {
    const fields = schema.split("\n").map(l => l.split(":").map(s => s.trim())).filter(([k, v]) => k && v);
    return Array.from({ length: Math.min(Math.max(count, 1), 100) }, (_, i) => {
      const row = {};
      fields.forEach(([key, type]) => { row[key] = genValue(type, i); });
      return row;
    });
  }, [schema, count]);

  const output = useMemo(() => {
    if (format === "json") return JSON.stringify(rows, null, 2);
    if (rows.length === 0) return "";
    const headers = Object.keys(rows[0]);
    const csvRows = [headers.join(","), ...rows.map(r => headers.map(h => r[h]).join(","))];
    return csvRows.join("\n");
  }, [rows, format]);

  return (
    <div>
      <label style={fieldLabel}>Schema (field: type — number, name, email, boolean, date, uuid)</label>
      <textarea style={{ ...inputStyle, height: 100 }} value={schema} onChange={e => setSchema(e.target.value)} />
      <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
        <label style={{ ...fieldLabel, marginBottom: 0 }}>Rows</label>
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(+e.target.value)} style={{ ...inputStyle, width: 70, padding: "6px 10px" }} />
        {["json", "csv"].map(f => (
          <button key={f} onClick={() => setFormat(f)} style={{ ...tabBtn, ...(format === f ? tabBtnActive : {}) }}>{f}</button>
        ))}
      </div>
      <OutputBar value={output} label={`${rows.length} rows`} />
    </div>
  );
}

// ================= Converters =================

function jsonToYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `${pad}[]`;
    return obj.map(item => {
      if (item && typeof item === "object") return `${pad}-\n${jsonToYaml(item, indent + 1)}`;
      return `${pad}- ${item}`;
    }).join("\n");
  }
  if (obj && typeof obj === "object") {
    return Object.entries(obj).map(([k, v]) => {
      if (v && typeof v === "object") return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
      return `${pad}${k}: ${v}`;
    }).join("\n");
  }
  return `${pad}${obj}`;
}

function yamlToJson(yaml) {
  // Minimal indentation-based YAML reader: supports nested maps and
  // simple scalars. Not a full YAML spec implementation (no anchors,
  // multi-line strings, or flow style).
  const lines = yaml.split("\n").filter(l => l.trim() && !l.trim().startsWith("#"));
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const line of lines) {
    const indent = line.match(/^\s*/)[0].length;
    const content = line.trim();
    const [key, ...rest] = content.split(":");
    const value = rest.join(":").trim();
    while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (value === "") {
      const child = {};
      parent[key.trim()] = child;
      stack.push({ indent, obj: child });
    } else {
      let v = value;
      if (v === "true") v = true;
      else if (v === "false") v = false;
      else if (!isNaN(Number(v)) && v !== "") v = Number(v);
      parent[key.trim()] = v;
    }
  }
  return root;
}

function JsonYamlConverter() {
  const [mode, setMode] = useState("json2yaml");
  const [input, setInput] = useState('{\n  "name": "DevCostoll",\n  "version": 1,\n  "offline": true\n}');
  const output = useMemo(() => {
    try {
      if (mode === "json2yaml") return jsonToYaml(JSON.parse(input));
      return JSON.stringify(yamlToJson(input), null, 2);
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [mode, input]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setMode("json2yaml")} style={{ ...tabBtn, ...(mode === "json2yaml" ? tabBtnActive : {}) }}>JSON → YAML</button>
        <button onClick={() => setMode("yaml2json")} style={{ ...tabBtn, ...(mode === "yaml2json" ? tabBtnActive : {}) }}>YAML → JSON</button>
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 130 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} />
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Handles nested objects, arrays, and basic scalars — not the full YAML spec (no anchors/multi-line strings).</span>
      </div>
    </div>
  );
}

function jsonToCsv(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const headers = Object.keys(arr[0]);
  const esc = (v) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [headers.join(","), ...arr.map(row => headers.map(h => esc(row[h])).join(","))].join("\n");
}

function csvToJson(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = line.split(",");
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cells[i] ?? "").trim(); });
    return obj;
  });
}

function JsonCsvConverter() {
  const [mode, setMode] = useState("json2csv");
  const [input, setInput] = useState('[\n  {"id": 1, "name": "Aarav", "active": true},\n  {"id": 2, "name": "Priya", "active": false}\n]');
  const output = useMemo(() => {
    try {
      if (mode === "json2csv") return jsonToCsv(JSON.parse(input));
      return JSON.stringify(csvToJson(input), null, 2);
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [mode, input]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setMode("json2csv")} style={{ ...tabBtn, ...(mode === "json2csv" ? tabBtnActive : {}) }}>JSON → CSV</button>
        <button onClick={() => setMode("csv2json")} style={{ ...tabBtn, ...(mode === "csv2json" ? tabBtnActive : {}) }}>CSV → JSON</button>
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 130 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} />
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Simple comma-split parser — quoted fields with embedded commas on the CSV→JSON side aren't handled yet.</span>
      </div>
    </div>
  );
}

// ================= Cloud Toolkit =================

function AwsArnParser() {
  const [arn, setArn] = useState("arn:aws:lambda:us-east-1:123456789012:function:devcostoll-jira-proxy");
  const parsed = useMemo(() => {
    const parts = arn.trim().split(":");
    if (parts[0] !== "arn" || parts.length < 6) return null;
    const [, partition, service, region, accountId, ...resourceParts] = parts;
    return { partition, service, region: region || "(global)", accountId: accountId || "(none)", resource: resourceParts.join(":") };
  }, [arn]);
  return (
    <div>
      <label style={fieldLabel}>ARN</label>
      <input style={{ ...inputStyle, padding: "10px 12px" }} value={arn} onChange={e => setArn(e.target.value)} placeholder="arn:aws:service:region:account-id:resource" />
      {!parsed ? (
        <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ Doesn't look like a valid ARN (expected arn:partition:service:region:account:resource)</div>
      ) : (
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["Partition", parsed.partition], ["Service", parsed.service], ["Region", parsed.region], ["Account ID", parsed.accountId], ["Resource", parsed.resource]].map(([label, val]) => (
            <div key={label} style={statCard}>
              <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#34E4B8", wordBreak: "break-all" }}>{val}</div>
              <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TerraformFormatter() {
  const [input, setInput] = useState('resource "aws_lambda_function" "jira_proxy" {\nfunction_name = "devcostoll-jira-proxy"\nruntime = "nodejs18.x"\nhandler = "index.handler"\nmemory_size = 256\n}');
  const output = useMemo(() => {
    const lines = input.split("\n").map(l => l.trim()).filter(Boolean);
    let indent = 0;
    const out = [];
    for (const line of lines) {
      if (line.startsWith("}")) indent = Math.max(indent - 1, 0);
      const eq = line.indexOf("=");
      if (eq > 0 && !line.endsWith("{")) {
        const key = line.slice(0, eq).trim();
        const val = line.slice(eq + 1).trim();
        out.push("  ".repeat(indent) + `${key.padEnd(16)} = ${val}`);
      } else {
        out.push("  ".repeat(indent) + line);
      }
      if (line.endsWith("{")) indent++;
    }
    return out.join("\n");
  }, [input]);
  return (
    <div>
      <label style={fieldLabel}>Raw HCL</label>
      <textarea style={{ ...inputStyle, height: 120 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} label="Formatted (terraform fmt style)" />
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Aligns `=` and indents blocks like `terraform fmt` does for simple resource blocks — not a full HCL parser.</span>
      </div>
    </div>
  );
}

// ================= More Code Tools =================

// Real gzip using the browser's native CompressionStream/DecompressionStream
// (Baseline-available in modern Chrome/Firefox/Safari) — no library needed.
function GzipTool() {
  const [mode, setMode] = useState("compress");
  const [input, setInput] = useState("DevCostoll — all developer tools, one place.");
  const [base64Input, setBase64Input] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [supported] = useState(typeof CompressionStream !== "undefined");

  const compress = async () => {
    setLoading(true); setError("");
    try {
      const bytes = new TextEncoder().encode(input);
      const cs = new CompressionStream("gzip");
      const writer = cs.writable.getWriter();
      writer.write(bytes); writer.close();
      const compressed = await new Response(cs.readable).arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(compressed)));
      setOutput(b64);
      setStats({ before: bytes.length, after: compressed.byteLength, pct: Math.round((1 - compressed.byteLength / bytes.length) * 100) });
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const decompress = async () => {
    setLoading(true); setError("");
    try {
      const binary = atob(base64Input.trim());
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      const ds = new DecompressionStream("gzip");
      const writer = ds.writable.getWriter();
      writer.write(bytes); writer.close();
      const decompressed = await new Response(ds.readable).arrayBuffer();
      setOutput(new TextDecoder().decode(decompressed));
      setStats(null);
    } catch (e) {
      setError("Couldn't decompress — check the Base64 input is valid gzip output. (" + e.message + ")");
    } finally { setLoading(false); }
  };

  if (!supported) {
    return <div style={{ color: "#FF6B6B", fontSize: 13 }}>⚠ This browser doesn't support the native CompressionStream API needed for this tool. Try a recent Chrome, Edge, or Firefox.</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => { setMode("compress"); setOutput(""); setError(""); }} style={{ ...tabBtn, ...(mode === "compress" ? tabBtnActive : {}) }}>Compress</button>
        <button onClick={() => { setMode("decompress"); setOutput(""); setError(""); }} style={{ ...tabBtn, ...(mode === "decompress" ? tabBtnActive : {}) }}>Decompress</button>
      </div>
      {mode === "compress" ? (
        <>
          <label style={fieldLabel}>Text to compress</label>
          <textarea style={{ ...inputStyle, height: 100 }} value={input} onChange={e => setInput(e.target.value)} />
          <button onClick={compress} disabled={loading} style={{ ...btnPrimary, marginTop: 10 }}><Zap size={13} /> {loading ? "…" : "Gzip it"}</button>
        </>
      ) : (
        <>
          <label style={fieldLabel}>Base64-encoded gzip data</label>
          <textarea style={{ ...inputStyle, height: 100 }} value={base64Input} onChange={e => setBase64Input(e.target.value)} placeholder="Paste base64 output from Compress mode" />
          <button onClick={decompress} disabled={loading} style={{ ...btnPrimary, marginTop: 10 }}><Zap size={13} /> {loading ? "…" : "Decompress"}</button>
        </>
      )}
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>}
      {output && <OutputBar value={output} label={mode === "compress" ? "Gzip output (base64)" : "Decompressed text"} />}
      {stats && (
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#B7BBD0" }}>
          <span>Before: <strong style={{ color: "#E7E9F2" }}>{stats.before}B</strong></span>
          <span>After: <strong style={{ color: "#E7E9F2" }}>{stats.after}B</strong></span>
          <span>Saved: <strong style={{ color: "#34E4B8" }}>{stats.pct}%</strong></span>
        </div>
      )}
    </div>
  );
}

// Standalone YAML Formatter — reuses the same jsonToYaml/yamlToJson helpers
// as the JSON↔YAML converter, but framed as "format this YAML" (re-parse
// then re-emit, which normalizes indentation/spacing).
function YamlFormatter() {
  const [input, setInput] = useState("name: DevCostoll\nversion: 1\ntools:\n  - json\n  - yaml\noffline: true");
  const output = useMemo(() => {
    try { return jsonToYaml(yamlToJson(input)); } catch (e) { return "Error: " + e.message; }
  }, [input]);
  return (
    <div>
      <label style={fieldLabel}>Raw YAML</label>
      <textarea style={{ ...inputStyle, height: 140 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} label="Formatted" />
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Normalizes indentation for common nested-map/array YAML — not the full spec (no anchors/multi-line strings).</span>
      </div>
    </div>
  );
}

// XML Formatter — uses the browser's native DOMParser + XMLSerializer,
// which is a real, robust XML engine (not a hand-rolled parser).
function XmlFormatter() {
  const [input, setInput] = useState("<project><name>DevCostoll</name><tools><tool>json</tool><tool>xml</tool></tools></project>");
  const [error, setError] = useState("");

  const output = useMemo(() => {
    try {
      const doc = new DOMParser().parseFromString(input, "application/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) { setError("Invalid XML"); return ""; }
      setError("");

      const format = (node, indent = 0) => {
        const pad = "  ".repeat(indent);
        if (node.nodeType === 3) {
          const text = node.textContent.trim();
          return text ? pad + text : "";
        }
        const attrs = Array.from(node.attributes || []).map(a => ` ${a.name}="${a.value}"`).join("");
        const children = Array.from(node.childNodes).map(c => format(c, indent + 1)).filter(Boolean);
        if (children.length === 0) return `${pad}<${node.tagName}${attrs}/>`;
        if (children.length === 1 && !children[0].includes("\n") && children[0].trim().startsWith(pad) === false) {
          return `${pad}<${node.tagName}${attrs}>${children[0].trim()}</${node.tagName}>`;
        }
        return `${pad}<${node.tagName}${attrs}>\n${children.join("\n")}\n${pad}</${node.tagName}>`;
      };
      return format(doc.documentElement);
    } catch (e) {
      setError(e.message);
      return "";
    }
  }, [input]);

  return (
    <div>
      <label style={fieldLabel}>Raw XML</label>
      <textarea style={{ ...inputStyle, height: 120 }} value={input} onChange={e => setInput(e.target.value)} />
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ {error}</div>}
      <OutputBar value={output} label="Formatted" />
    </div>
  );
}

// ================= DevOps =================

const CRON_PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at 9am", value: "0 9 * * 1" },
  { label: "Every 1st of month", value: "0 0 1 * *" },
];

function describeCron(expr) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "A cron expression needs exactly 5 fields: minute hour day month weekday.";
  const [min, hour, day, month, weekday] = parts;
  const bits = [];
  bits.push(min === "*" ? "every minute" : min.startsWith("*/") ? `every ${min.slice(2)} minutes` : `at minute ${min}`);
  bits.push(hour === "*" ? "of every hour" : `past hour ${hour}`);
  bits.push(day === "*" ? "every day" : `on day ${day} of the month`);
  bits.push(month === "*" ? "every month" : `in month ${month}`);
  bits.push(weekday === "*" ? "any weekday" : `on weekday ${weekday}`);
  return bits.join(", ");
}

function CronBuilder() {
  const [expr, setExpr] = useState("0 9 * * 1");
  return (
    <div>
      <label style={fieldLabel}>Presets</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {CRON_PRESETS.map(p => (
          <button key={p.value} onClick={() => setExpr(p.value)} style={{ ...tabBtn, ...(expr === p.value ? tabBtnActive : {}) }}>{p.label}</button>
        ))}
      </div>
      <label style={fieldLabel}>Cron expression</label>
      <input style={{ ...inputStyle, padding: "10px 12px", fontSize: 14 }} value={expr} onChange={e => setExpr(e.target.value)} placeholder="* * * * *" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 10 }}>
        {["min", "hour", "day", "month", "weekday"].map((label, i) => (
          <div key={label} style={statCard}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#34E4B8" }}>{expr.trim().split(/\s+/)[i] || "?"}</div>
            <div style={{ fontSize: 10, color: "#7A8099", textTransform: "uppercase", marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
      <OutputBar value={describeCron(expr)} label="Plain English" />
    </div>
  );
}

// ================= More Converters =================

const UNIT_GROUPS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
  data: { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 },
  time: { s: 1, ms: 0.001, min: 60, hr: 3600, day: 86400 },
};

function UnitConverter() {
  const [group, setGroup] = useState("data");
  const units = Object.keys(UNIT_GROUPS[group]);
  const [from, setFrom] = useState(units[2] || units[0]);
  const [to, setTo] = useState(units[1] || units[0]);
  const [value, setValue] = useState(1);

  React.useEffect(() => {
    const u = Object.keys(UNIT_GROUPS[group]);
    setFrom(u[0]); setTo(u[1] || u[0]);
  }, [group]);

  const result = useMemo(() => {
    const table = UNIT_GROUPS[group];
    if (!table[from] || !table[to]) return "";
    const base = value * table[from];
    return (base / table[to]).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [group, from, to, value]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.keys(UNIT_GROUPS).map(g => (
          <button key={g} onClick={() => setGroup(g)} style={{ ...tabBtn, ...(group === g ? tabBtnActive : {}) }}>{g}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <label style={fieldLabel}>Value</label>
          <input type="number" value={value} onChange={e => setValue(+e.target.value)} style={{ ...inputStyle, width: 120, padding: "8px 10px" }} />
        </div>
        <div>
          <label style={fieldLabel}>From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }}>
            {Object.keys(UNIT_GROUPS[group]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <ArrowRightLeft size={16} color="#7A8099" style={{ marginBottom: 10 }} />
        <div>
          <label style={fieldLabel}>To</label>
          <select value={to} onChange={e => setTo(e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }}>
            {Object.keys(UNIT_GROUPS[group]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <OutputBar value={result ? `${value} ${from} = ${result} ${to}` : ""} label="Result" />
    </div>
  );
}

// ================= More Security: Encoders/Decoders =================

function UrlEncoder() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("https://example.com/search?q=devcostoll tools&lang=en");
  const output = useMemo(() => {
    try { return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input); }
    catch (e) { return "Error: " + e.message; }
  }, [mode, input]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["encode", "decode"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>{m}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 90 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} />
    </div>
  );
}

function HtmlEntityEncoder() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState('<div class="card">Tom & Jerry\'s "quote"</div>');
  const output = useMemo(() => {
    if (mode === "encode") {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return input.replace(/[&<>"']/g, c => map[c]);
    }
    const el = document.createElement("textarea");
    el.innerHTML = input;
    return el.value;
  }, [mode, input]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["encode", "decode"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>{m}</button>
        ))}
      </div>
      <label style={fieldLabel}>Input</label>
      <textarea style={{ ...inputStyle, height: 90 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} />
    </div>
  );
}

function HexEncoder() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("DevCostoll");
  const output = useMemo(() => {
    try {
      if (mode === "encode") {
        return Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, "0")).join(" ");
      }
      const bytes = input.trim().split(/\s+/).map(h => parseInt(h, 16));
      if (bytes.some(Number.isNaN)) throw new Error("Invalid hex — expected space-separated byte pairs like 44 65 76");
      return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (e) {
      return "Error: " + e.message;
    }
  }, [mode, input]);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["encode", "decode"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>{m}</button>
        ))}
      </div>
      <label style={fieldLabel}>{mode === "encode" ? "Text" : "Hex bytes (space-separated)"}</label>
      <textarea style={{ ...inputStyle, height: 90 }} value={input} onChange={e => setInput(e.target.value)} />
      <OutputBar value={output} />
    </div>
  );
}

function BasicAuthEncoder() {
  const [mode, setMode] = useState("encode");
  const [user, setUser] = useState("api-user");
  const [pass, setPass] = useState("changeme123");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const encoded = useMemo(() => {
    try { return btoa(unescape(encodeURIComponent(`${user}:${pass}`))); }
    catch { return ""; }
  }, [user, pass]);

  const decoded = useMemo(() => {
    if (mode !== "decode" || !token.trim()) return null;
    try {
      const raw = decodeURIComponent(escape(atob(token.trim())));
      const idx = raw.indexOf(":");
      setError("");
      return idx === -1 ? { user: raw, pass: "" } : { user: raw.slice(0, idx), pass: raw.slice(idx + 1) };
    } catch {
      setError("Invalid Base64 — this doesn't look like a Basic auth token.");
      return null;
    }
  }, [mode, token]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["encode", "decode"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ ...tabBtn, ...(mode === m ? tabBtnActive : {}) }}>{m}</button>
        ))}
      </div>
      {mode === "encode" ? (
        <>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Username</label>
              <input value={user} onChange={e => setUser(e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>Password</label>
              <input value={pass} onChange={e => setPass(e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }} type="password" />
            </div>
          </div>
          <OutputBar value={`Authorization: Basic ${encoded}`} label="Header" />
        </>
      ) : (
        <>
          <label style={fieldLabel}>Base64 token (or full header)</label>
          <input value={token} onChange={e => setToken(e.target.value.replace(/^Basic\s+/i, ""))} style={{ ...inputStyle, padding: "8px 10px" }} placeholder="YXBpLXVzZXI6Y2hhbmdlbWUxMjM=" />
          {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ {error}</div>}
          {decoded && <OutputBar value={`user: ${decoded.user}\npass: ${decoded.pass}`} label="Decoded" />}
        </>
      )}
    </div>
  );
}

// Real HMAC via the browser's SubtleCrypto — genuine cryptographic signing.
function HmacGenerator() {
  const [message, setMessage] = useState("DevCostoll webhook payload");
  const [secret, setSecret] = useState("my-webhook-secret");
  const [algo, setAlgo] = useState("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    (async () => {
      if (!secret) { setOutput(""); return; }
      try {
        const key = await crypto.subtle.importKey(
          "raw", new TextEncoder().encode(secret),
          { name: "HMAC", hash: algo }, false, ["sign"]
        );
        const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
        setOutput(Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join(""));
        setError("");
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [message, secret, algo]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map(a => (
          <button key={a} onClick={() => setAlgo(a)} style={{ ...tabBtn, ...(algo === a ? tabBtnActive : {}) }}>{a}</button>
        ))}
      </div>
      <label style={fieldLabel}>Message</label>
      <textarea style={{ ...inputStyle, height: 80 }} value={message} onChange={e => setMessage(e.target.value)} />
      <label style={{ ...fieldLabel, marginTop: 10 }}>Secret key</label>
      <input value={secret} onChange={e => setSecret(e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }} type="password" />
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 8 }}>⚠ {error}</div>}
      <OutputBar value={output} label={`HMAC-${algo}`} />
    </div>
  );
}

// Real AES-GCM encryption via SubtleCrypto, key derived from a passphrase
// with PBKDF2. Genuine encryption (not obfuscation) — the same passphrase
// is required to decrypt, and a random salt/IV is embedded in the output.
function AesEncrypt() {
  const [mode, setMode] = useState("encrypt");
  const [text, setText] = useState("This message is encrypted with AES-GCM.");
  const [cipherInput, setCipherInput] = useState("");
  const [passphrase, setPassphrase] = useState("correct-horse-battery-staple");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const deriveKey = async (salt, usage) => {
    const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey, { name: "AES-GCM", length: 256 }, false, [usage]
    );
  };

  const encrypt = async () => {
    setLoading(true); setError("");
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(salt, "encrypt");
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
      const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
      combined.set(salt, 0); combined.set(iv, salt.length); combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
      setOutput(btoa(String.fromCharCode(...combined)));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const decrypt = async () => {
    setLoading(true); setError("");
    try {
      const combined = Uint8Array.from(atob(cipherInput.trim()), c => c.charCodeAt(0));
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const ciphertext = combined.slice(28);
      const key = await deriveKey(salt, "decrypt");
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
      setOutput(new TextDecoder().decode(plain));
    } catch (e) {
      setError("Decryption failed — wrong passphrase, or the ciphertext is corrupted/invalid.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => { setMode("encrypt"); setOutput(""); setError(""); }} style={{ ...tabBtn, ...(mode === "encrypt" ? tabBtnActive : {}) }}>Encrypt</button>
        <button onClick={() => { setMode("decrypt"); setOutput(""); setError(""); }} style={{ ...tabBtn, ...(mode === "decrypt" ? tabBtnActive : {}) }}>Decrypt</button>
      </div>
      <label style={fieldLabel}>Passphrase</label>
      <input value={passphrase} onChange={e => setPassphrase(e.target.value)} style={{ ...inputStyle, padding: "8px 10px" }} type="password" />
      {mode === "encrypt" ? (
        <>
          <label style={{ ...fieldLabel, marginTop: 10 }}>Plaintext</label>
          <textarea style={{ ...inputStyle, height: 90 }} value={text} onChange={e => setText(e.target.value)} />
          <button onClick={encrypt} disabled={loading} style={{ ...btnPrimary, marginTop: 10 }}><ShieldCheck size={13} /> {loading ? "…" : "Encrypt"}</button>
        </>
      ) : (
        <>
          <label style={{ ...fieldLabel, marginTop: 10 }}>Ciphertext (Base64)</label>
          <textarea style={{ ...inputStyle, height: 90 }} value={cipherInput} onChange={e => setCipherInput(e.target.value)} placeholder="Paste output from Encrypt mode" />
          <button onClick={decrypt} disabled={loading} style={{ ...btnPrimary, marginTop: 10 }}><ShieldCheck size={13} /> {loading ? "…" : "Decrypt"}</button>
        </>
      )}
      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>}
      {output && <OutputBar value={output} label={mode === "encrypt" ? "Ciphertext (Base64, salt+iv embedded)" : "Decrypted"} />}
      <div style={{ ...liveNote, marginTop: 12 }}>
        <Zap size={13} color="#7C5CFF" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Real AES-256-GCM via the browser's SubtleCrypto, key derived from your passphrase with PBKDF2 (100k iterations). Nothing is sent anywhere — all in-browser.</span>
      </div>
    </div>
  );
}

// ─── Unicode Normalizer ───────────────────────────────────────────────────────
// All processing runs entirely in the browser via String.prototype.normalize()
// — no extra packages needed. Covers NFD/NFC/NFKD/NFKC, diacritics stripping,
// ligature expansion, transliteration (Cyrillic, Greek, common), ASCII-only
// output, and EXACT / PREFIX match verification.
function UnicodeNormalizer() {
  const [input, setInput] = useState(
    "Café ≠ cafe\nNúñez Björk Ægir Søren\nО'Брайен François\nТест тест\nδ-aminolevulinic  Ω resistance\n日本語テスト\n中文测试\nمرحبا بالعالم\nעברית\nสวัสดี"
  );
  const [form, setForm] = useState("NFC");
  const [ops, setOps]   = useState({
    diacritics:    true,   // Step 1+2: NFD → strip U+0300-U+036F
    ligatures:     true,   // Step 3: æ→ae, ß→ss, ﬁ→fi …
    anyAsciiStep:  false,  // any-ascii full transliteration (CJK, Arabic, Hebrew …)
    transliterate: false,  // Our Cyrillic+Greek manual table (faster, more precise)
    nonAlnum:      false,  // Remove non [A-Za-z0-9]
    spaces:        false,  // Collapse/trim whitespace
    uppercase:     false,  // Force uppercase
  });
  const [verifyMode,   setVerifyMode]   = useState("EXACT");
  const [verifyTarget, setVerifyTarget] = useState("NUNEZ");
  const [showVerify,   setShowVerify]   = useState(false);
  const [engineLog,    setEngineLog]    = useState([]);

  // ── Ligature map (longest-first) ───────────────────────────────────────────
  const LIGATURES = [
    ["Æ","AE"],["æ","ae"],["Œ","OE"],["œ","oe"],
    ["Ø","O"],["ø","o"],["Ð","D"],["ð","d"],
    ["Þ","TH"],["þ","th"],["ẞ","SS"],["ß","ss"],
    ["Ł","L"],["ł","l"],["Đ","D"],["đ","d"],
    ["ﬁ","fi"],["ﬂ","fl"],["ﬀ","ff"],["ﬃ","ffi"],["ﬄ","ffl"],["ﬅ","st"],["ﬆ","st"],
    ["©","(c)"],["®","(r)"],["™","(tm)"],
    ["…","..."],["–","-"],["—","-"],
    ["\u2018","'"],  ["\u2019","'"],
    ["\u201C",'"'],  ["\u201D",'"'],
  ];

  // ── Cyrillic → Latin (ISO 9 inspired, readable) ───────────────────────────
  const CYRILLIC = {"А":"A","а":"a","Б":"B","б":"b","В":"V","в":"v","Г":"G","г":"g","Д":"D","д":"d","Е":"E","е":"e","Ё":"Yo","ё":"yo","Ж":"Zh","ж":"zh","З":"Z","з":"z","И":"I","и":"i","Й":"Y","й":"y","К":"K","к":"k","Л":"L","л":"l","М":"M","м":"m","Н":"N","н":"n","О":"O","о":"o","П":"P","п":"p","Р":"R","р":"r","С":"S","с":"s","Т":"T","т":"t","У":"U","у":"u","Ф":"F","ф":"f","Х":"Kh","х":"kh","Ц":"Ts","ц":"ts","Ч":"Ch","ч":"ch","Ш":"Sh","ш":"sh","Щ":"Shch","щ":"shch","Ъ":"","ъ":"","Ы":"Y","ы":"y","Ь":"","ь":"","Э":"E","э":"e","Ю":"Yu","ю":"yu","Я":"Ya","я":"ya"};

  // ── Greek → Latin ─────────────────────────────────────────────────────────
  const GREEK = {"α":"a","β":"b","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"x","ο":"o","π":"p","ρ":"r","σ":"s","ς":"s","τ":"t","υ":"y","φ":"ph","χ":"ch","ψ":"ps","ω":"o","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"I","Θ":"TH","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"X","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"PH","Χ":"CH","Ψ":"PS","Ω":"O"};

  // ── Detect if a char is "non-Latin" (needs any-ascii fallback) ────────────
  // We check if, after our own pipeline, a char is still outside ASCII range.
  // If so, any-ascii gets a shot at it.
  const isNonAsciiChar = (c) => c.codePointAt(0) > 127;

  // ── MAIN PROCESSING ENGINE ─────────────────────────────────────────────────
  // Layer 1 — Unicode normalisation form (native browser)
  // Layer 2 — Ligature expansion (our map)
  // Layer 3 — NFD → strip diacritics (native browser)
  // Layer 4 — Manual Cyrillic / Greek transliteration (precise, compact)
  // Layer 5 — any-ascii fallback (CJK, Arabic, Hebrew, Thai, … everything else)
  // Layer 6 — Non-alnum filter
  // Layer 7 — Whitespace normalisation
  // Layer 8 — Uppercase
  const process = useMemo(() => {
    const log = [];
    let out   = input;

    // Layer 1: normalize form
    out = out.normalize(form);
    log.push({ layer: 1, name: `Unicode ${form}`, sample: out.slice(0,60) });

    // Layer 2: ligatures
    if (ops.ligatures) {
      const before = out;
      for (const [from, to] of LIGATURES) out = out.split(from).join(to);
      if (out !== before) log.push({ layer: 2, name: "Ligatures expanded", sample: out.slice(0,60) });
    }

    // Layer 3: diacritics — NFD decompose then strip combining marks
    if (ops.diacritics) {
      const before = out;
      out = out.normalize("NFD").replace(/[\u0300-\u036f\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, "");
      if (out !== before) log.push({ layer: 3, name: "Diacritics stripped", sample: out.slice(0,60) });
    }

    // Layer 4: manual Cyrillic + Greek (more precise than any-ascii for these)
    if (ops.transliterate) {
      const before = out;
      out = out.split("").map(c => CYRILLIC[c] ?? GREEK[c] ?? c).join("");
      if (out !== before) log.push({ layer: 4, name: "Cyrillic+Greek → Latin", sample: out.slice(0,60) });
    }

    // Layer 5: any-ascii for everything else that's still non-ASCII
    // Strategy: process char-by-char — if our pipeline left a non-ASCII char
    // AND anyAsciiStep is on, run any-ascii on that char.
    // If anyAsciiStep is off but transliterate is on, use manual table only.
    if (ops.anyAsciiStep) {
      const before = out;
      out = out.split("").map(c => {
        if (!isNonAsciiChar(c)) return c;             // already ASCII, skip
        if (CYRILLIC[c]) return CYRILLIC[c];           // our table wins for Cyrillic
        if (GREEK[c])    return GREEK[c];              // our table wins for Greek
        return anyAscii(c);                             // any-ascii handles the rest
      }).join("");
      if (out !== before) log.push({ layer: 5, name: "any-ascii (CJK/Arabic/Hebrew/…)", sample: out.slice(0,60) });
    }

    // Layer 6: non-alnum
    if (ops.nonAlnum) {
      const before = out;
      out = out.replace(/[^A-Za-z0-9\n ]/g, "");
      if (out !== before) log.push({ layer: 6, name: "Non-alnum removed", sample: out.slice(0,60) });
    }

    // Layer 7: whitespace
    if (ops.spaces) {
      const before = out;
      out = out.split("\n").map(l => l.trim().replace(/\s+/g, " ")).join("\n").trim();
      if (out !== before) log.push({ layer: 7, name: "Whitespace normalised", sample: out.slice(0,60) });
    }

    // Layer 8: uppercase
    if (ops.uppercase) {
      out = out.toUpperCase();
      log.push({ layer: 8, name: "Uppercase", sample: out.slice(0,60) });
    }

    setEngineLog(log);
    return out;
  }, [input, form, ops]);

  // Per-line diff
  const lines = useMemo(() => {
    const inLines  = input.split("\n");
    const outLines = process.split("\n");
    const max = Math.max(inLines.length, outLines.length);
    return Array.from({ length: max }, (_, i) => ({
      before: inLines[i]  ?? "",
      after:  outLines[i] ?? "",
      changed: inLines[i] !== outLines[i],
    }));
  }, [input, process]);

  // Verify
  const verifyResult = useMemo(() => {
    if (!showVerify || !verifyTarget.trim()) return null;
    const target = verifyTarget.trim().toUpperCase();
    return process.split("\n").map(line => {
      const norm = line.toUpperCase();
      return {
        line: norm,
        match: verifyMode === "EXACT" ? norm === target : norm.startsWith(target),
      };
    });
  }, [process, verifyTarget, verifyMode, showVerify]);

  // Char inspector
  const [charInfo, setCharInfo] = useState("");
  const showCharInfo = () => {
    const sel = window.getSelection?.()?.toString() || "";
    if (!sel) { setCharInfo(""); return; }
    const info = [...sel].map(c => {
      const cp   = c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0");
      const name = c.normalize("NFD") !== c ? "has combining marks" : isNonAsciiChar(c) ? "non-ASCII" : "ASCII";
      const aa   = isNonAsciiChar(c) ? ` → any-ascii: "${anyAscii(c)}"` : "";
      return `U+${cp}  "${c}"  ${name}${aa}`;
    }).join("\n");
    setCharInfo(info);
  };

  const OPS_LABELS = [
    ["diacritics",    "Strip Diacritics",          "é→e ñ→n ü→u ç→c  (NFD + U+0300–U+036F)",      "Layer 3 — Browser native"],
    ["ligatures",     "Expand Ligatures",           "æ→ae ß→ss ﬁ→fi © →(c)  …→...",                "Layer 2 — Our map"],
    ["transliterate", "Transliterate (Precise)",    "Cyrillic→Latin  Greek→Latin  (manual table)",  "Layer 4 — Our table"],
    ["anyAsciiStep",  "any-ascii (World Scripts)",  "CJK  Arabic  Hebrew  Thai  Japanese  Korean…", "Layer 5 — any-ascii pkg"],
    ["nonAlnum",      "Letters+Digits Only",        "Remove punctuation spaces symbols",            "Layer 6"],
    ["spaces",        "Normalise Whitespace",       "Trim + collapse multiple spaces",              "Layer 7"],
    ["uppercase",     "Uppercase Output",           "For case-insensitive comparison",              "Layer 8"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Form selector */}
      <div>
        <label style={fieldLabel}>Unicode Normalisation Form</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            ["NFC",  "Canonical Composed (default, web-safe)"],
            ["NFD",  "Canonical Decomposed (separates accents)"],
            ["NFKC", "Compatibility Composed (e.g. ﬁ→fi, ² →2)"],
            ["NFKD", "Compatibility Decomposed (most aggressive)"],
          ].map(([f, desc]) => (
            <button key={f} onClick={() => setForm(f)}
              title={desc}
              style={{ ...tabBtn, ...(form === f ? tabBtnActive : {}), fontSize: 12, padding: "5px 12px" }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: "#4E5468", marginTop: 5 }}>
          {{"NFC":"Standard composed form — best for storage and display","NFD":"Splits accents into separate combining characters","NFKC":"Collapses compatibility chars + composes — best for search","NFKD":"Splits + decomposes everything — most characters reduced to base"}[form]}
        </div>
      </div>

      {/* Operation toggles */}
      <div>
        <label style={fieldLabel}>Processing Steps</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
          {OPS_LABELS.map(([key, label, hint, engine]) => (
            <button key={key}
              onClick={() => setOps(o => ({ ...o, [key]: !o[key] }))}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left",
                background: ops[key] ? (key === "anyAsciiStep" ? "rgba(52,228,184,0.1)" : "rgba(124,92,255,0.12)") : "#0D0F16",
                border: `1px solid ${ops[key] ? (key === "anyAsciiStep" ? "#34E4B855" : "#7C5CFF55") : "#232735"}`,
                borderRadius: 8, padding: "8px 12px", cursor: "pointer",
              }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${ops[key] ? (key === "anyAsciiStep" ? "#34E4B8" : "#7C5CFF") : "#4E5468"}`, background: ops[key] ? (key === "anyAsciiStep" ? "#34E4B8" : "#7C5CFF") : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {ops[key] && <span style={{ fontSize: 10, color: "#0A0C10" }}>✓</span>}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: ops[key] ? "#E7E9F2" : "#9195AB" }}>{label}</div>
                <div style={{ fontSize: 10.5, color: "#4E5468", marginTop: 1 }}>{hint}</div>
                <div style={{ fontSize: 9.5, color: key === "anyAsciiStep" ? "#34E4B866" : "#7C5CFF66", marginTop: 2 }}>{engine}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label style={fieldLabel}>Input Text</label>
        <textarea style={{ ...inputStyle, height: 120 }} value={input}
          onChange={e => setInput(e.target.value)}
          onMouseUp={showCharInfo}
          placeholder="Paste any text — Latin, Cyrillic, Greek, CJK, Arabic, Hebrew, Thai…"
        />
        <div style={{ fontSize: 10.5, color: "#4E5468", marginTop: 3 }}>
          💡 Select characters to inspect their Unicode codepoints + any-ascii transliteration
        </div>
      </div>

      {/* Char inspector */}
      {charInfo && (
        <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#7A8099", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Character Inspector</div>
          <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#34E4B8", margin: 0, whiteSpace: "pre-wrap" }}>{charInfo}</pre>
        </div>
      )}

      {/* Line-by-line diff */}
      <div>
        <label style={fieldLabel}>Transformation — Line by Line</label>
        <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
            <thead>
              <tr style={{ background: "#14171F" }}>
                <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, color: "#7A8099", fontWeight: 600, width: "50%", borderBottom: "1px solid #232735" }}>INPUT</th>
                <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, color: "#7A8099", fontWeight: 600, width: "50%", borderBottom: "1px solid #232735" }}>OUTPUT</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #13161F", background: l.changed ? "rgba(52,228,184,0.04)" : "transparent" }}>
                  <td style={{ padding: "5px 12px", color: l.changed ? "#E7E9F2" : "#7A8099", wordBreak: "break-all" }}>{l.before || <span style={{ color: "#2E3347" }}>—</span>}</td>
                  <td style={{ padding: "5px 12px", color: l.changed ? "#34E4B8" : "#7A8099", wordBreak: "break-all", fontWeight: l.changed ? 600 : 400 }}>{l.after || <span style={{ color: "#2E3347" }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full output */}
      <OutputBar value={process} label={`Normalised · ${process.length} chars`} />

      {/* Verify panel */}
      <div>
        <button onClick={() => setShowVerify(v => !v)} style={{ ...tabBtn, marginBottom: showVerify ? 10 : 0 }}>
          {showVerify ? "▲ Hide" : "▼ Show"} Verification (EXACT / PREFIX)
        </button>
        {showVerify && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={fieldLabel}>Target value to match against</label>
                <input value={verifyTarget} onChange={e => setVerifyTarget(e.target.value)}
                  style={{ ...inputStyle, padding: "8px 12px" }} placeholder="e.g. NUNEZ or DELACRUZ" />
              </div>
              <div>
                <label style={fieldLabel}>Mode</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {["EXACT","PREFIX"].map(m => (
                    <button key={m} onClick={() => setVerifyMode(m)}
                      style={{ ...tabBtn, ...(verifyMode === m ? tabBtnActive : {}), padding: "7px 14px" }}>{m}</button>
                  ))}
                </div>
              </div>
            </div>
            {verifyResult && (
              <div style={{ background: "#0D0F16", border: "1px solid #232735", borderRadius: 8, overflow: "hidden" }}>
                {verifyResult.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", borderBottom: i < verifyResult.length-1 ? "1px solid #13161F" : "none", background: r.match ? "rgba(52,228,184,0.06)" : "transparent" }}>
                    <span style={{ fontSize: 14 }}>{r.match ? "✅" : "❌"}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: r.match ? "#34E4B8" : "#FF6B6B" }}>{r.line || "—"}</span>
                    <span style={{ fontSize: 10.5, color: "#4E5468", marginLeft: "auto" }}>{verifyMode} {r.match ? "MATCH" : "NO MATCH"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reference table */}
      <details>
        <summary style={{ fontSize: 11.5, color: "#7A8099", cursor: "pointer", userSelect: "none" }}>📖 Unicode Transformation Reference</summary>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 6, marginTop: 10 }}>
          {[
            ["é, è, ê","→ e","NFD + strip"],["ñ, ń","→ n","diacritics"],["ü, ú, û","→ u","diacritics"],
            ["ç","→ c","diacritics"],["å","→ a","diacritics"],["ã, â","→ a","diacritics"],
            ["æ → ae","Æ → AE","ligature"],["œ → oe","Œ → OE","ligature"],
            ["ø → o","Ø → O","ligature"],["ß → ss","ẞ → SS","ligature"],
            ["ﬁ → fi","ﬂ → fl","typographic"],["Б → B","Ж → Zh","Cyrillic"],
            ["α → a","Ω → O","Greek"],["– → -","… → ...","symbols"],
          ].map(([a, b, cat]) => (
            <div key={a} style={{ background: "#0D0F16", border: "1px solid #1C2030", borderRadius: 6, padding: "6px 10px" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#34E4B8" }}>{a}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#7C5CFF" }}>{b}</div>
              <div style={{ fontSize: 9.5, color: "#4E5468", marginTop: 2 }}>{cat}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

// ---------------- Tool registry ----------------

const TOOLS = [
  // AI Assistant
  { id: "ai",           name: "AI Assistant",            icon: Zap,          group: "AI Assistant",   desc: "Explain, fix, format, or test code via Claude",          Comp: AiAssistant },
  { id: "ai-commit",    name: "Commit Message Writer",   icon: GitCommit,    group: "AI Assistant",   desc: "Generate a conventional commit message from a diff",      Comp: ConventionalCommit },

  // API Studio
  { id: "rest",         name: "REST Client",             icon: Send,         group: "API Studio",     desc: "Send real HTTP requests, see live responses",             Comp: RestClient },
  { id: "graphql",      name: "GraphQL Explorer",        icon: ArrowRightLeft,group:"API Studio",     desc: "Send GraphQL queries and inspect JSON responses",          Comp: GraphqlExplorer },
  { id: "ws",           name: "WebSocket Client",        icon: Wifi,         group: "API Studio",     desc: "Connect to WebSocket endpoints and send messages",        Comp: WebsocketClient },
  { id: "openapi",      name: "OpenAPI Viewer",          icon: FileSearch,   group: "API Studio",     desc: "Paste an OpenAPI/Swagger spec and explore endpoints",     Comp: OpenApiViewer },

  // Code Tools
  { id: "json",         name: "JSON Formatter",          icon: Braces,       group: "Code Tools",     desc: "Validate & pretty-print JSON",                            Comp: JsonFormatter },
  { id: "yaml-fmt",     name: "YAML Formatter",          icon: FileCode,     group: "Code Tools",     desc: "Normalize YAML indentation",                              Comp: YamlFormatter },
  { id: "xml-fmt",      name: "XML Formatter",           icon: FileCode,     group: "Code Tools",     desc: "Pretty-print XML via native DOM parser",                  Comp: XmlFormatter },
  { id: "toml",         name: "TOML Formatter",          icon: FileCode,     group: "Code Tools",     desc: "Format TOML config files",                                Comp: TomlFormatter },
  { id: "ini",          name: "INI Formatter",           icon: FileCode,     group: "Code Tools",     desc: "Format INI-style config files",                           Comp: IniFormatter },
  { id: "markdown",     name: "Markdown Formatter",      icon: FileText,     group: "Code Tools",     desc: "Normalize markdown spacing and headings",                 Comp: MarkdownFormatter },
  { id: "beautify",     name: "CSS / HTML Beautifier",   icon: Code2,        group: "Code Tools",     desc: "Beautify or minify CSS & HTML",                           Comp: Beautifier },
  { id: "gzip",         name: "Gzip Compress/Decompress",icon: Binary,       group: "Code Tools",     desc: "Native browser gzip, no library",                        Comp: GzipTool },
  { id: "diff",         name: "Text Diff",               icon: GitMerge,     group: "Code Tools",     desc: "Side-by-side diff of two text blocks",                    Comp: TextDiff },
  { id: "gitignore",    name: ".gitignore Generator",    icon: GitBranch,    group: "Code Tools",     desc: "Generate .gitignore for any stack",                       Comp: GitignoreGenerator },
  { id: "docker",       name: "Dockerfile Linter",       icon: Boxes,        group: "Code Tools",     desc: "Lint and review your Dockerfile",                         Comp: DockerfileLinter },

  // DevOps
  { id: "jira",         name: "Jira Ticket Finder",      icon: GitBranch,    group: "DevOps",         desc: "Extract ticket keys from commits",                        Comp: JiraTicketFinder },
  { id: "cron",         name: "Cron Builder",            icon: Timer,        group: "DevOps",         desc: "Build & read cron expressions",                           Comp: CronBuilder },
  { id: "k8s",          name: "K8s YAML Validator",      icon: Workflow,     group: "DevOps",         desc: "Validate Kubernetes YAML structure",                      Comp: K8sValidator },
  { id: "git-commit",   name: "Conventional Commit",     icon: GitCommit,    group: "DevOps",         desc: "Build conventional commit messages visually",             Comp: ConventionalCommit },

  // Cloud Toolkit
  { id: "arn",          name: "AWS ARN Parser",          icon: Cloud,        group: "Cloud Toolkit",  desc: "Break an ARN into its parts",                             Comp: AwsArnParser },
  { id: "terraform",    name: "Terraform Formatter",     icon: Server,       group: "Cloud Toolkit",  desc: "terraform fmt–style HCL cleanup",                         Comp: TerraformFormatter },
  { id: "iam",          name: "IAM Policy Validator",    icon: Lock,         group: "Cloud Toolkit",  desc: "Validate and explain AWS IAM JSON policies",              Comp: IamValidator },
  { id: "cidr",         name: "CIDR Calculator",         icon: Network,      group: "Cloud Toolkit",  desc: "Subnet, hosts, broadcast from a CIDR block",              Comp: CidrCalculator },
  { id: "env-parser",   name: "Env File Parser",         icon: Settings,     group: "Cloud Toolkit",  desc: "Parse .env files and generate export commands",           Comp: EnvParser },

  // Database
  { id: "sql",          name: "SQL Formatter",           icon: Database,     group: "Database",       desc: "Keyword-based SQL formatting",                            Comp: SqlFormatter },
  { id: "mockdata",     name: "Mock Data Generator",     icon: Table2,       group: "Database",       desc: "Schema-driven fake data, JSON or CSV",                    Comp: MockDataGenerator },
  { id: "mongo-query",  name: "MongoDB Query Builder",   icon: Database,     group: "Database",       desc: "Build MongoDB filter/projection queries",                 Comp: MongoQueryBuilder },

  // Security
  { id: "jwt",          name: "JWT Decoder",             icon: KeyRound,     group: "Security",       desc: "Decode header & payload",                                 Comp: JwtDecoder },
  { id: "url-enc",      name: "URL Encoder/Decoder",     icon: Link,         group: "Security",       desc: "encodeURIComponent / decode",                             Comp: UrlEncoder },
  { id: "html-enc",     name: "HTML Entity Coder",       icon: Code2,        group: "Security",       desc: "Escape/unescape HTML entities",                           Comp: HtmlEntityEncoder },
  { id: "hex-enc",      name: "Hex Encoder/Decoder",     icon: Binary,       group: "Security",       desc: "Text ↔ hex bytes",                                        Comp: HexEncoder },
  { id: "basic-auth",   name: "Basic Auth Encoder",      icon: KeyRound,     group: "Security",       desc: "user:pass ↔ Authorization header",                        Comp: BasicAuthEncoder },
  { id: "hmac",         name: "HMAC Generator",          icon: ShieldCheck,  group: "Security",       desc: "Sign a message with a secret key",                        Comp: HmacGenerator },
  { id: "aes",          name: "AES Encrypt/Decrypt",     icon: Lock,         group: "Security",       desc: "Real AES-256-GCM, passphrase-based",                      Comp: AesEncrypt },
  { id: "base64",       name: "Base64",                  icon: Binary,       group: "Security",       desc: "Encode / decode text",                                    Comp: Base64Tool },
  { id: "hash",         name: "Hash Generator",          icon: Hash,         group: "Security",       desc: "SHA-1 / 256 / 384 / 512",                                 Comp: HashGenerator },
  { id: "uuid",         name: "UUID Generator",          icon: Fingerprint,  group: "Security",       desc: "Bulk v4 UUIDs",                                           Comp: UuidGenerator },
  { id: "password",     name: "Password Generator",      icon: ShieldCheck,  group: "Security",       desc: "Strong random passwords",                                 Comp: PasswordGenerator },

  // Converters
  { id: "yaml",         name: "JSON ↔ YAML",             icon: ArrowRightLeft,group:"Converters",     desc: "Convert between JSON and YAML",                           Comp: JsonYamlConverter },
  { id: "csv",          name: "JSON ↔ CSV",              icon: ArrowRightLeft,group:"Converters",     desc: "Convert between JSON and CSV",                            Comp: JsonCsvConverter },
  { id: "unitconv",     name: "Unit Converter",          icon: ArrowRightLeft,group:"Converters",     desc: "Length, weight, data, time",                              Comp: UnitConverter },
  { id: "color",        name: "Color Converter",         icon: Palette,      group: "Converters",     desc: "HEX ↔ RGB ↔ HSL",                                         Comp: ColorConverter },
  { id: "ts-converter", name: "Timestamp Converter",     icon: Timer,        group: "Converters",     desc: "Unix timestamp ↔ human date",                             Comp: TimestampConverter },
  { id: "number-base",  name: "Number Base Converter",   icon: Binary,       group: "Converters",     desc: "Binary, Octal, Decimal, Hex",                             Comp: NumberBaseConverter },

  // Diagram Tools
  { id: "mermaid",      name: "Mermaid Editor",          icon: Workflow,     group: "Diagram Tools",  desc: "Write and preview Mermaid diagrams",                      Comp: MermaidEditor },
  { id: "plantuml",     name: "PlantUML Renderer",       icon: ScanLine,     group: "Diagram Tools",  desc: "Render PlantUML diagrams via online server",              Comp: PlantUmlRenderer },
  { id: "ascii-art",    name: "ASCII Art Generator",     icon: Terminal,     group: "Diagram Tools",  desc: "Convert text to ASCII art banners",                       Comp: AsciiArtGenerator },
  { id: "svg-preview",  name: "SVG Previewer",           icon: Image,        group: "Diagram Tools",  desc: "Paste SVG markup and preview it live",                    Comp: SvgPreviewer },

  // Text Utilities
  { id: "regex",        name: "Regex Tester",            icon: Regex,        group: "Text Utilities", desc: "Live pattern matching with flags, groups, replace",       Comp: RegexTester },
  { id: "case",         name: "Case Converter",          icon: CaseSensitive,group: "Text Utilities", desc: "camel / snake / kebab / title",                           Comp: CaseConverter },
  { id: "words",        name: "Word Counter",            icon: FileText,     group: "Text Utilities", desc: "Words, chars, sentences",                                 Comp: WordCounter },
  { id: "lorem",        name: "Lorem Ipsum Generator",   icon: FileText,     group: "Text Utilities", desc: "Generate placeholder text paragraphs",                    Comp: LoremIpsum },
  { id: "string-escape",name: "String Escape/Unescape",  icon: Code2,        group: "Text Utilities", desc: "Escape/unescape JS, JSON, and regex strings",             Comp: StringEscape },
  { id: "line-tools",   name: "Line Tools",              icon: BarChart2,    group: "Text Utilities", desc: "Sort, deduplicate, reverse, and count lines",             Comp: LineTools },
  { id: "unicode-norm", name: "Unicode Normalizer",      icon: Globe,        group: "Text Utilities", desc: "NFD, NFC, NFKD, NFKC, diacritics, ligatures, transliteration", Comp: UnicodeNormalizer },

  // File Tools
  { id: "image-info",   name: "Image Info",              icon: Image,        group: "File Tools",     desc: "Show dimensions, size, MIME of an image",                 Comp: ImageInfo },
  { id: "file-hash",    name: "File Hash",               icon: Hash,         group: "File Tools",     desc: "SHA-256 hash of any local file",                          Comp: FileHash },

  // Productivity
  { id: "pomodoro",     name: "Pomodoro Timer",          icon: Timer,        group: "Productivity",   desc: "25-min focus sessions with break reminders",              Comp: PomodoroTimer },
  { id: "snippets",     name: "Snippet Manager",         icon: Clipboard,    group: "Productivity",   desc: "Save and recall reusable code snippets",                  Comp: SnippetManager },
  { id: "notes",        name: "Quick Notes",             icon: FileText,     group: "Productivity",   desc: "Scratch-pad that persists in localStorage",               Comp: QuickNotes },

  // Networking
  { id: "http-status",  name: "HTTP Status Reference",   icon: HardDrive,    group: "Networking",     desc: "Look up any HTTP status code explanation",                Comp: HttpStatusRef },
  { id: "user-agent",   name: "User Agent Parser",       icon: Smartphone,   group: "Networking",     desc: "Parse a User-Agent string into its components",           Comp: UserAgentParser },
];

// ================= Logo SVG Icon — matches the </> style in the screenshot =================
function DevCostollLogo({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25, flexShrink: 0,
      background: "linear-gradient(135deg, #1a1040 0%, #0f2a20 100%)",
      border: "1.5px solid rgba(124,92,255,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      boxShadow: "0 0 12px rgba(124,92,255,0.3)",
    }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <path d="M7 8L3 12L7 16" stroke="#34E4B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 8L21 12L17 16" stroke="#7C5CFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 4L10 20" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round"/>
        <defs>
          <linearGradient id="lg" x1="10" y1="4" x2="14" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C5CFF"/>
            <stop offset="1" stopColor="#34E4B8"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ================= Dashboard Home — matches screenshot layout =================
// ─────────────────────────────────────────────────────────────
//  ToolCard — single icon tile used in the dashboard grid
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Real brand icons from simple-icons + gradient backgrounds
// Each tool maps to: { Si: BrandIcon, grad: "gradient css" }
// Falls back to the Lucide icon if no brand icon exists.
// ─────────────────────────────────────────────────────────────

// Tool id → { BrandIcon, gradient }
const BRAND_ICONS = {
  // Code Tools
  "json":         { Si: SiJson,        grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
  "yaml-fmt":     { Si: SiYaml,        grad: "linear-gradient(135deg,#EF4444,#B91C1C)" },
  "markdown":     { Si: SiMarkdown,    grad: "linear-gradient(135deg,#64748B,#334155)" },
  "toml":         { Si: SiToml,        grad: "linear-gradient(135deg,#F97316,#C2410C)" },
  "docker":       { Si: SiDocker,      grad: "linear-gradient(135deg,#0EA5E9,#0369A1)" },
  "gitignore":    { Si: SiGit,         grad: "linear-gradient(135deg,#F05032,#C0300D)" },
  "svg-preview":  { Si: SiSvg,         grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
  "mermaid":      { Si: SiMermaid,     grad: "linear-gradient(135deg,#FF6B6B,#EE5A24)" },
  // DevOps
  "jira":         { Si: SiJira,        grad: "linear-gradient(135deg,#0052CC,#003B99)" },
  "k8s":          { Si: SiKubernetes,  grad: "linear-gradient(135deg,#326CE5,#1E40AF)" },
  "git-commit":   { Si: SiGit,         grad: "linear-gradient(135deg,#F05032,#C0300D)" },
  // Cloud Toolkit
  "arn":          { Si: SiAmazonwebservices, grad: "linear-gradient(135deg,#FF9900,#CC7A00)" },
  "terraform":    { Si: SiTerraform,   grad: "linear-gradient(135deg,#7B42BC,#5B2D8E)" },
  // API Studio
  "graphql":      { Si: SiGraphql,     grad: "linear-gradient(135deg,#E10098,#9B0070)" },
  "rest":         { Si: SiPostman,     grad: "linear-gradient(135deg,#FF6C37,#E54D1A)" },
  // Database
  "mongo-query":  { Si: SiMongodb,     grad: "linear-gradient(135deg,#00ED64,#00934B)" },
  "sql":          { Si: SiPostgresql,  grad: "linear-gradient(135deg,#4169E1,#2C4BAD)" },
};

function ToolBrandIcon({ toolId, fallbackIcon: FallbackIcon, size = 26, color = "#fff" }) {
  const entry = BRAND_ICONS[toolId];
  if (entry) {
    const Si = entry.Si;
    return <Si size={size} color={color} />;
  }
  return <FallbackIcon size={size} color={color} strokeWidth={2} />;
}

function getIconGradient(toolId) {
  return (BRAND_ICONS[toolId]?.grad) || ICON_GRADIENTS[toolId] || "linear-gradient(135deg,#7C5CFF,#5B3FCC)";
}

function ToolCard({ tool, onSelect }) {
  const grad  = getIconGradient(tool.id);
  const color = GROUP_COLORS[tool.group] || "#7C5CFF";
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onSelect(tool.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={tool.desc}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: hov ? "#16192280" : "transparent",
        border: `1px solid ${hov ? color + "40" : "transparent"}`,
        borderRadius: 14, padding: "14px 8px 10px",
        cursor: "pointer", outline: "none", minWidth: 0,
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: grad,
        boxShadow: `0 4px 14px ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ToolBrandIcon toolId={tool.id} fallbackIcon={tool.icon} size={26} color="#fff" />
      </div>
      <span style={{
        fontSize: 11, fontWeight: 500, color: "#C0C4D6",
        textAlign: "center", lineHeight: 1.3, wordBreak: "break-word", maxWidth: "100%",
      }}>
        {tool.name}
      </span>
    </button>
  );
}
const ICON_GRADIENTS = {
  // AI Assistant
  "ai":           "linear-gradient(135deg, #7C5CFF, #5B3FCC)",
  "ai-commit":    "linear-gradient(135deg, #9B6DFF, #7C5CFF)",
  // API Studio
  "rest":         "linear-gradient(135deg, #3B82F6, #1D4ED8)",
  "graphql":      "linear-gradient(135deg, #E10098, #9B0070)",
  "ws":           "linear-gradient(135deg, #06B6D4, #0284C7)",
  "openapi":      "linear-gradient(135deg, #22C55E, #15803D)",
  // Code Tools
  "json":         "linear-gradient(135deg, #F59E0B, #D97706)",
  "yaml-fmt":     "linear-gradient(135deg, #EF4444, #B91C1C)",
  "xml-fmt":      "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "toml":         "linear-gradient(135deg, #F97316, #C2410C)",
  "ini":          "linear-gradient(135deg, #06B6D4, #0E7490)",
  "markdown":     "linear-gradient(135deg, #64748B, #334155)",
  "beautify":     "linear-gradient(135deg, #EC4899, #BE185D)",
  "gzip":         "linear-gradient(135deg, #14B8A6, #0F766E)",
  "diff":         "linear-gradient(135deg, #F97316, #EA580C)",
  "gitignore":    "linear-gradient(135deg, #22C55E, #16A34A)",
  "docker":       "linear-gradient(135deg, #0EA5E9, #0369A1)",
  // DevOps
  "jira":         "linear-gradient(135deg, #3B82F6, #2563EB)",
  "cron":         "linear-gradient(135deg, #8B5CF6, #7C3AED)",
  "k8s":          "linear-gradient(135deg, #326CE5, #1E40AF)",
  "git-commit":   "linear-gradient(135deg, #F97316, #EA580C)",
  // Cloud Toolkit
  "arn":          "linear-gradient(135deg, #FF9900, #CC7A00)",
  "terraform":    "linear-gradient(135deg, #7B42BC, #5B2D8E)",
  "iam":          "linear-gradient(135deg, #EF4444, #DC2626)",
  "cidr":         "linear-gradient(135deg, #06B6D4, #0891B2)",
  "env-parser":   "linear-gradient(135deg, #22C55E, #15803D)",
  // Database
  "sql":          "linear-gradient(135deg, #3B82F6, #1D4ED8)",
  "mockdata":     "linear-gradient(135deg, #10B981, #059669)",
  "mongo-query":  "linear-gradient(135deg, #00ED64, #00934B)",
  // Security
  "jwt":          "linear-gradient(135deg, #F59E0B, #B45309)",
  "url-enc":      "linear-gradient(135deg, #6366F1, #4338CA)",
  "html-enc":     "linear-gradient(135deg, #EC4899, #DB2777)",
  "hex-enc":      "linear-gradient(135deg, #8B5CF6, #7C3AED)",
  "basic-auth":   "linear-gradient(135deg, #EF4444, #DC2626)",
  "hmac":         "linear-gradient(135deg, #F97316, #EA580C)",
  "aes":          "linear-gradient(135deg, #10B981, #059669)",
  "base64":       "linear-gradient(135deg, #3B82F6, #2563EB)",
  "hash":         "linear-gradient(135deg, #64748B, #475569)",
  "uuid":         "linear-gradient(135deg, #A855F7, #9333EA)",
  "password":     "linear-gradient(135deg, #22C55E, #16A34A)",
  // Converters
  "yaml":         "linear-gradient(135deg, #EF4444, #DC2626)",
  "csv":          "linear-gradient(135deg, #10B981, #059669)",
  "unitconv":     "linear-gradient(135deg, #F59E0B, #D97706)",
  "color":        "linear-gradient(135deg, #EC4899, #DB2777)",
  "ts-converter": "linear-gradient(135deg, #6366F1, #4F46E5)",
  "number-base":  "linear-gradient(135deg, #06B6D4, #0284C7)",
  // Diagram Tools
  "mermaid":      "linear-gradient(135deg, #FF6B6B, #EE5A24)",
  "plantuml":     "linear-gradient(135deg, #A855F7, #9333EA)",
  "ascii-art":    "linear-gradient(135deg, #14B8A6, #0D9488)",
  "svg-preview":  "linear-gradient(135deg, #F59E0B, #D97706)",
  // Text Utilities
  "regex":        "linear-gradient(135deg, #22C55E, #16A34A)",
  "case":         "linear-gradient(135deg, #3B82F6, #2563EB)",
  "words":        "linear-gradient(135deg, #8B5CF6, #7C3AED)",
  "lorem":        "linear-gradient(135deg, #64748B, #475569)",
  "string-escape":"linear-gradient(135deg, #F97316, #EA580C)",
  "line-tools":   "linear-gradient(135deg, #06B6D4, #0891B2)",
  // File Tools
  "image-info":   "linear-gradient(135deg, #EC4899, #DB2777)",
  "file-hash":    "linear-gradient(135deg, #64748B, #334155)",
  // Productivity
  "pomodoro":     "linear-gradient(135deg, #EF4444, #DC2626)",
  "snippets":     "linear-gradient(135deg, #F59E0B, #D97706)",
  "notes":        "linear-gradient(135deg, #22C55E, #15803D)",
  // Networking
  "http-status":  "linear-gradient(135deg, #3B82F6, #1D4ED8)",
  "user-agent":   "linear-gradient(135deg, #8B5CF6, #6D28D9)",
};

function DashboardHome({ onSelect }) {
  const groups      = [...new Set(TOOLS.map(t => t.group))];
  const totalTools  = TOOLS.length;
  const [expanded, setExpanded] = useState({});   // { [group]: true/false }

  const toggle = (group) => setExpanded(prev => ({ ...prev, [group]: !prev[group] }));

  const STATS = [
    { label: `${totalTools}+`, sub: "Tools",          color: "#7C5CFF", icon: "⚡" },
    { label: "Offline",        sub: "Works offline",   color: "#34E4B8", icon: "📡" },
    { label: "AI",             sub: "Smart assistant", color: "#3B82F6", icon: "🤖" },
    { label: "Secure",         sub: "Privacy first",   color: "#22C55E", icon: "🔒" },
    { label: "Cross Platform", sub: "Win, Mac, Linux", color: "#F97316", icon: "💻" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0A0C10" }}>

      {/* ── Top hero bar ── */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid #13161F", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, background: "#0C0E14", flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: "#E7E9F2", flexShrink: 0 }}>
          All Tools
        </span>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", flexShrink: 1, paddingBottom: 2 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
              background: `${s.color}12`, border: `1px solid ${s.color}30`,
              borderRadius: 10, padding: "7px 13px",
            }}>
              <span style={{ fontSize: 13 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.label}</div>
                <div style={{ fontSize: 9.5, color: "#7A8099", marginTop: 2, whiteSpace: "nowrap" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category cards grid ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {groups.map(group => {
            const groupTools  = TOOLS.filter(t => t.group === group);
            const color       = GROUP_COLORS[group] || "#7C5CFF";
            const isExpanded  = !!expanded[group];
            // show all when expanded, otherwise first 4
            const visible     = isExpanded ? groupTools : groupTools.slice(0, 4);
            const hiddenCount = groupTools.length - 4;

            // grid columns adapt to visible count
            const cols      = visible.length === 1 ? 1 : visible.length === 2 ? 2 : 4;
            const tileSize  = visible.length <= 2 && !isExpanded ? 64 : 44;
            const iconSize  = visible.length <= 2 && !isExpanded ? 32 : 22;
            const nameFSize = visible.length <= 2 && !isExpanded ? 11.5 : 10;

            return (
              <div key={group} style={{
                background: "#14171F", border: "1px solid #1C2030",
                borderRadius: 14, padding: "16px 16px 14px",
                display: "flex", flexDirection: "column", gap: 14,
              }}>
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: `${color}22`, border: `1px solid ${color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#E7E9F2" }}>{group}</span>
                  </div>
                  <span style={{
                    fontSize: 10.5, color, background: `${color}15`,
                    border: `1px solid ${color}33`, borderRadius: 20, padding: "2px 9px", fontWeight: 600,
                  }}>{groupTools.length} tools</span>
                </div>

                {/* Tool tiles */}
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
                  {visible.map(t => {
                    const grad = getIconGradient(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        title={t.desc}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                          background: "transparent", border: "none", cursor: "pointer", outline: "none",
                          borderRadius: 10, padding: "8px 4px", transition: "background 0.12s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#0F121A"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{
                          width: tileSize, height: tileSize, borderRadius: 14,
                          background: grad, boxShadow: `0 2px 10px ${color}33`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <ToolBrandIcon toolId={t.id} fallbackIcon={t.icon} size={iconSize} color="#fff" />
                        </div>
                        <span style={{
                          fontSize: nameFSize, fontWeight: 500, color: "#9195AB",
                          textAlign: "center", lineHeight: 1.25,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical", overflow: "hidden",
                          width: "100%",
                        }}>
                          {t.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Expand / collapse button — only shown when there are hidden tools */}
                {hiddenCount > 0 && (
                  <button
                    onClick={() => toggle(group)}
                    style={{
                      width: "100%", background: "transparent",
                      border: `1px solid ${color}33`, borderRadius: 8,
                      padding: "7px 0", color, fontSize: 11.5,
                      fontWeight: 600, cursor: "pointer", transition: "background 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${color}10`}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {isExpanded ? "↑ Show less" : `+${hiddenCount} more tools →`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Right panel ───────────────────────────────────────────────
function RightPanel({ onSelect }) {
  const totalTools  = TOOLS.length;
  const totalGroups = [...new Set(TOOLS.map(t => t.group))].length;
  const STARRED = ["json","mermaid","jwt","rest","sql"];
  const RECENT  = [
    { id: "json",    time: "2 mins ago" },
    { id: "mermaid", time: "10 mins ago" },
    { id: "rest",    time: "1 hour ago" },
    { id: "jwt",     time: "2 hours ago" },
    { id: "sql",     time: "3 hours ago" },
  ];
  return (
    <div style={{ width: 220, flexShrink: 0, borderLeft: "1px solid #13161F", overflowY: "auto", background: "#0C0E14" }}>
      {/* About */}
      <div style={{ padding: "14px 13px", borderBottom: "1px solid #13161F" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <DevCostollLogo size={24} />
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 12.5, color: "#E7E9F2" }}>About DevCostoll</span>
        </div>
        <p style={{ fontSize: 10.5, color: "#7A8099", lineHeight: 1.6, margin: 0 }}>
          Your all-in-one developer toolkit.<br/>Built for developers, by developers.<br/>Boost productivity. Save time.<br/>
          <span style={{ color: "#7C5CFF" }}>Focus on what matters!</span>
        </p>
      </div>
      {/* Tools Summary */}
      <div style={{ padding: "13px 13px", borderBottom: "1px solid #13161F", background: "linear-gradient(135deg,#7C5CFF12,#3B82F610)" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#7A8099", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Tools Summary</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 38, fontWeight: 800, color: "#7C5CFF", lineHeight: 1, marginBottom: 2 }}>{totalTools}+</div>
        <div style={{ fontSize: 10.5, color: "#B7BBD0", marginBottom: 10 }}>Tools Available</div>
        {[["⊞","Total Categories",totalGroups,"#7C5CFF"],["<>","Total Tools",`${totalTools}+`,"#3B82F6"],["★","Starred Tools",STARRED.length,"#F59E0B"],["⏱","Recently Used",RECENT.length,"#34E4B8"]].map(([ic,lb,vl,cl]) => (
          <div key={lb} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 0", borderTop: "1px solid #13161F" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 10, color: cl }}>{ic}</span>
              <span style={{ fontSize: 10.5, color: "#8B90A7" }}>{lb}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#E7E9F2" }}>{vl}</span>
          </div>
        ))}
      </div>
      {/* Jira */}
      <div style={{ padding: "13px 13px", borderBottom: "1px solid #13161F" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: "linear-gradient(135deg,#0052CC,#003B99)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SiJira size={10} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 12, color: "#E7E9F2" }}>Jira Integration</span>
        </div>
        <div style={{ fontSize: 10, color: "#7A8099", marginBottom: 6 }}>Search Jira tickets using:</div>
        {["Commit Hash","Branch Name","Pull Request","Issue Key","Advanced Filters"].map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <span style={{ color: "#22C55E", fontSize: 10 }}>✓</span>
            <span style={{ fontSize: 10.5, color: "#9195AB" }}>{f}</span>
          </div>
        ))}
        <button style={{ marginTop: 8, width: "100%", background: "linear-gradient(135deg,#0052CC,#003B99)", border: "none", borderRadius: 7, padding: "7px 0", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
          Open Jira Panel ↗
        </button>
      </div>
      {/* Recently Used */}
      <div style={{ padding: "13px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#7A8099", textTransform: "uppercase", letterSpacing: 0.5 }}>Recently Used</span>
          <span style={{ fontSize: 10, color: "#7C5CFF", cursor: "pointer" }}>View all</span>
        </div>
        {RECENT.map(r => {
          const t = TOOLS.find(x => x.id === r.id); if (!t) return null;
          const grad = getIconGradient(t.id);
          return (
            <button key={r.id} onClick={() => onSelect(r.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", borderRadius: 6, padding: "4px 3px", cursor: "pointer", marginBottom: 2 }}
              onMouseEnter={e => e.currentTarget.style.background="#14171F"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ToolBrandIcon toolId={t.id} fallbackIcon={t.icon} size={12} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#E7E9F2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                <div style={{ fontSize: 9, color: "#4E5468" }}>{r.time}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Bottom bar ────────────────────────────────────────────────
function BottomBar() {
  const n = TOOLS.length;
  const g = [...new Set(TOOLS.map(t => t.group))].length;
  const STATS = [[`${n}+`,"Total Tools","⊞"],[g,"Categories","◈"],[12,"Starred Tools","★"],[18,"Recently Used","⏱"],[5,"Integrations","⚡"],[3,"Platforms","💻"],["∞","Possibilities","∞"]];
  return (
    <div style={{ height: 50, flexShrink: 0, background: "#0C0E14", borderTop: "1px solid #13161F", display: "flex", alignItems: "center", padding: "0 12px", overflowX: "auto" }}>
      {STATS.map(([val, label, icon], i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, padding: "0 12px", borderRight: i < STATS.length-1 ? "1px solid #1C2030" : "none" }}>
          <span style={{ fontSize: 13, color: "#7C5CFF" }}>{icon}</span>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 700, color: "#E7E9F2", lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 8.5, color: "#7A8099", marginTop: 1, whiteSpace: "nowrap" }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ================= Main App =================

export default function DevCostoll() {
  const [activeId, setActiveId]         = useState(null);
  const [query, setQuery]               = useState("");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [sidebarGroup, setSidebarGroup] = useState(null);

  const active    = TOOLS.find(t => t.id === activeId);
  const allGroups = [...new Set(TOOLS.map(t => t.group))];
  const filtered  = useMemo(() => TOOLS.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.group.toLowerCase().includes(query.toLowerCase()) ||
    t.desc.toLowerCase().includes(query.toLowerCase())
  ), [query]);
  const groups = [...new Set(filtered.map(t => t.group))];
  const goHome = () => { setActiveId(null); setQuery(""); };

  const sidebarProps = { query, setQuery, goHome, activeId, setActiveId, allGroups, groups, filtered, sidebarGroup, setSidebarGroup };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0A0C10", color: "#E7E9F2", fontFamily: "Inter,sans-serif", overflow: "hidden" }}>

      {/* Full-width top header */}
      <div style={{ height: 56, flexShrink: 0, background: "#0C0E14", borderBottom: "1px solid #13161F", display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
        <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#7A8099", padding: 4, flexShrink: 0 }}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M0 1h18M0 7h18M0 13h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <button onClick={goHome} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <DevCostollLogo size={34} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 19, color: "#E7E9F2", lineHeight: 1, letterSpacing: "-0.5px" }}>DevCostoll</div>
            <div style={{ fontSize: 9, color: "#7A8099", marginTop: 2 }}>All Developer Tools. One Place.</div>
          </div>
        </button>
        <div style={{ display: "flex", gap: 7, marginLeft: 16, overflowX: "auto", flex: 1, paddingBottom: 1 }}>
          {[["⚡","100+ Tools","All in One","#7C5CFF"],["📡","Offline First","Works Offline","#34E4B8"],["🤖","AI Powered","Smart Assistant","#3B82F6"],["🔒","Secure","Privacy First","#22C55E"],["💻","Cross Platform","Win, Mac, Linux","#F97316"]].map(([ic,lb,sub,cl]) => (
            <div key={lb} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: `${cl}12`, border: `1px solid ${cl}30`, borderRadius: 9, padding: "5px 10px" }}>
              <span style={{ fontSize: 12 }}>{ic}</span>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 700, color: cl, lineHeight: 1 }}>{lb}</div>
                <div style={{ fontSize: 8.5, color: "#7A8099", marginTop: 1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body row */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 40 }} />}

        {/* Mobile drawer */}
        <aside style={{ position: "fixed", top: 0, left: sidebarOpen ? 0 : -240, bottom: 0, width: 240, background: "#0C0E14", borderRight: "1px solid #13161F", overflowY: "auto", zIndex: 50, transition: "left 0.2s ease" }}>
          <SidebarContent {...sidebarProps} setActiveId={id => { setActiveId(id); setSidebarOpen(false); }} />
        </aside>

        {/* Desktop sidebar */}
        <aside style={{ width: 180, flexShrink: 0, background: "#0C0E14", borderRight: "1px solid #13161F", overflowY: "auto" }} className="hidden md:block">
          <SidebarContent {...sidebarProps} />
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {active ? (
            <div style={{ padding: "24px 28px", maxWidth: 860, boxSizing: "border-box" }}>
              <button onClick={goHome} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#4E5468", fontSize: 12, cursor: "pointer", marginBottom: 18, padding: 0 }}>
                <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} /> All Tools
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                <ToolBadge tool={active} variant="header" />
                <div>
                  <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: "0 0 4px", fontWeight: 800 }}>{active.name}</h1>
                  <span style={{ fontSize: 12, color: GROUP_COLORS[active.group] || "#7C5CFF", fontWeight: 600 }}>{active.group}</span>
                </div>
              </div>
              <p style={{ color: "#7A8099", fontSize: 13, margin: "0 0 22px 62px", lineHeight: 1.5 }}>{active.desc}</p>
              <div style={{ background: "#14171F", border: "1px solid #1B1F2B", borderRadius: 14, padding: "22px 24px", position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 20, bottom: 20, width: 3, background: `linear-gradient(${GROUP_COLORS[active.group] || "#7C5CFF"}, transparent)`, borderRadius: "0 2px 2px 0" }} />
                <active.Comp />
              </div>
            </div>
          ) : (
            <DashboardHome onSelect={setActiveId} />
          )}
        </main>

        {/* Right panel */}
        <div className="hidden lg:block">
          <RightPanel onSelect={setActiveId} />
        </div>
      </div>

      {/* Bottom bar */}
      <BottomBar />
    </div>
  );
}

function SidebarContent({ query, setQuery, goHome, activeId, setActiveId, allGroups, groups, filtered, sidebarGroup, setSidebarGroup }) {
  const STARRED = ["json","mermaid","jwt","rest","sql"];
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "10px 7px", flex: 1, gap: 1 }}>
      <div style={{ position: "relative", marginBottom: 7 }}>
        <Search size={11} color="#7A8099" style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tools…"
          style={{ width: "100%", background: "#14171F", border: "1px solid #1C2030", borderRadius: 6, padding: "6px 8px 6px 26px", color: "#E7E9F2", fontSize: 11, outline: "none", boxSizing: "border-box" }} />
      </div>
      <SidebarBtn active={!activeId && !query} onClick={goHome} icon={<LayoutDashboard size={13} />} label="Dashboard" />
      <SidebarBtn active={false} onClick={goHome} icon={<Zap size={13} />} label="All Tools" />
      <div style={{ height: 1, background: "#13161F", margin: "5px 2px" }} />
      {(query ? groups : allGroups).map(group => {
        const color = GROUP_COLORS[group] || "#7C5CFF";
        const groupTools = (query ? filtered : TOOLS).filter(t => t.group === group);
        const isOpen = sidebarGroup === group || !!query;
        return (
          <div key={group}>
            <button onClick={() => setSidebarGroup(isOpen && !query ? null : group)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", borderRadius: 5, padding: "4px 6px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", color: "#7A8099" }}>{group}</span>
              </div>
              <span style={{ fontSize: 9, color: "#4E5468" }}>{groupTools.length}</span>
            </button>
            {isOpen && groupTools.map(t => {
              const isActive = t.id === activeId;
              return (
                <button key={t.id} onClick={() => setActiveId(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, background: isActive ? `${color}18` : "transparent", border: "none", borderLeft: `2px solid ${isActive ? color : "transparent"}`, borderRadius: "0 5px 5px 0", padding: "3px 6px 3px 9px", cursor: "pointer", marginBottom: 1 }}>
                  <ToolBadge tool={t} variant="sidebar" size={20} />
                  <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400, color: isActive ? "#E7E9F2" : "#8B90A7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
                </button>
              );
            })}
          </div>
        );
      })}
      <div style={{ height: 1, background: "#13161F", margin: "5px 2px" }} />
      <SidebarBtn active={false} onClick={() => {}} icon={<SiJira size={12} color="#0052CC" />} label="Jira Integration" badge="NEW" />
      <div style={{ height: 1, background: "#13161F", margin: "5px 2px" }} />
      <div style={{ fontSize: 9, fontWeight: 600, color: "#4E5468", textTransform: "uppercase", letterSpacing: 0.5, padding: "0 6px 3px" }}>⭐ Starred Tools</div>
      {STARRED.map(id => {
        const t = TOOLS.find(x => x.id === id); if (!t) return null;
        const color = GROUP_COLORS[t.group] || "#7C5CFF";
        const grad = getIconGradient(t.id);
        return (
          <button key={id} onClick={() => setActiveId(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, background: activeId === id ? `${color}18` : "transparent", border: "none", borderRadius: 5, padding: "3px 6px", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background="#14171F"} onMouseLeave={e => e.currentTarget.style.background=activeId===id?`${color}18`:"transparent"}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ToolBrandIcon toolId={t.id} fallbackIcon={t.icon} size={10} color="#fff" />
            </div>
            <span style={{ fontSize: 11, color: "#B7BBD0", flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</span>
            <span style={{ fontSize: 11, color: "#F59E0B" }}>★</span>
          </button>
        );
      })}
      <div style={{ marginTop: "auto", paddingTop: 8, fontSize: 9, color: "#2E3347", textAlign: "center" }}>v1.0.0 · {TOOLS.length} tools</div>
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, label, badge }) {
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, background: active ? "rgba(124,92,255,0.12)" : "transparent", border: "none", borderRadius: 5, padding: "5px 6px", cursor: "pointer", color: active ? "#E7E9F2" : "#8B90A7", marginBottom: 1, fontSize: 11.5, fontWeight: active ? 600 : 400 }}>
      <span style={{ color: active ? "#7C5CFF" : "inherit", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
      {badge && <span style={{ fontSize: 8, fontWeight: 700, background: "#7C5CFF", color: "#fff", borderRadius: 3, padding: "1px 4px" }}>{badge}</span>}
    </button>
  );
}