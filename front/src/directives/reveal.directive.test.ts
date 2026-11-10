import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback = () => undefined;
const observe = vi.fn();
const unobserve = vi.fn();

describe("vReveal", () => {
  beforeEach(() => {
    vi.resetModules();
    observe.mockClear();
    unobserve.mockClear();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: Callback) {
          callback = cb;
        }
        observe = observe;
        unobserve = unobserve;
      },
    );
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => vi.unstubAllGlobals());

  it("hides the element until it intersects, then reveals it once", async () => {
    const { vReveal: directive } = await import("@/directives/reveal.directive");
    const element = document.createElement("div");
    directive.mounted?.(element, { value: 2 } as never, null as never, null as never);
    expect(element.dataset.reveal).toBe("pending");
    expect(element.style.transitionDelay).toBe("140ms");
    expect(observe).toHaveBeenCalledWith(element);
    callback([{ target: element, isIntersecting: false }]);
    expect(element.dataset.reveal).toBe("pending");
    callback([{ target: element, isIntersecting: true }]);
    expect(element.dataset.reveal).toBe("shown");
    expect(unobserve).toHaveBeenCalledWith(element);
  });

  it("caps the stagger delay", async () => {
    const { vReveal: directive } = await import("@/directives/reveal.directive");
    const element = document.createElement("div");
    directive.mounted?.(element, { value: 50 } as never, null as never, null as never);
    expect(element.style.transitionDelay).toBe("420ms");
  });

  it("leaves the element visible when reduced motion is requested", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const { vReveal: directive } = await import("@/directives/reveal.directive");
    const element = document.createElement("div");
    directive.mounted?.(element, { value: 0 } as never, null as never, null as never);
    expect(element.dataset.reveal).toBeUndefined();
    expect(observe).not.toHaveBeenCalled();
  });

  it("leaves the element visible without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { vReveal: directive } = await import("@/directives/reveal.directive");
    const element = document.createElement("div");
    directive.mounted?.(element, { value: 0 } as never, null as never, null as never);
    expect(element.dataset.reveal).toBeUndefined();
  });
});
