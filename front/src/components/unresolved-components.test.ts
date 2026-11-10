import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "@vue/compiler-sfc";

const SRC = join(__dirname, "..");
const BUILT_IN = new Set(["Transition", "TransitionGroup", "KeepAlive", "Teleport", "Suspense", "Component", "RouterView"]);
const NODE_ELEMENT = 1;

interface AstNode {
  type: number;
  tag?: string;
  children?: AstNode[];
}

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return vueFiles(full);
    return name.endsWith(".vue") ? [full] : [];
  });
}

function tags(node: AstNode, out: Set<string>): void {
  if (node.type === NODE_ELEMENT && node.tag && /^[A-Z]/.test(node.tag)) out.add(node.tag);
  for (const child of node.children ?? []) tags(child, out);
}

describe("component resolution", () => {
  it("imports every component used in a template", () => {
    const missing: string[] = [];
    for (const file of vueFiles(SRC)) {
      const { descriptor } = parse(readFileSync(file, "utf8"));
      const used = new Set<string>();
      if (descriptor.template?.ast) tags(descriptor.template.ast as unknown as AstNode, used);
      const script = descriptor.scriptSetup?.content ?? "";
      for (const tag of used) {
        if (BUILT_IN.has(tag)) continue;
        if (!new RegExp(`\\b${tag}\\b`).test(script)) missing.push(`${file}: ${tag}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
