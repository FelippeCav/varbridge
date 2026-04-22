import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "dist/ui");
const htmlPath = path.resolve(distDir, "index.html");
const assetsDir = path.resolve(distDir, "assets");

const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith(".js"));
if (jsFiles.length === 0) { console.error("No JS found"); process.exit(1); }

const jsContent = fs.readFileSync(path.resolve(assetsDir, jsFiles[0]), "utf-8");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VarBridge</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #0D0D0D; color: #F0EFE9; font-family: Inter, sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>${jsContent}</script>
  </body>
</html>`;

fs.writeFileSync(htmlPath, html);
console.log("✓ HTML gerado com JS inline:", jsFiles[0]);