import { afterEach, describe, expect, it } from "vitest";
import { takeEarlyProduct } from "@/api/early-product";
import { makeProduct } from "@/test/mount";

afterEach(() => {
  window.__earlyProduct = undefined;
});

describe("takeEarlyProduct", () => {
  it("returns null without an early request or for another slug", async () => {
    expect(await takeEarlyProduct("a")).toBeNull();
    window.__earlyProduct = { slug: "b", promise: Promise.resolve(Response.json(makeProduct())) };
    expect(await takeEarlyProduct("a")).toBeNull();
    expect(window.__earlyProduct).toBeDefined();
  });

  it("consumes the early response once for the matching slug", async () => {
    window.__earlyProduct = { slug: "a", promise: Promise.resolve(Response.json(makeProduct({ slug: "a" }))) };
    expect((await takeEarlyProduct("a"))?.slug).toBe("a");
    expect(await takeEarlyProduct("a")).toBeNull();
  });

  it("falls back to null on a failed response or network error", async () => {
    window.__earlyProduct = { slug: "a", promise: Promise.resolve(new Response("{}", { status: 404 })) };
    expect(await takeEarlyProduct("a")).toBeNull();
    window.__earlyProduct = { slug: "a", promise: Promise.resolve(null) };
    expect(await takeEarlyProduct("a")).toBeNull();
  });
});
