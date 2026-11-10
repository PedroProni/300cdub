import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "@vue/compiler-sfc";

const SRC = join(__dirname, "..");
const TEXT_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt", "label"];
const NODE_ELEMENT = 1;
const NODE_TEXT = 2;
const PROP_ATTRIBUTE = 6;

interface AstNode {
  type: number;
  content?: string;
  children?: AstNode[];
  props?: { type: number; name: string; value?: { content: string } }[];
}

function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return vueFiles(full);
    return name.endsWith(".vue") ? [full] : [];
  });
}

function offenders(node: AstNode, file: string, out: string[]): void {
  if (node.type === NODE_TEXT && /\p{L}/u.test(node.content ?? "")) out.push(`${file}: text "${node.content?.trim()}"`);
  if (node.type === NODE_ELEMENT) {
    for (const prop of node.props ?? []) {
      if (prop.type === PROP_ATTRIBUTE && TEXT_ATTRIBUTES.includes(prop.name) && /\p{L}/u.test(prop.value?.content ?? ""))
        out.push(`${file}: ${prop.name}="${prop.value?.content}"`);
    }
  }
  for (const child of node.children ?? []) offenders(child, file, out);
}

describe("hardcoded visible text", () => {
  it("has none in any template", () => {
    const found: string[] = [];
    for (const file of vueFiles(SRC)) {
      const { descriptor } = parse(readFileSync(file, "utf8"));
      if (descriptor.template?.ast) offenders(descriptor.template.ast as unknown as AstNode, file.replace(SRC, "src"), found);
    }
    expect(found).toEqual([]);
  });
});
