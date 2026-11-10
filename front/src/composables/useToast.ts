import { ref } from "vue";
import { TOAST_DURATION_MS } from "@/composables/useToast.constants";
import type { Toast, ToastKind } from "@/types/toast.types";

const toasts = ref<Toast[]>([]);
let nextId = 1;

function dismiss(id: number): void {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function push(kind: ToastKind, message: string): void {
  const id = nextId++;
  toasts.value = [...toasts.value, { id, kind, message }];
  setTimeout(() => dismiss(id), TOAST_DURATION_MS);
}

export function useToast() {
  return {
    toasts,
    dismiss,
    success: (message: string) => push("success", message),
    error: (message: string) => push("error", message),
    info: (message: string) => push("info", message),
  };
}
