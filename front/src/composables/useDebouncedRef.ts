import { ref, watch, type Ref } from "vue";
import { SEARCH_DEBOUNCE_MS } from "@/composables/useDebouncedRef.constants";

export function useDebouncedRef<T>(source: Ref<T>, delay: number = SEARCH_DEBOUNCE_MS): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;
  watch(source, (value) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = value;
    }, delay);
  });
  return debounced;
}
