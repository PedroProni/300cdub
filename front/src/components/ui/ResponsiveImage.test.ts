import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";

const urls = { thumb: "http://img/t.webp", medium: "http://img/m.webp", large: "http://img/l.webp" };

describe("ResponsiveImage", () => {
  it("builds the srcset from the three variants with sizes, dimensions and lazy decoding", () => {
    const wrapper = mount(ResponsiveImage, { props: { urls, alt: "Foto", sizes: "50vw" } });
    const img = wrapper.get("img");
    expect(img.attributes("srcset")).toBe("http://img/t.webp 240w, http://img/m.webp 720w, http://img/l.webp 1600w");
    expect(img.attributes("sizes")).toBe("50vw");
    expect(img.attributes("src")).toBe("http://img/m.webp");
    expect(img.attributes("width")).toBe("720");
    expect(img.attributes("height")).toBe("720");
    expect(img.attributes("loading")).toBe("lazy");
    expect(img.attributes("decoding")).toBe("async");
    expect(img.attributes("fetchpriority")).toBe("auto");
  });

  it("loads eagerly with high priority and the large fallback when asked", () => {
    const wrapper = mount(ResponsiveImage, { props: { urls, alt: "Foto", sizes: "100vw", eager: true, priority: true, fallbackSrc: "large" } });
    const img = wrapper.get("img");
    expect(img.attributes("loading")).toBe("eager");
    expect(img.attributes("fetchpriority")).toBe("high");
    expect(img.attributes("src")).toBe("http://img/l.webp");
    expect(img.attributes("width")).toBe("1600");
  });

  it("starts transparent and fades in once the image has loaded", async () => {
    const wrapper = mount(ResponsiveImage, { props: { urls, alt: "Foto", sizes: "50vw" } });
    expect(wrapper.get("img").attributes("data-loaded")).toBe("false");
    await wrapper.get("img").trigger("load");
    expect(wrapper.get("img").attributes("data-loaded")).toBe("true");
  });
});
