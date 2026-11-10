import { describe, expect, it } from "vitest";
import pt from "@/i18n/messages/pt.json";
import { PT_FORBIDDEN_ENGLISH_WORDS, PT_FORBIDDEN_WORDS } from "@/i18n/i18n-typos.constants";
import { findForbiddenWords, flattenMessages } from "@/i18n/i18n-typos";

const flatPt = flattenMessages(pt);

describe("pt.json typos and accents", () => {
  it("has no truncated or unaccented common words", () => {
    expect(findForbiddenWords(flatPt, PT_FORBIDDEN_WORDS)).toEqual([]);
  });

  it("has no english-only words", () => {
    expect(findForbiddenWords(flatPt, PT_FORBIDDEN_ENGLISH_WORDS)).toEqual([]);
  });

  it("matches whole words only, ignoring case", () => {
    const sample = { a: "VELOCIDAD total", b: "Velocidade", c: "Potência", d: "a potencia", e: "ate logo", f: "até logo", g: "the end", h: "other" };
    expect(findForbiddenWords(sample, PT_FORBIDDEN_WORDS).map((line) => line.split(":")[0])).toEqual(["a", "d", "e"]);
    expect(findForbiddenWords(sample, PT_FORBIDDEN_ENGLISH_WORDS).map((line) => line.split(":")[0])).toEqual(["g"]);
  });
});
