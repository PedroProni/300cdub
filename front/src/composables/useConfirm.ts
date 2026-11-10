import { reactive } from "vue";
import type { ConfirmRequest, ConfirmState } from "@/composables/useConfirm.types";

const state = reactive<ConfirmState>({ open: false, title: "", message: "", confirmLabel: "", resolver: null });

function settle(result: boolean): void {
  state.resolver?.(result);
  state.resolver = null;
  state.open = false;
}

export function useConfirm() {
  function confirm(request: ConfirmRequest): Promise<boolean> {
    return new Promise((resolve) => {
      state.title = request.title;
      state.message = request.message;
      state.confirmLabel = request.confirmLabel;
      state.resolver = resolve;
      state.open = true;
    });
  }
  return { state, confirm, accept: () => settle(true), cancel: () => settle(false) };
}
