import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductView from "@/features/product/ProductView.vue";
import { publicApi } from "@/api/public.api";
import { makeProduct, mountWithApp } from "@/test/mount";
import type { Product } from "@/types/product.types";

vi.mock("@/api/public.api", () => ({ publicApi: { product: vi.fn(), settings: vi.fn(), categories: vi.fn(), products: vi.fn() } }));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(publicApi.product).mockReset();
  vi.mocked(publicApi.settings).mockReset().mockResolvedValue({ instagramHandle: "", whatsappNumber: "", messageTemplate: "" });
});

describe("ProductView", () => {
  it("shows the product skeleton and then the gallery with a responsive first image", async () => {
    let release: (value: Product) => void = () => undefined;
    vi.mocked(publicApi.product).mockReturnValue(new Promise((resolve) => (release = resolve)));
    const { wrapper } = mountWithApp(ProductView, { props: { slug: "camiseta-300c" } });
    expect(wrapper.find('[data-testid="product-skeleton"]').exists()).toBe(true);
    expect(wrapper.find("h1").exists()).toBe(false);
    release(makeProduct());
    await flushPromises();
    expect(wrapper.find('[data-testid="product-skeleton"]').exists()).toBe(false);
    expect(wrapper.get("h1").text()).toBe("Camiseta 300C");
    const img = wrapper.get('[data-testid="gallery-slide"] img');
    expect(img.attributes("srcset")).toContain("1600w");
    expect(img.attributes("loading")).toBe("eager");
    expect(img.attributes("fetchpriority")).toBe("high");
  });

  it("keeps the info column sticky on desktop and shows the gallery counter with several images", async () => {
    const images = ["a", "b"].map((id) => ({ id, isCover: id === "a", urls: { thumb: `http://i/${id}t`, medium: `http://i/${id}m`, large: `http://i/${id}l` } }));
    vi.mocked(publicApi.product).mockResolvedValue(makeProduct({ images }));
    const { wrapper } = mountWithApp(ProductView, { props: { slug: "camiseta-300c" } });
    await flushPromises();
    expect(wrapper.get('[data-testid="product-info"]').classes()).toEqual(expect.arrayContaining(["lg:sticky", "lg:self-start"]));
    expect(wrapper.get('[data-testid="gallery-counter"]').text()).toBe("1 / 2");
  });

  it("renders every slide, loads only the first image eagerly and the rest after it loads", async () => {
    const images = ["a", "b", "c"].map((id) => ({ id, isCover: id === "a", urls: { thumb: `http://i/${id}t`, medium: `http://i/${id}m`, large: `http://i/${id}l` } }));
    vi.mocked(publicApi.product).mockResolvedValue(makeProduct({ images }));
    const { wrapper } = mountWithApp(ProductView, { props: { slug: "camiseta-300c" } });
    await flushPromises();
    expect(wrapper.findAll('[data-testid="gallery-slide"]').length).toBe(3);
    expect(wrapper.findAll('[data-testid="gallery-slide"] img').map((img) => img.attributes("loading"))).toEqual(["eager"]);
    await wrapper.get('[data-testid="gallery-slide"] img').trigger("load");
    const slides = wrapper.findAll('[data-testid="gallery-slide"] img');
    expect(slides.map((img) => img.attributes("loading"))).toEqual(["eager", "lazy", "lazy"]);
    expect(wrapper.get('[data-testid="gallery-track"]').classes()).toContain("gallery-track");
  });
});
