import {
  Zap, GitBranch, Send, Braces, FileText, FileCode, Binary,
  RefreshCw, ArrowRightLeft, Database, Cloud, Table2, Server,
  KeyRound, Regex, CaseSensitive, ShieldCheck, Fingerprint,
  GitMerge, GitCommit, Globe, Lock, Hash, Code2, Terminal,
  Image, FileArchive, FileSearch, Clipboard, BookOpen,
  LayoutDashboard, Cpu, Network, Timer, Palette, Settings,
  Workflow, Boxes, ScanLine, BarChart2, Link, Smartphone,
  Wifi, HardDrive, Play, Bug, TestTube2, Wrench,
} from "lucide-react";

export const GROUP_COLORS = {
  "AI Assistant":   "#7C5CFF",
  "DevOps":         "#00B8D9",
  "API Studio":     "#3B82F6",
  "Code Tools":     "#22C55E",
  "Database":       "#10B981",
  "Converters":     "#F59E0B",
  "Cloud Toolkit":  "#F97316",
  "Security":       "#EF4444",
  "Text Utilities": "#EC4899",
  "Diagram Tools":  "#A855F7",
  "File Tools":     "#14B8A6",
  "Productivity":   "#FBBF24",
  "Networking":     "#6366F1",
};

export const TOOLS = [
  // ── AI Assistant ──────────────────────────────────────────────
  { id: "ai",            name: "AI Assistant",            icon: Zap,          group: "AI Assistant",   desc: "Explain, fix, format, or test code via Claude" },
  { id: "ai-readme",     name: "README Generator",        icon: BookOpen,     group: "AI Assistant",   desc: "Generate a polished README from your code or description" },
  { id: "ai-regex",      name: "Regex from Description",  icon: Regex,        group: "AI Assistant",   desc: "Describe a pattern in plain English, get a regex" },
  { id: "ai-commit",     name: "Commit Message Writer",   icon: GitCommit,    group: "AI Assistant",   desc: "Generate a conventional commit message from a diff" },
  { id: "ai-sql",        name: "SQL from Natural Language",icon: Database,    group: "AI Assistant",   desc: "Describe a query in English, get SQL back" },

  // ── API Studio ────────────────────────────────────────────────
  { id: "rest",          name: "REST Client",             icon: Send,         group: "API Studio",     desc: "Send real HTTP requests, see live responses" },
  { id: "graphql",       name: "GraphQL Explorer",        icon: ArrowRightLeft,group: "API Studio",   desc: "Send GraphQL queries and inspect JSON responses" },
  { id: "ws",            name: "WebSocket Client",        icon: Wifi,         group: "API Studio",     desc: "Connect to WebSocket endpoints and send messages" },
  { id: "grpc",          name: "gRPC Client",             icon: Server,       group: "API Studio",     desc: "Test gRPC endpoints via gRPC-Web" },
  { id: "openapi",       name: "OpenAPI Viewer",          icon: FileSearch,   group: "API Studio",     desc: "Paste an OpenAPI/Swagger spec and explore endpoints" },

  // ── Code Tools ────────────────────────────────────────────────
  { id: "json",          name: "JSON Formatter",          icon: Braces,       group: "Code Tools",     desc: "Validate & pretty-print JSON" },
  { id: "yaml-fmt",      name: "YAML Formatter",          icon: FileCode,     group: "Code Tools",     desc: "Normalize YAML indentation" },
  { id: "xml-fmt",       name: "XML Formatter",           icon: FileCode,     group: "Code Tools",     desc: "Pretty-print XML via native DOM parser" },
  { id: "toml",          name: "TOML Formatter",          icon: FileCode,     group: "Code Tools",     desc: "Format TOML config files" },
  { id: "ini",           name: "INI Formatter",           icon: FileCode,     group: "Code Tools",     desc: "Format INI-style config files" },
  { id: "markdown",      name: "Markdown Formatter",      icon: FileText,     group: "Code Tools",     desc: "Normalize markdown spacing and headings" },
  { id: "beautify",      name: "CSS / HTML Beautifier",   icon: Code2,        group: "Code Tools",     desc: "Beautify or minify CSS & HTML" },
  { id: "gzip",          name: "Gzip Compress/Decompress",icon: Binary,       group: "Code Tools",     desc: "Native browser gzip, no library" },
  { id: "diff",          name: "Text Diff",               icon: GitMerge,     group: "Code Tools",     desc: "Side-by-side diff of two text blocks" },
  { id: "gitignore",     name: ".gitignore Generator",    icon: GitBranch,    group: "Code Tools",     desc: "Generate .gitignore for any stack" },
  { id: "docker",        name: "Dockerfile Linter",       icon: Boxes,        group: "Code Tools",     desc: "Lint and review your Dockerfile" },

  // ── DevOps ────────────────────────────────────────────────────
  { id: "jira",          name: "Jira Ticket Finder",      icon: GitBranch,    group: "DevOps",         desc: "Extract ticket keys from commits" },
  { id: "cron",          name: "Cron Builder",            icon: Timer,        group: "DevOps",         desc: "Build & read cron expressions" },
  { id: "k8s",           name: "K8s YAML Validator",      icon: Workflow,     group: "DevOps",         desc: "Validate Kubernetes YAML structure" },
  { id: "docker-compose",name: "Docker Compose Helper",   icon: Boxes,        group: "DevOps",         desc: "Scaffold and lint docker-compose.yml" },
  { id: "git-commit",    name: "Conventional Commit",     icon: GitCommit,    group: "DevOps",         desc: "Build conventional commit messages visually" },

  // ── Cloud Toolkit ─────────────────────────────────────────────
  { id: "arn",           name: "AWS ARN Parser",          icon: Cloud,        group: "Cloud Toolkit",  desc: "Break an ARN into its parts" },
  { id: "terraform",     name: "Terraform Formatter",     icon: Server,       group: "Cloud Toolkit",  desc: "terraform fmt–style HCL cleanup" },
  { id: "iam",           name: "IAM Policy Validator",    icon: Lock,         group: "Cloud Toolkit",  desc: "Validate and explain AWS IAM JSON policies" },
  { id: "cidr",          name: "CIDR Calculator",         icon: Network,      group: "Cloud Toolkit",  desc: "Subnet, hosts, broadcast from a CIDR block" },
  { id: "env-parser",    name: "Env File Parser",         icon: Settings,     group: "Cloud Toolkit",  desc: "Parse .env files and generate export commands" },

  // ── Database ──────────────────────────────────────────────────
  { id: "sql",           name: "SQL Formatter",           icon: Database,     group: "Database",       desc: "Keyword-based SQL formatting" },
  { id: "mockdata",      name: "Mock Data Generator",     icon: Table2,       group: "Database",       desc: "Schema-driven fake data, JSON or CSV" },
  { id: "er",            name: "ER Diagram Builder",      icon: Workflow,     group: "Database",       desc: "Draw simple ER diagrams from schema text" },
  { id: "mongo-query",   name: "MongoDB Query Builder",   icon: Database,     group: "Database",       desc: "Build MongoDB filter/projection queries" },

  // ── Security ──────────────────────────────────────────────────
  { id: "jwt",           name: "JWT Decoder",             icon: KeyRound,     group: "Security",       desc: "Decode header & payload" },
  { id: "url-enc",       name: "URL Encoder/Decoder",     icon: Link,         group: "Security",       desc: "encodeURIComponent / decode" },
  { id: "html-enc",      name: "HTML Entity Coder",       icon: Code2,        group: "Security",       desc: "Escape/unescape HTML entities" },
  { id: "hex-enc",       name: "Hex Encoder/Decoder",     icon: Binary,       group: "Security",       desc: "Text ↔ hex bytes" },
  { id: "basic-auth",    name: "Basic Auth Encoder",      icon: KeyRound,     group: "Security",       desc: "user:pass ↔ Authorization header" },
  { id: "hmac",          name: "HMAC Generator",          icon: ShieldCheck,  group: "Security",       desc: "Sign a message with a secret key" },
  { id: "aes",           name: "AES Encrypt/Decrypt",     icon: Lock,         group: "Security",       desc: "Real AES-256-GCM, passphrase-based" },
  { id: "base64",        name: "Base64",                  icon: Binary,       group: "Security",       desc: "Encode / decode text or file" },
  { id: "hash",          name: "Hash Generator",          icon: Hash,         group: "Security",       desc: "SHA-1 / 256 / 384 / 512" },
  { id: "uuid",          name: "UUID Generator",          icon: Fingerprint,  group: "Security",       desc: "Bulk v4 UUIDs" },
  { id: "password",      name: "Password Generator",      icon: ShieldCheck,  group: "Security",       desc: "Strong random passwords" },
  { id: "cors-tester",   name: "CORS Tester",             icon: Globe,        group: "Security",       desc: "Check CORS headers on any URL" },

  // ── Converters ────────────────────────────────────────────────
  { id: "yaml",          name: "JSON ↔ YAML",             icon: ArrowRightLeft,group: "Converters",   desc: "Convert between JSON and YAML" },
  { id: "csv",           name: "JSON ↔ CSV",              icon: ArrowRightLeft,group: "Converters",   desc: "Convert between JSON and CSV" },
  { id: "unitconv",      name: "Unit Converter",          icon: ArrowRightLeft,group: "Converters",   desc: "Length, weight, data, time, temperature" },
  { id: "color",         name: "Color Converter",         icon: Palette,      group: "Converters",     desc: "HEX ↔ RGB ↔ HSL ↔ named colors" },
  { id: "ts-converter",  name: "Timestamp Converter",     icon: Timer,        group: "Converters",     desc: "Unix timestamp ↔ human date" },
  { id: "number-base",   name: "Number Base Converter",   icon: Binary,       group: "Converters",     desc: "Binary, Octal, Decimal, Hex" },

  // ── Diagram Tools ─────────────────────────────────────────────
  { id: "mermaid",       name: "Mermaid Editor",          icon: Workflow,     group: "Diagram Tools",  desc: "Write and preview Mermaid diagrams" },
  { id: "plantuml",      name: "PlantUML Renderer",       icon: ScanLine,     group: "Diagram Tools",  desc: "Render PlantUML diagrams via online server" },
  { id: "ascii-art",     name: "ASCII Art Generator",     icon: Terminal,     group: "Diagram Tools",  desc: "Convert text to ASCII art banners" },
  { id: "svg-preview",   name: "SVG Previewer",           icon: Image,        group: "Diagram Tools",  desc: "Paste SVG markup and preview it live" },

  // ── Text Utilities ────────────────────────────────────────────
  { id: "regex",         name: "Regex Tester",            icon: Regex,        group: "Text Utilities", desc: "Live pattern matching" },
  { id: "case",          name: "Case Converter",          icon: CaseSensitive,group: "Text Utilities", desc: "camel / snake / kebab / title" },
  { id: "words",         name: "Word Counter",            icon: FileText,     group: "Text Utilities", desc: "Words, chars, sentences" },
  { id: "lorem",         name: "Lorem Ipsum Generator",   icon: FileText,     group: "Text Utilities", desc: "Generate placeholder text paragraphs" },
  { id: "string-escape", name: "String Escape/Unescape",  icon: Code2,        group: "Text Utilities", desc: "Escape/unescape JS, JSON, and regex strings" },
  { id: "line-tools",    name: "Line Tools",              icon: BarChart2,    group: "Text Utilities", desc: "Sort, deduplicate, reverse, and count lines" },

  // ── File Tools ────────────────────────────────────────────────
  { id: "image-info",    name: "Image Info",              icon: Image,        group: "File Tools",     desc: "Show width, height, size, MIME type of an image" },
  { id: "file-hash",     name: "File Hash",               icon: Hash,         group: "File Tools",     desc: "SHA-256 hash of any local file" },
  { id: "file-diff",     name: "File Compare",            icon: GitMerge,     group: "File Tools",     desc: "Diff two uploaded text files" },
  { id: "json-csv-file", name: "JSON → CSV (File)",       icon: FileArchive,  group: "File Tools",     desc: "Upload a JSON file, download as CSV" },

  // ── Productivity ─────────────────────────────────────────────
  { id: "pomodoro",      name: "Pomodoro Timer",          icon: Timer,        group: "Productivity",   desc: "25-min focus sessions with break reminders" },
  { id: "snippets",      name: "Snippet Manager",         icon: Clipboard,    group: "Productivity",   desc: "Save and recall reusable code snippets" },
  { id: "notes",         name: "Quick Notes",             icon: FileText,     group: "Productivity",   desc: "Scratch-pad that persists in localStorage" },
  { id: "checklist",     name: "Checklist Builder",       icon: LayoutDashboard, group: "Productivity", desc: "Create and check off task lists" },

  // ── Networking ────────────────────────────────────────────────
  { id: "dns",           name: "DNS Lookup",              icon: Globe,        group: "Networking",     desc: "Resolve domains via the DNS-over-HTTPS API" },
  { id: "ip-info",       name: "IP Info",                 icon: Network,      group: "Networking",     desc: "Geolocation and metadata for an IP address" },
  { id: "user-agent",    name: "User Agent Parser",       icon: Smartphone,   group: "Networking",     desc: "Parse a User-Agent string into its components" },
  { id: "http-status",   name: "HTTP Status Reference",   icon: HardDrive,    group: "Networking",     desc: "Look up any HTTP status code explanation" },
  { id: "mime-lookup",   name: "MIME Type Lookup",        icon: FileSearch,   group: "Networking",     desc: "Find MIME type for any file extension" },
];
