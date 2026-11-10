import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/assets/main.css"), "utf8");
const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));

describe("motion rules", () => {
  it("has a reduced motion block that disables shimmer, pop, lift and smooth scroll", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(reduced).toMatch(/\.skeleton::after[\s\S]*animation: none/);
    expect(reduced).toMatch(/\.press:hover[\s\S]*transform: none/);
    expect(reduced).toMatch(/\.page-enter-from[\s\S]*transform: none/);
    expect(reduced).toMatch(/\.gallery-track[\s\S]*scroll-behavior: auto/);
  });

  it("animates only transform and opacity in keyframes", () => {
    const frames = [...css.matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n\}/g)].map((match) => match[1]);
    expect(frames.length).toBeGreaterThan(0);
    for (const body of frames) {
      const properties = [...body.matchAll(/([a-z-]+):/g)].map((match) => match[1]);
      expect(properties.every((name) => name === "transform" || name === "opacity")).toBe(true);
    }
  });
});
