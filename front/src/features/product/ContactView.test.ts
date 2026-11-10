import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactView from "@/features/product/ContactView.vue";
import { publicApi } from "@/api/public.api";
import { makeProduct, mountWithApp } from "@/test/mount";
import type { AppLocale } from "@/i18n/i18n.types";

vi.mock("@/api/public.api", () => ({ publicApi: { product: vi.fn(), settings: vi.fn(), categories: vi.fn(), products: vi.fn() } }));

const settings = { instagramHandle: "@300c.dub", whatsappNumber: "+55 (11) 99999-0000", messageTemplate: "unused" };

async function mountContact(locale: AppLocale, size = "M") {
  vi.mocked(publicApi.product).mockResolvedValue(makeProduct());
  vi.mocked(publicApi.settings).mockResolvedValue(settings);
  const result = mountWithApp(ContactView, { props: { slug: "camiseta-300c" }, locale });
  await result.router.push(size ? `/produto/camiseta-300c/contato?size=${size}` : "/produto/camiseta-300c/contato");
  await flushPromises();
  return result;
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(publicApi.product).mockReset();
  vi.mocked(publicApi.settings).mockReset();
});

describe("ContactView", () => {
  it("shows the product summary with the chosen size", async () => {
    const { wrapper } = await mountContact("pt");
    const summary = wrapper.get('[data-testid="contact-summary"]').text();
    expect(summary).toContain("Camiseta 300C");
    expect(summary).toContain("Tamanho: M");
    expect(summary).toContain("100,00");
  });

  it("prefills the message in portuguese with product, size and the api share link", async () => {
    const { wrapper } = await mountContact("pt");
    const value = (wrapper.get("textarea").element as HTMLTextAreaElement).value;
    expect(value).toBe("Oi! Tenho interesse na peça Camiseta 300C (tamanho M). Link: http://localhost:57010/p/camiseta-300c");
  });

  it("prefills the message in english", async () => {
    const { wrapper } = await mountContact("en");
    const value = (wrapper.get("textarea").element as HTMLTextAreaElement).value;
    expect(value).toBe("Hi! I am interested in Camiseta 300C (size M). Link: http://localhost:57010/p/camiseta-300c");
  });

  it("omits the size when none was chosen", async () => {
    const { wrapper } = await mountContact("pt", "");
    const value = (wrapper.get("textarea").element as HTMLTextAreaElement).value;
    expect(value).toBe("Oi! Tenho interesse na peça Camiseta 300C. Link: http://localhost:57010/p/camiseta-300c");
  });

  it("builds the whatsapp link from the digits and the encoded message, following edits", async () => {
    const { wrapper } = await mountContact("pt");
    const initial = wrapper.get('[data-testid="whatsapp"]').attributes("href");
    expect(initial).toBe(
      `https://wa.me/5511999990000?text=${encodeURIComponent("Oi! Tenho interesse na peça Camiseta 300C (tamanho M). Link: http://localhost:57010/p/camiseta-300c")}`,
    );
    await wrapper.get("textarea").setValue("Teste & mais?");
    expect(wrapper.get('[data-testid="whatsapp"]').attributes("href")).toBe("https://wa.me/5511999990000?text=Teste%20%26%20mais%3F");
  });

  it("copies the message first, then opens the instagram dm, and shows the hint", async () => {
    const calls: string[] = [];
    const writeText = vi.fn().mockImplementation(() => {
      calls.push("copy");
      return Promise.resolve();
    });
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const open = vi.fn().mockImplementation(() => {
      calls.push("open");
      return null;
    });
    vi.stubGlobal("open", open);
    const { wrapper } = await mountContact("pt");
    expect(wrapper.find('[data-testid="copied-hint"]').exists()).toBe(false);
    await wrapper.get('[data-testid="instagram"]').trigger("click");
    await flushPromises();
    expect(calls).toEqual(["copy", "open"]);
    expect(writeText).toHaveBeenCalledWith("Oi! Tenho interesse na peça Camiseta 300C (tamanho M). Link: http://localhost:57010/p/camiseta-300c");
    expect(open).toHaveBeenCalledWith("https://ig.me/m/300c.dub", "_blank", "noopener,noreferrer");
    expect(wrapper.get('[data-testid="copied-hint"]').text()).toBe("Mensagem copiada! Cole na conversa do Instagram que acabou de abrir.");
  });

  it("does not show the copied hint when the clipboard fails", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    vi.stubGlobal("open", vi.fn());
    const { wrapper } = await mountContact("en");
    await wrapper.get('[data-testid="instagram"]').trigger("click");
    await flushPromises();
    expect(wrapper.find('[data-testid="copied-hint"]').exists()).toBe(false);
  });
});
