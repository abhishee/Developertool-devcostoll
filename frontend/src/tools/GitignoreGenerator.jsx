import React, { useState } from "react";
import OutputBar from "../components/OutputBar.jsx";

const inputStyle = {
  background: "#0D0F16", border: "1px solid #232735", borderRadius: 8,
  padding: "8px 12px", color: "#E7E9F2", fontFamily: "Inter, sans-serif",
  fontSize: 12.5, outline: "none",
};

const TEMPLATES = {
  Node: `# Node.js
node_modules/
dist/
build/
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnpm-store/
.npm
coverage/
.nyc_output/`,

  Python: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
dist/
*.egg-info/
.eggs/
.venv/
venv/
env/
.env
.coverage
htmlcov/
.pytest_cache/
*.pyc`,

  React: `# React / Vite
node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
.DS_Store
coverage/`,

  Java: `# Java / Maven / Gradle
target/
build/
*.class
*.jar
*.war
*.ear
.gradle/
.idea/
*.iml
.classpath
.project
.settings/`,

  Go: `# Go
bin/
vendor/
*.test
*.out
go.sum
.env`,

  Rust: `# Rust
/target/
Cargo.lock
*.rs.bk`,

  Docker: `# Docker
.dockerignore
docker-compose.override.yml
.docker/`,

  macOS: `# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes`,

  Windows: `# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/`,

  "VS Code": `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace`,
};

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState(["Node", "macOS", "VS Code"]);

  const toggle = (key) =>
    setSelected(s => s.includes(key) ? s.filter(k => k !== key) : [...s, key]);

  const output = selected.map(k => TEMPLATES[k]).join("\n\n");

  return (
    <div>
      <p style={{ fontSize: 12.5, color: "#7A8099", marginBottom: 12 }}>
        Select the stacks and environments to include in your <code style={{ color: "#34E4B8" }}>.gitignore</code>:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {Object.keys(TEMPLATES).map(k => (
          <button
            key={k}
            onClick={() => toggle(k)}
            style={{
              ...inputStyle, cursor: "pointer", padding: "6px 14px",
              background: selected.includes(k) ? "rgba(124,92,255,0.2)" : "#0D0F16",
              border: `1px solid ${selected.includes(k) ? "#7C5CFF" : "#232735"}`,
              color: selected.includes(k) ? "#E7E9F2" : "#7A8099",
              borderRadius: 20, fontWeight: selected.includes(k) ? 600 : 400,
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <OutputBar value={output || "# Select at least one template above"} label={`.gitignore · ${selected.length} templates`} />
    </div>
  );
}
