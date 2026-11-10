import { describe, expect, it } from "vitest";
import ProductGallery from "@/features/product/ProductGallery.vue";
import { mountWithApp } from "@/test/mount";

function image(id: string) {
  return { id, isCover: false, urls: { thumb: `http://i/${id}t`, medium: `http://i/${id}m`, large: `http://i/${id}l` } };
}

describe("ProductGallery", () => {
  it("renders only the capped image for a single photo, with no thumbnails or counter", () => {
    const { wrapper } = mountWithApp(ProductGallery, { props: { images: [image("a")], alt: "Camiseta" } });
    expect(wrapper.findAll('[data-testid="gallery-slide"]').length).toBe(1);
    expect(wrapper.findAll("button").length).toBe(0);
    expect(wrapper.find('[data-testid="gallery-counter"]').exists()).toBe(false);
    expect(wrapper.html()).toContain("max-h-[70vh]");
    expect(wrapper.get("img").classes()).toContain("object-cover");
  });

  it("renders a thumbnail per photo, a swipe track with snap slides and the counter for several photos", () => {
    const { wrapper } = mountWithApp(ProductGallery, { props: { images: [image("a"), image("b"), image("c")], alt: "Camiseta" } });
    expect(wrapper.get('[data-testid="gallery-track"]').classes()).toContain("gallery-track");
    expect(wrapper.findAll('[data-testid="gallery-slide"]').length).toBe(3);
    expect(wrapper.findAll("button[aria-current]").length).toBe(3);
    expect(wrapper.get('[data-testid="gallery-counter"]').text()).toBe("1 / 3");
  });
});
