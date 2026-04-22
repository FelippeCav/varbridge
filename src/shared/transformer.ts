import { oklch, parse } from "culori";
import type { Token } from "./types";

function toOklch(hex: string): string {
  try {
    const color = parse(hex);
    if (!color) return hex;
    const ok = oklch(color);
    if (!ok) return hex;
    const l = (ok.l ?? 0).toFixed(3);
    const c = (ok.c ?? 0).toFixed(3);
    const h = isNaN(ok.h ?? NaN) ? 0 : (ok.h ?? 0).toFixed(1);
    return `oklch(${l} ${c} ${h})`;
  } catch {
    return hex;
  }
}

function figmaColorToHex(color: { r: number; g: number; b: number }): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function tokenNameToKey(name: string, prefix: string): string {
  return prefix + name.replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();
}

function resolveValue(token: Token, useOklch: boolean): string {
  const raw = token.rawValue as any;
  if (token.type === "COLOR") {
    if (typeof raw === "object" && "r" in raw) {
      const hex = figmaColorToHex(raw);
      return useOklch ? toOklch(hex) : hex;
    }
    return String(raw);
  }
  if (token.type === "FLOAT") {
    return typeof raw === "number" ? `${raw}px` : String(raw);
  }
  return String(raw);
}

export function toTailwindV4(
  tokens: Token[],
  options: { prefix: string; useOklch: boolean; includeComments: boolean }
): string {
  const { prefix, useOklch, includeComments } = options;
  const groups: Record<string, Token[]> = {};

  for (const token of tokens) {
    const g = token.collection;
    if (!groups[g]) groups[g] = [];
    groups[g].push(token);
  }

  const lines: string[] = ["@theme {"];
  for (const [group, groupTokens] of Object.entries(groups)) {
    if (includeComments) lines.push(`  /* ${group} */`);
    for (const token of groupTokens) {
      const key = tokenNameToKey(token.name, prefix);
      const value = resolveValue(token, useOklch);
      lines.push(`  ${key}: ${value};`);
    }
    lines.push("");
  }
  lines.push("}");
  return lines.join("\n");
}

export function toW3C(
  tokens: Token[],
  options: { useOklch: boolean; includeComments: boolean }
): string {
  const { useOklch } = options;
  const result: Record<string, any> = {};

  for (const token of tokens) {
    const parts = token.name.replace(/\s+/g, "-").toLowerCase().split("/");
    let cursor = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cursor[parts[i]]) cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }
    const leaf = parts[parts.length - 1];
    const raw = token.rawValue as any;
    let value: string;
    let type: string;
    if (token.type === "COLOR" && typeof raw === "object" && "r" in raw) {
      const hex = figmaColorToHex(raw);
      value = useOklch ? toOklch(hex) : hex;
      type = "color";
    } else if (token.type === "FLOAT") {
      value = `${raw}px`;
      type = "dimension";
    } else {
      value = String(raw);
      type = "string";
    }
    cursor[leaf] = { $value: value, $type: type };
  }
  return JSON.stringify(result, null, 2);
}