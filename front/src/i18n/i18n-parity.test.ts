import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { baseCompile } from "@intlify/message-compiler";
import pt from "@/i18n/messages/pt.json";
import en from "@/i18n/messages/en.json";
import { ERROR_CODE_KEYS, ERROR_STATUS_KEYS } from "@/composables/useApiError.constants";

const EM_DASH = String.fromCharCode(8212);
const SRC = join(__dirname, "..");

function flatten(node: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else Object.assign(out, flatten(value, path));
  }
  return out;
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(vue|ts)$/.test(name) && !/\.test\.ts$/.test(name) && !full.includes(`${join(SRC, "test")}`) ? [full] : [];
  });
}

const flatPt = flatten(pt);
const flatEn = flatten(en);
const namespaces = Object.keys(pt);

function usedKeys(): Map<string, string> {
  const used = new Map<string, string>();
  const literal = new RegExp(`["']((?:${namespaces.join("|")})\\.[A-Za-z0-9_.]+)["']`, "g");
  for (const file of sourceFiles(SRC)) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\bt\(\s*["']([A-Za-z0-9_.]+)["']/g)) used.set(match[1], file);
    if (/\.constants\.ts$/.test(file)) for (const match of text.matchAll(literal)) used.set(match[1], file);
  }
  return used;
}

function params(message: string): string[] {
  return [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

describe("i18n parity", () => {
  it("has the same keys in pt and en", () => {
    expect(Object.keys(flatPt).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("has no empty values", () => {
    for (const [key, value] of [...Object.entries(flatPt), ...Object.entries(flatEn)]) expect(value.trim(), key).not.toBe("");
  });

  it("uses the same placeholders in both languages", () => {
    for (const key of Object.keys(flatPt)) expect(params(flatEn[key]), key).toEqual(params(flatPt[key]));
  });

  it("has no em dash", () => {
    for (const [key, value] of [...Object.entries(flatPt), ...Object.entries(flatEn)]) expect(value.includes(EM_DASH), key).toBe(false);
  });

  it("compiles every message", () => {
    for (const [key, value] of [...Object.entries(flatPt), ...Object.entries(flatEn)]) {
      const errors: unknown[] = [];
      baseCompile(value, { onError: (error) => errors.push(error) });
      expect(errors, key).toEqual([]);
    }
  });

  it("defines every key used by the source in both languages", () => {
    const missing = [...usedKeys()].filter(([key]) => !(key in flatPt) || !(key in flatEn)).map(([key, file]) => `${key} (${file})`);
    expect(missing).toEqual([]);
  });

  it("covers every contact page key", () => {
    const required = [
      "contact.title",
      "contact.back",
      "contact.size",
      "contact.messageLabel",
      "contact.messageHint",
      "contact.message.withSize",
      "contact.message.withoutSize",
      "contact.whatsapp",
      "contact.instagram.button",
      "contact.instagram.preHint",
      "contact.instagram.copiedHint",
      "contact.instagram.copiedToast",
      "contact.instagram.copyFailed",
    ];
    for (const key of required) {
      expect(flatPt[key], key).toBeTruthy();
      expect(flatEn[key], key).toBeTruthy();
    }
  });

  it("covers the admin search placeholder and the single variant label", () => {
    for (const key of ["admin.products.searchPlaceholder", "product.sizeSingle"]) {
      expect(flatPt[key], key).toBeTruthy();
      expect(flatEn[key], key).toBeTruthy();
    }
  });

  it("maps every api error code and status to existing keys", () => {
    for (const key of [...Object.values(ERROR_CODE_KEYS), ...Object.values(ERROR_STATUS_KEYS)]) {
      expect(flatPt[key], key).toBeTruthy();
      expect(flatEn[key], key).toBeTruthy();
    }
  });

  it("has no em dash in source files", () => {
    const offenders = sourceFiles(SRC).filter((file) => readFileSync(file, "utf8").includes(EM_DASH));
    expect(offenders).toEqual([]);
  });
});
