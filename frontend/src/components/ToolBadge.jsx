/**
 * ToolBadge — icon badge with real brand icons (simple-icons)
 * + gradient background matching the reference design.
 *
 * variant:
 *   "sidebar"  → small tinted square, colored Lucide icon
 *   "header"   → large gradient bg, white brand/Lucide icon
 */
import {
  SiJson, SiYaml, SiDocker, SiKubernetes, SiTerraform,
  SiGraphql, SiPostman, SiAmazonwebservices, SiMongodb,
  SiPostgresql, SiMarkdown, SiToml, SiGit, SiSvg, SiMermaid, SiJira,
} from "@icons-pack/react-simple-icons";

const GROUP_COLORS = {
  "AI Assistant":  "#7C5CFF",
  DevOps:          "#00B8D9",
  "API Studio":    "#3B82F6",
  "Code Tools":    "#22C55E",
  Database:        "#10B981",
  Converters:      "#F59E0B",
  "Cloud Toolkit": "#F97316",
  Security:        "#EF4444",
  "Text Utilities":"#EC4899",
  "Diagram Tools": "#A855F7",
  "Git Tools":     "#F97316",
  Networking:      "#06B6D4",
  Productivity:    "#84CC16",
  "File Tools":    "#FB923C",
};

const BRAND_ICONS = {
  "json":        { Si: SiJson,               grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
  "yaml-fmt":    { Si: SiYaml,               grad: "linear-gradient(135deg,#EF4444,#B91C1C)" },
  "markdown":    { Si: SiMarkdown,           grad: "linear-gradient(135deg,#64748B,#334155)" },
  "toml":        { Si: SiToml,               grad: "linear-gradient(135deg,#F97316,#C2410C)" },
  "docker":      { Si: SiDocker,             grad: "linear-gradient(135deg,#0EA5E9,#0369A1)" },
  "gitignore":   { Si: SiGit,               grad: "linear-gradient(135deg,#F05032,#C0300D)" },
  "svg-preview": { Si: SiSvg,               grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
  "mermaid":     { Si: SiMermaid,           grad: "linear-gradient(135deg,#FF6B6B,#EE5A24)" },
  "jira":        { Si: SiJira,              grad: "linear-gradient(135deg,#0052CC,#003B99)" },
  "k8s":         { Si: SiKubernetes,        grad: "linear-gradient(135deg,#326CE5,#1E40AF)" },
  "git-commit":  { Si: SiGit,               grad: "linear-gradient(135deg,#F05032,#C0300D)" },
  "arn":         { Si: SiAmazonwebservices,  grad: "linear-gradient(135deg,#FF9900,#CC7A00)" },
  "terraform":   { Si: SiTerraform,         grad: "linear-gradient(135deg,#7B42BC,#5B2D8E)" },
  "graphql":     { Si: SiGraphql,           grad: "linear-gradient(135deg,#E10098,#9B0070)" },
  "rest":        { Si: SiPostman,           grad: "linear-gradient(135deg,#FF6C37,#E54D1A)" },
  "mongo-query": { Si: SiMongodb,           grad: "linear-gradient(135deg,#00ED64,#00934B)" },
  "sql":         { Si: SiPostgresql,        grad: "linear-gradient(135deg,#4169E1,#2C4BAD)" },
};

const FALLBACK_GRADIENTS = {
  "ai":           "linear-gradient(135deg,#7C5CFF,#5B3FCC)",
  "ai-commit":    "linear-gradient(135deg,#9B6DFF,#7C5CFF)",
  "ws":           "linear-gradient(135deg,#06B6D4,#0284C7)",
  "openapi":      "linear-gradient(135deg,#22C55E,#15803D)",
  "xml-fmt":      "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  "ini":          "linear-gradient(135deg,#06B6D4,#0E7490)",
  "beautify":     "linear-gradient(135deg,#EC4899,#BE185D)",
  "gzip":         "linear-gradient(135deg,#14B8A6,#0F766E)",
  "diff":         "linear-gradient(135deg,#F97316,#EA580C)",
  "cron":         "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "iam":          "linear-gradient(135deg,#EF4444,#DC2626)",
  "cidr":         "linear-gradient(135deg,#06B6D4,#0891B2)",
  "env-parser":   "linear-gradient(135deg,#22C55E,#15803D)",
  "mockdata":     "linear-gradient(135deg,#10B981,#059669)",
  "jwt":          "linear-gradient(135deg,#F59E0B,#B45309)",
  "url-enc":      "linear-gradient(135deg,#6366F1,#4338CA)",
  "html-enc":     "linear-gradient(135deg,#EC4899,#DB2777)",
  "hex-enc":      "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "basic-auth":   "linear-gradient(135deg,#EF4444,#DC2626)",
  "hmac":         "linear-gradient(135deg,#F97316,#EA580C)",
  "aes":          "linear-gradient(135deg,#10B981,#059669)",
  "base64":       "linear-gradient(135deg,#3B82F6,#2563EB)",
  "hash":         "linear-gradient(135deg,#64748B,#475569)",
  "uuid":         "linear-gradient(135deg,#A855F7,#9333EA)",
  "password":     "linear-gradient(135deg,#22C55E,#16A34A)",
  "yaml":         "linear-gradient(135deg,#EF4444,#DC2626)",
  "csv":          "linear-gradient(135deg,#10B981,#059669)",
  "unitconv":     "linear-gradient(135deg,#F59E0B,#D97706)",
  "color":        "linear-gradient(135deg,#EC4899,#DB2777)",
  "ts-converter": "linear-gradient(135deg,#6366F1,#4F46E5)",
  "number-base":  "linear-gradient(135deg,#06B6D4,#0284C7)",
  "plantuml":     "linear-gradient(135deg,#A855F7,#9333EA)",
  "ascii-art":    "linear-gradient(135deg,#14B8A6,#0D9488)",
  "regex":        "linear-gradient(135deg,#22C55E,#16A34A)",
  "case":         "linear-gradient(135deg,#3B82F6,#2563EB)",
  "words":        "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "lorem":        "linear-gradient(135deg,#64748B,#475569)",
  "string-escape":"linear-gradient(135deg,#F97316,#EA580C)",
  "line-tools":   "linear-gradient(135deg,#06B6D4,#0891B2)",
  "image-info":   "linear-gradient(135deg,#EC4899,#DB2777)",
  "file-hash":    "linear-gradient(135deg,#64748B,#334155)",
  "pomodoro":     "linear-gradient(135deg,#EF4444,#DC2626)",
  "snippets":     "linear-gradient(135deg,#F59E0B,#D97706)",
  "notes":        "linear-gradient(135deg,#22C55E,#15803D)",
  "http-status":  "linear-gradient(135deg,#3B82F6,#1D4ED8)",
  "user-agent":   "linear-gradient(135deg,#8B5CF6,#6D28D9)",
};

export default function ToolBadge({ tool, variant = "sidebar", size }) {
  const LucideIcon = tool.icon;
  const brand      = BRAND_ICONS[tool.id];
  const color      = GROUP_COLORS[tool.group] || "#7C5CFF";
  const grad       = brand?.grad || FALLBACK_GRADIENTS[tool.id] || `linear-gradient(135deg,${color},${color}cc)`;

  if (variant === "header") {
    const dim = size || 48;
    const BrandSi = brand?.Si;
    return (
      <div style={{
        width: dim, height: dim, borderRadius: Math.round(dim * 0.28),
        background: grad, boxShadow: `0 4px 16px ${color}50`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {BrandSi
          ? <BrandSi size={Math.round(dim * 0.46)} color="#fff" />
          : <LucideIcon size={Math.round(dim * 0.46)} color="#fff" strokeWidth={2} />
        }
      </div>
    );
  }

  // sidebar — small tinted, colored Lucide icon (brand icons too complex at small size)
  const dim = size || 26;
  return (
    <div style={{
      width: dim, height: dim, borderRadius: Math.round(dim * 0.3), flexShrink: 0,
      background: `${color}20`, border: `1px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <LucideIcon size={Math.round(dim * 0.52)} color={color} strokeWidth={2.2} />
    </div>
  );
}
