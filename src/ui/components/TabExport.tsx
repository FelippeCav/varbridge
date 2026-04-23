import { useState } from "react";
import { useStore } from "../store";
import { toTailwindV4, toW3C } from "../../shared/transformer";

const C = {
  bg: "#0D0D0D", bg2: "#161616", bg3: "#1E1E1E",
  border: "#2A2A2A", border2: "#333",
  text: "#F0EFE9", text2: "#9B9A95", text3: "#5A5A57",
  accent: "#7C5CFC", green: "#2ECC87", amber: "#F59E0B",
};

export function TabExport() {
  const [exported, setExported] = useState(false);
  const {
    collections, selectedCollectionIds, activeModeId,
    tokens, format, settings,
    toggleCollection, setActiveModeId, setFormat,
    updateSetting, setGeneratedCode,
  } = useStore();

  const collColors = [C.accent, C.green, C.amber, "#E879F9", "#38BDF8"];

  function handleExport() {
    const code = format === "tailwind"
      ? toTailwindV4(tokens, { prefix: settings.prefix, useOklch: settings.useOklch, includeComments: settings.includeComments })
      : toW3C(tokens, { useOklch: settings.useOklch, includeComments: settings.includeComments });
    setGeneratedCode(code);

    try {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    } catch {
      // silently fail
    }

    parent.postMessage({
      pluginMessage: {
        type: "EXPORT_TOKENS",
        collectionIds: selectedCollectionIds,
        modeId: activeModeId ?? collections[0]?.modes[0]?.modeId ?? "",
        format,
      }
    }, "*");

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  const totalTokens = collections
    .filter(c => selectedCollectionIds.includes(c.id))
    .reduce((acc, c) => acc + c.tokenCount, 0);

  const colorCount = tokens.filter(t => t.type === "COLOR").length;
  const floatCount = tokens.filter(t => t.type === "FLOAT").length;
  const otherCount = tokens.filter(t => t.type !== "COLOR" && t.type !== "FLOAT").length;

  const selectedColls = collections.filter(c => selectedCollectionIds.includes(c.id));
  const allModes = selectedColls.length > 0 ? selectedColls[0].modes : [];

  return (
    <div style={{ overflowY: "auto", maxHeight: 608, paddingBottom: 90 }}>
      <div style={{ padding: "0 16px", marginTop: 13 }}>

        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          Variables detected
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Colors", num: colorCount },
            { label: "Spacing", num: floatCount },
            { label: "Other", num: otherCount },
          ].map(s => (
            <div key={s.label} style={{ background: C.bg3, border: `0.5px solid ${C.border}`, borderRadius: 5, padding: "8px 10px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 10, color: C.text2, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          Collections
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
          {collections.map((c, i) => {
            const sel = selectedCollectionIds.includes(c.id);
            const dot = collColors[i % collColors.length];
            return (
              <div
                key={c.id}
                onClick={() => toggleCollection(c.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "0 10px", height: 40,
                  background: sel ? `${C.accent}14` : C.bg3,
                  border: `0.5px solid ${sel ? C.accent : C.border}`,
                  borderRadius: 5, cursor: "pointer",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 4, background: dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: C.text2 }}>{c.tokenCount} vars · {c.modes.length} mode{c.modes.length !== 1 ? "s" : ""}</div>
                </div>
                <div style={{
                  width: 14, height: 14, borderRadius: 7, flexShrink: 0,
                  background: sel ? C.accent : "transparent",
                  border: sel ? "none" : `0.5px solid ${C.border2}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {sel && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3.5 5.5L7 1" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 1, background: C.border, margin: "0 0 12px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Export mode
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {(allModes.length > 0 ? allModes.map(m => ({ id: m.modeId, label: m.name })) : [{ id: "light", label: "Light" }, { id: "dark", label: "Dark" }]).map((m, i) => (
              <div
                key={m.id}
                onClick={() => setActiveModeId(m.id)}
                style={{
                  fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 11,
                  cursor: "pointer",
                  background: (activeModeId === m.id || (!activeModeId && i === 0)) ? `${C.accent}20` : C.bg3,
                  border: `0.5px solid ${(activeModeId === m.id || (!activeModeId && i === 0)) ? C.accent : C.border2}`,
                  color: (activeModeId === m.id || (!activeModeId && i === 0)) ? C.accent : C.text2,
                }}
              >{m.label}</div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: C.border, margin: "0 0 12px" }} />

        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          Output format
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[
            { key: "tailwind", title: "Tailwind v4", sub: "CSS · @theme" },
            { key: "w3c", title: "W3C Tokens", sub: "JSON · Style Dictionary" },
          ].map(f => (
            <div
              key={f.key}
              onClick={() => setFormat(f.key as any)}
              style={{
                flex: 1, padding: "13px 14px", borderRadius: 5, cursor: "pointer",
                background: format === f.key ? `${C.accent}14` : C.bg3,
                border: `0.5px solid ${format === f.key ? C.accent : C.border}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500, color: format === f.key ? C.accent : C.text }}>{f.title}</div>
              <div style={{ fontSize: 8, color: C.text2, marginTop: 4 }}>{f.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: C.border, margin: "0 0 12px" }} />

        {([
          { label: "OKLCH colors", key: "useOklch", type: "toggle" },
          { label: "Token prefix", key: "prefix", type: "input" },
          { label: "Include comments", key: "includeComments", type: "toggle" },
        ] as const).map(opt => (
          <div key={opt.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: C.text2 }}>{opt.label}</span>
            {opt.type === "toggle" ? (
              <div
                onClick={() => updateSetting(opt.key, !(settings as any)[opt.key])}
                style={{
                  width: 28, height: 16, borderRadius: 8, cursor: "pointer",
                  position: "relative",
                  background: (settings as any)[opt.key] ? C.accent : C.bg3,
                  border: (settings as any)[opt.key] ? "none" : `0.5px solid ${C.border2}`,
                }}
              >
                <div style={{
                  position: "absolute", top: 3, width: 10, height: 10,
                  borderRadius: 5, background: "#fff",
                  left: (settings as any)[opt.key] ? 15 : 3, transition: "left 0.15s",
                }} />
              </div>
            ) : (
              <input
                value={settings.prefix}
                onChange={e => updateSetting("prefix", e.target.value)}
                style={{
                  width: 80, height: 20, background: C.bg3,
                  border: `0.5px solid ${C.border2}`, borderRadius: 4,
                  color: C.text2, fontSize: 11, padding: "0 6px",
                  fontFamily: "monospace", outline: "none",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{
        position: "fixed", bottom: 27, left: 0, width: 340,
        background: C.bg2, padding: "10px 16px 14px",
        borderTop: `0.5px solid ${C.border}`,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 10, color: C.text2,
          background: `${C.green}1A`, border: `0.5px solid ${C.green}33`,
          borderRadius: 10, padding: "3px 9px", marginBottom: 8,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: 2.5, background: C.green }} />
          {totalTokens || 44} tokens ready to export
        </div>
        <button
          onClick={handleExport}
          style={{
            width: "100%", height: 36,
            background: exported ? "#1B9960" : C.accent,
            color: "#fff",
            fontSize: 13, fontWeight: 500, border: "none", borderRadius: 5,
            cursor: "pointer", transition: "background 0.2s",
          }}
        >
          {exported ? "Copied to clipboard!" : "Export tokens"}
        </button>
      </div>
    </div>
  );
}