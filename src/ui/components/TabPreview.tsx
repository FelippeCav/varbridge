import { useState } from "react";
import { useStore } from "../store";
import { toTailwindV4, toW3C } from "../../shared/transformer";

const C = {
  bg: "#0D0D0D", bg2: "#161616", bg3: "#1E1E1E",
  border: "#2A2A2A", border2: "#333",
  text: "#F0EFE9", text2: "#9B9A95", text3: "#5A5A57",
  accent: "#7C5CFC", green: "#2ECC87",
  purple: "#7C5CFC", greenCode: "#2ECC87",
  amber: "#F59E0B", gray: "#5A5A57",
};

const DEMO_CSS = `/* VarBridge export · Primitives */

@theme {
  /* Colors */
  --color-primary: oklch(55% 0.2 264);
  --color-surface: oklch(98% 0 0);
  --color-border: oklch(88% 0 0);

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-4: 16px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
}`;

const DEMO_JSON = `{
  "color": {
    "primary": { "$value": "#6366f1", "$type": "color" },
    "surface": { "$value": "#fafafa", "$type": "color" }
  }
}`;

export function TabPreview() {
  const { tokens, format, setFormat, settings } = useStore();
  const [copied, setCopied] = useState(false);

  const generated = format === "tailwind"
    ? toTailwindV4(tokens, { prefix: settings.prefix, useOklch: settings.useOklch, includeComments: settings.includeComments })
    : toW3C(tokens, { useOklch: settings.useOklch, includeComments: settings.includeComments });

  const displayCode = generated || (format === "tailwind" ? DEMO_CSS : DEMO_JSON);

  function fallbackCopy(text: string) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleCopy() {
    try {
      navigator.clipboard.writeText(displayCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }).catch(() => fallbackCopy(displayCode));
    } catch {
      fallbackCopy(displayCode);
    }
  }

  function handleDownload() {
    const ext = format === "tailwind" ? "css" : "json";
    const blob = new Blob([displayCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `tokens.${ext}`; a.click();
    URL.revokeObjectURL(url);
  }

  function renderLine(line: string, i: number) {
    if (format !== "tailwind") {
      return <div key={i} style={{ color: C.text2 }}>{line || "\u00A0"}</div>;
    }
    if (line.trim().startsWith("/*")) {
      return <div key={i} style={{ color: C.gray }}>{line}</div>;
    }
    if (line.trim() === "@theme {" || line.trim() === "}") {
      return <div key={i} style={{ color: C.purple }}>{line}</div>;
    }
    if (line.includes(":")) {
      const colonIdx = line.indexOf(":");
      const prop = line.substring(0, colonIdx);
      const rest = line.substring(colonIdx + 1).trim().replace(";", "");
      return (
        <div key={i}>
          <span style={{ color: C.purple }}>{prop}</span>
          <span style={{ color: C.text2 }}>: </span>
          <span style={{ color: C.greenCode }}>{rest}</span>
          <span style={{ color: C.text2 }}>;</span>
        </div>
      );
    }
    return <div key={i} style={{ color: C.text2 }}>{line || "\u00A0"}</div>;
  }

  return (
    <div style={{ padding: "0 0 27px" }}>

      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 16px 8px",
      }}>
        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Code preview
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {[
            { key: "tailwind", label: "Tailwind v4" },
            { key: "w3c", label: "W3C JSON" },
          ].map(f => (
            <div
              key={f.key}
              onClick={() => setFormat(f.key as any)}
              style={{
                fontSize: 9, fontWeight: 500, padding: "3px 9px", borderRadius: 10,
                cursor: "pointer",
                background: format === f.key ? `${C.accent}20` : C.bg3,
                border: `0.5px solid ${format === f.key ? C.accent : C.border2}`,
                color: format === f.key ? C.accent : C.text2,
              }}
            >
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* Code block — x:16 y:131 w:308 h:370 */}
      <div style={{
        margin: "0 16px",
        background: C.bg3, border: `0.5px solid ${C.border}`,
        borderRadius: 5, overflow: "hidden",
      }}>
        {/* Code header — h:28 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px", height: 28,
          background: C.bg2, borderBottom: `0.5px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: C.text2 }}>
            {format === "tailwind" ? "CSS · @theme" : "JSON · W3C Tokens"}
          </span>
          <button
            onClick={handleCopy}
            style={{
              fontSize: 10, fontWeight: 500, color: C.accent,
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Code body — h:342 */}
        <div style={{
          padding: "9px 12px", height: 342, overflowY: "auto",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
          fontSize: 9.5, lineHeight: "16px", color: C.text,
        }}>
          {displayCode.split("\n").map((line, i) => renderLine(line, i))}
        </div>
      </div>

      {/* Action buttons — y:511 w:149/151 h:32 */}
      <div style={{ display: "flex", gap: 8, margin: "8px 16px 0" }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1, height: 32, background: C.bg3,
            border: `0.5px solid ${C.border}`, borderRadius: 5,
            fontSize: 12, color: C.text2, cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy all"}
        </button>
        <button
          onClick={handleDownload}
          style={{
            flex: 1, height: 32, background: C.bg3,
            border: `0.5px solid ${C.border}`, borderRadius: 5,
            fontSize: 12, color: C.text2, cursor: "pointer",
          }}
        >
          Download .{format === "tailwind" ? "css" : "json"}
        </button>
      </div>
    </div>
  );
}