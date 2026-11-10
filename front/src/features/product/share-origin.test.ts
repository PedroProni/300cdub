import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactView from "@/features/product/ContactView.vue";
import ProductPurchase from "@/features/product/ProductPurchase.vue";
import { publicApi } from "@/api/public.api";
import { makeProduct, mountWithApp } from "@/test/mount";

vi.mock("@/api/public.api", () => ({ publicApi: { product: vi.fn(), settings: vi.fn(), categories: vi.fn(), products: vi.fn() } }));
vi.mock("@/config/env.constants", async (importOriginal) => ({ ...(await importOriginal<object>()), API_PUBLIC_ORIGIN: "https://demo.example.com/" }));

const settings = { instagramHandle: "@300c.dub", whatsappNumber: "+55 (11) 99999-0000", messageTemplate: "unused" };
const RAW_SLUG = "camiseta é/ão 1";
const EXPECTED_LINK = `https://demo.example.com/p/${encodeURIComponent(RAW_SLUG)}`;

beforeEach(() => {
  setActivePinia(createPinia());
  vi.stubGlobal("location", new URL("http://192.168.0.9:5999/produto/x/contato"));
  vi.mocked(publicApi.product)
    .mockReset()
    .mockResolvedValue(makeProduct({ slug: RAW_SLUG }));
  vi.mocked(publicApi.settings).mockReset().mockResolvedValue(settings);
});

afterEach(() => vi.unstubAllGlobals());

async function mountContact() {
  const result = mountWithApp(ContactView, { props: { slug: RAW_SLUG } });
  await result.router.push("/produto/x/contato?size=M");
  await flushPromises();
  return result;
}

describe("public share link origin", () => {
  it("prefills the contact message with the public origin and the encoded slug, not the request host", async () => {
    const { wrapper } = await mountContact();
    const value = (wrapper.get("textarea").element as HTMLTextAreaElement).value;
    expect(value).toContain(EXPECTED_LINK);
    expect(value).not.toContain("192.168.0.9");
    expect(value).not.toContain("5999");
    expect(value).not.toContain("localhost");
  });

  it("puts the same link in the whatsapp url", async () => {
    const { wrapper } = await mountContact();
    const href = wrapper.get('[data-testid="whatsapp"]').attributes("href") ?? "";
    const text = decodeURIComponent(href.split("?text=")[1]);
    expect(text).toContain(EXPECTED_LINK);
    expect(text).not.toContain("192.168.0.9");
  });

  it("copies the message with the public link before opening instagram", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    vi.spyOn(window, "open").mockReturnValue(null);
    const { wrapper } = await mountContact();
    await wrapper.get('[data-testid="instagram"]').trigger("click");
    await flushPromises();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain(EXPECTED_LINK);
    expect(writeText.mock.calls[0][0]).not.toContain("192.168.0.9");
  });

  it("shares the public link from the product page share button", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share });
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product: makeProduct({ slug: RAW_SLUG }) } });
    await wrapper.get('[data-testid="share"]').trigger("click");
    await flushPromises();
    expect(share).toHaveBeenCalledWith({ title: "Camiseta 300C", url: EXPECTED_LINK });
  });

  it("copies the public link when the native share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share: undefined, clipboard: { writeText } });
    const { wrapper } = mountWithApp(ProductPurchase, { props: { product: makeProduct({ slug: RAW_SLUG }) } });
    await wrapper.get('[data-testid="share"]').trigger("click");
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith(EXPECTED_LINK);
  });
});
