import { describe, expect, it } from "vitest";
import { cleanHandle, fillTemplate, instagramDmUrl, instagramProfileUrl, onlyDigits, shareUrl, whatsappUrl } from "@/utils/buy-link";

describe("buy-link", () => {
  it("fills product and size tokens everywhere they appear", () => {
    expect(fillTemplate("{product} / {size} / {product}", "Camiseta", "M")).toBe("Camiseta / M / Camiseta");
  });

  it("keeps only digits of the whatsapp number", () => {
    expect(onlyDigits("+55 (11) 99999-9999")).toBe("5511999999999");
  });

  it("builds an encoded wa.me link", () => {
    const url = whatsappUrl("+55 11 99999-9999", "Oi! Quero a peça & o tamanho M?");
    expect(url).toBe("https://wa.me/5511999999999?text=Oi!%20Quero%20a%20pe%C3%A7a%20%26%20o%20tamanho%20M%3F");
  });

  it("strips the at sign from instagram handles", () => {
    expect(cleanHandle(" @@300c.dub ")).toBe("300c.dub");
    expect(instagramDmUrl("@300c.dub")).toBe("https://ig.me/m/300c.dub");
    expect(instagramProfileUrl("@300c.dub")).toBe("https://www.instagram.com/300c.dub");
  });

  it("builds the api share url for crawlers", () => {
    expect(shareUrl("camiseta-300c")).toMatch(/\/p\/camiseta-300c$/);
  });
});
