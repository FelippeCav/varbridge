import { useStore } from "../store";

const C = {
  bg: "#0D0D0D", bg2: "#161616", bg3: "#1E1E1E",
  border: "#2A2A2A", border2: "#333",
  text: "#F0EFE9", text2: "#9B9A95", text3: "#5A5A57",
  accent: "#7C5CFC", green: "#2ECC87", red: "#F26060",
};

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 28, height: 16, borderRadius: 8, cursor: "pointer",
        position: "relative", flexShrink: 0,
        background: on ? C.accent : C.bg3,
        border: on ? "none" : `0.5px solid ${C.border2}`,
      }}
    >
      <div style={{
        position: "absolute", top: 3, width: 10, height: 10,
        borderRadius: 5, background: "#fff",
        left: on ? 15 : 3, transition: "left 0.15s",
      }} />
    </div>
  );
}

function SettingRow({
  label, sub, children,
}: {
  label: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 12px", height: 44,
      background: C.bg3, border: `0.5px solid ${C.border}`,
      borderRadius: 5, marginBottom: 4,
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

export function TabSettings() {
  const { settings, updateSetting } = useStore();

  function handleReset() {
    updateSetting("useOklch", true);
    updateSetting("hexFallback", false);
    updateSetting("prefix", "--");
    updateSetting("includeComments", true);
    updateSetting("sortTokens", false);
  }

  return (
    <div style={{ padding: "0 16px", paddingBottom: 27, overflowY: "auto", maxHeight: 608 }}>

      {/* COLOR FORMAT — y:100 */}
      <div style={{ marginTop: 13 }}>
        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          Color format
        </div>

        <SettingRow label="OKLCH output" sub="Converts HEX → oklch() for Tailwind v4">
          <Toggle on={settings.useOklch} onChange={() => updateSetting("useOklch", !settings.useOklch)} />
        </SettingRow>

        <SettingRow label="HEX fallback" sub="Adds #hex comment next to oklch value">
          <Toggle
            on={settings.hexFallback}
            onChange={() => updateSetting("hexFallback", !settings.hexFallback)}
          />
        </SettingRow>
      </div>

      {/* NAMING — y:221 */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          Naming
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px", height: 44,
          background: C.bg3, border: `0.5px solid ${C.border}`,
          borderRadius: 5, marginBottom: 4,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>Prefix</div>
            <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Added before every token name</div>
          </div>
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
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 12px", height: 44,
          background: C.bg3, border: `0.5px solid ${C.border}`,
          borderRadius: 5, marginBottom: 4,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>Case style</div>
            <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Token name casing format</div>
          </div>
          <select style={{
            width: 96, height: 20, background: C.bg3,
            border: `0.5px solid ${C.border2}`, borderRadius: 4,
            color: C.text2, fontSize: 10, padding: "0 6px", outline: "none",
          }}>
            <option>kebab-case</option>
            <option>camelCase</option>
            <option>snake_case</option>
          </select>
        </div>
      </div>

      {/* OUTPUT — y:342 */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          Output
        </div>

        <SettingRow label="Include comments" sub="Groups and token descriptions">
          <Toggle on={settings.includeComments} onChange={() => updateSetting("includeComments", !settings.includeComments)} />
        </SettingRow>

        <SettingRow label="Sort tokens" sub="Alphabetically within each group">
          <Toggle on={settings.sortTokens} onChange={() => updateSetting("sortTokens", !settings.sortTokens)} />
        </SettingRow>
      </div>

      {/* ABOUT — y:463 */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 500, color: C.text3, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          About
        </div>

        <SettingRow label="Version" sub="VarBridge v1.0.0">
          <span style={{ fontSize: 11, color: C.text2 }}>v1.0.0</span>
        </SettingRow>

        <SettingRow label="Feedback" sub="Submit an issue on GitHub">
          <span
            onClick={() => window.open("https://github.com", "_blank")}
            style={{ fontSize: 11, fontWeight: 500, color: C.accent, cursor: "pointer" }}
          >
            Open →
          </span>
        </SettingRow>
      </div>

      {/* Reset — y:587 h:34 */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleReset}
          style={{
            width: "100%", height: 34,
            background: C.bg3, border: `0.5px solid ${C.border}`,
            borderRadius: 5, fontSize: 12, fontWeight: 500,
            color: C.red, cursor: "pointer",
          }}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}