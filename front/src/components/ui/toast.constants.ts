import type { ToastKind } from "@/types/toast.types";

export const TOAST_CLASSES: Record<ToastKind, string> = {
  success: "border-ok/50 bg-panel text-steel",
  error: "border-danger/60 bg-panel text-steel",
  info: "border-edge bg-panel text-steel",
};
