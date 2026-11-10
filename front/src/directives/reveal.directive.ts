import type { ObjectDirective } from "vue";
import { REDUCED_MOTION_QUERY, REVEAL_ROOT_MARGIN, REVEAL_STAGGER_MAX_STEPS, REVEAL_STAGGER_STEP_MS, REVEAL_THRESHOLD } from "@/directives/reveal.constants";

let observer: IntersectionObserver | null = null;

function canReveal(): boolean {
  if (typeof IntersectionObserver === "undefined") return false;
  if (typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;
  return true;
}

function sharedObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        target.dataset.reveal = "shown";
        observer?.unobserve(target);
      }
    },
    { rootMargin: REVEAL_ROOT_MARGIN, threshold: REVEAL_THRESHOLD },
  );
  return observer;
}

export const vReveal: ObjectDirective<HTMLElement, number | undefined> = {
  mounted(element, binding) {
    if (!canReveal()) return;
    const step = Math.min(binding.value ?? 0, REVEAL_STAGGER_MAX_STEPS);
    element.style.transitionDelay = `${step * REVEAL_STAGGER_STEP_MS}ms`;
    element.dataset.reveal = "pending";
    sharedObserver().observe(element);
  },
  beforeUnmount(element) {
    observer?.unobserve(element);
  },
};
