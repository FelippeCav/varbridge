import { useEffect, useState } from "react";
import { useStore } from "./ui/store";
import { TabExport } from "./ui/components/TabExport";
import { TabPreview } from "./ui/components/TabPreview";
import { TabSettings } from "./ui/components/TabSettings";
import type { PluginMessage } from "./shared/types";

const C = {
  bg: "#0D0D0D", bg2: "#161616", bg3: "#1E1E1E",
  border: "#2A2A2A", border2: "#333",
  text: "#F0EFE9", text2: "#9B9A95", text3: "#5A5A57",
  accent: "#7C5CFC", green: "#2ECC87",
};

type Tab = "export" | "preview" | "settings";

export default function App() {
  const [tab, setTab] = useState<Tab>("export");
  const [connected, setConnected] = useState(false);
  const { setCollections, setTokens } = useStore();

  useEffect(() => {
  window.onmessage = (event) => {
    const msg: PluginMessage = event.data.pluginMessage;
    if (!msg) return;
    if (msg.type === "COLLECTIONS_LOADED") {
      setCollections(msg.collections);
      setConnected(true);
    }
    if (msg.type === "TOKENS_LOADED") {
      setTokens(msg.tokens);
    }
  };

  // UI avisa o plugin que está pronta
  parent.postMessage({ pluginMessage: { type: "UI_READY" } }, "*");
}, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "export", label: "Export" },
    { key: "preview", label: "Preview" },
    { key: "settings", label: "Settings" },
  ];

  const underlinePos: Record<Tab, { x: number; w: number }> = {
    export:   { x: 16, w: 47 },
    preview:  { x: 80, w: 47 },
    settings: { x: 151, w: 48 },
  };

  return (
    <div style={{
      width: 340, height: 660,
      background: C.bg,
      fontFamily: "Inter, -apple-system, sans-serif",
      fontSize: 13, color: C.text,
      display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
    }}>

      {/* HEADER — h:52 */}
      <div style={{
        height: 52, background: C.bg2,
        borderBottom: `0.5px solid ${C.border}`,
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 26, height: 26, background: C.accent,
          borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 11L7 3L11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.5 8.5H9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, lineHeight: 1 }}>VarBridge</div>
          <div style={{ fontSize: 10, color: C.text3, marginTop: 3 }}>v1.0.0</div>
        </div>
        <div style={{
          background: `${C.accent}26`, border: `0.5px solid ${C.accent}40`,
          borderRadius: 9, padding: "3px 10px",
          fontSize: 9, fontWeight: 500, color: C.accent,
        }}>
          Free · Open
        </div>
      </div>

      {/* TABS — y:52 h:36 */}
      <div style={{
        height: 36, background: C.bg2,
        borderBottom: `0.5px solid ${C.border}`,
        display: "flex", alignItems: "center",
        position: "relative", flexShrink: 0,
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: tab === t.key ? 500 : 400,
              color: tab === t.key ? C.text : C.text2,
              position: "absolute",
              left: t.key === "export" ? 16 : t.key === "preview" ? 80 : 151,
              top: 0, height: 36, padding: 0,
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{
          position: "absolute", bottom: 0,
          left: underlinePos[tab].x,
          width: underlinePos[tab].w,
          height: 2, background: C.accent,
          transition: "left 0.15s, width 0.15s",
        }} />
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {tab === "export" && <TabExport />}
        {tab === "preview" && <TabPreview />}
        {tab === "settings" && <TabSettings />}
      </div>

      {/* STATUS BAR — y:633 h:27 */}
      <div style={{
        height: 27, background: C.bg2,
        borderTop: `0.5px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.text3 }}>
          <div style={{ width: 5, height: 5, borderRadius: 2.5, background: connected ? C.green : C.text3 }} />
          {connected ? "File connected" : "Connecting..."}
        </div>
        <div style={{ fontSize: 10, color: C.text3 }}>varbridge.figma</div>
      </div>
    </div>
  );
}