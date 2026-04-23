# VarBridge – Figma Variables Exporter

## 📋 About the Project

A **Figma plugin** that exports Variables to **Tailwind v4** and **W3C Design Tokens** — free, open source, no backend required.

Built for designers and developers who want a clean, fast bridge between Figma design tokens and production code.

> 🎨 Export your Variables to Tailwind v4 `@theme` CSS or W3C JSON in one click — with native OKLCH color conversion.

---

## 🚀 Install

👉 [Figma Community – VarBridge](https://www.figma.com/community/plugin/1629125781231175209)

---

## ✨ Features

✅ Export Variables to Tailwind v4 `@theme` CSS  
✅ Export Variables to W3C Design Tokens JSON (Style Dictionary compatible)  
✅ Native OKLCH color conversion  
✅ Live code preview with syntax highlight  
✅ Select collections and modes individually  
✅ Token prefix and case style customization  
✅ Copy to clipboard or download as file  
✅ 100% free — no account, no backend, no limits  

---

## 🚀 Technologies

- React + TypeScript – UI layer  
- Vite – Build tooling  
- Zustand – State management  
- culori – OKLCH color conversion  
- Figma Plugin API – Variables access  

---

## 📁 Project Structure

```bash
varbridge/
│
├── src/
│   ├── plugin/        # Figma sandbox code
│   │   └── index.ts
│   ├── shared/        # Shared types and transformer
│   │   ├── transformer.ts
│   │   └── types.ts
│   └── ui/            # React interface
│       ├── components/
│       │   ├── TabExport.tsx
│       │   ├── TabPreview.tsx
│       │   └── TabSettings.tsx
│       └── store.ts
├── manifest.json
├── vite.config.ts
└── package.json
```

---

## 🖥️ Development

Clone the repository:

```bash
git clone https://github.com/FelippeCav/varbridge.git
cd varbridge
```

Install dependencies:

```bash
npm install
```

Build the plugin:

```bash
npm run build
```

Load in Figma: **Plugins → Development → Import plugin from manifest** → select `manifest.json`

---

## 🎯 How it works

1. Open VarBridge in any Figma file with Local Variables
2. Select which collections to export
3. Choose your output format — Tailwind v4 or W3C Tokens
4. Preview the generated code live
5. Copy or download

---

## 🗺️ Roadmap

- [ ] Multi-mode export (Light + Dark simultaneously)  
- [ ] GitHub/GitLab sync  
- [ ] Style Dictionary config file export  
- [ ] Import tokens back to Figma  

---

## 👨‍💻 Author

**Felippe Cavalcante**  
[GitHub](https://github.com/FelippeCav) • [LinkedIn](https://www.linkedin.com/in/felippe-cavalcante/)

---

## 📝 License

MIT — free to use, modify and distribute.