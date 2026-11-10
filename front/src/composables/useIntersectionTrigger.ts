import { onBeforeUnmount, onMounted, type Ref } from "vue";

export function useIntersectionTrigger(target: Ref<HTMLElement | null>, onVisible: () => void, rootMargin: string): void {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (typeof IntersectionObserver === "undefined" || !target.value) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onVisible();
      },
      { rootMargin },
    );
    observer.observe(target.value);
  });

  onBeforeUnmount(() => observer?.disconnect());
}
