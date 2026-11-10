import { onBeforeUnmount, onMounted, type Ref } from "vue";
import Sortable from "sortablejs";
import { SORTABLE_HANDLE_SELECTOR } from "@/composables/useSortable.constants";

export function useSortable(container: Ref<HTMLElement | null>, onMove: (from: number, to: number) => void): void {
  let instance: Sortable | null = null;
  onMounted(() => {
    if (!container.value) return;
    instance = Sortable.create(container.value, {
      handle: SORTABLE_HANDLE_SELECTOR,
      animation: 150,
      onEnd: (event) => {
        if (event.oldIndex === undefined || event.newIndex === undefined || event.oldIndex === event.newIndex) return;
        event.from.removeChild(event.item);
        event.from.insertBefore(event.item, event.from.children[event.oldIndex] ?? null);
        onMove(event.oldIndex, event.newIndex);
      },
    });
  });
  onBeforeUnmount(() => instance?.destroy());
}
