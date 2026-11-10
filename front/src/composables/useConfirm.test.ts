import { describe, expect, it } from "vitest";
import { useConfirm } from "@/composables/useConfirm";

describe("useConfirm", () => {
  it("resolves true on accept and false on cancel", async () => {
    const { confirm, accept, cancel, state } = useConfirm();
    const first = confirm({ title: "t", message: "m", confirmLabel: "ok" });
    expect(state.open).toBe(true);
    accept();
    await expect(first).resolves.toBe(true);
    expect(state.open).toBe(false);
    const second = confirm({ title: "t", message: "m", confirmLabel: "ok" });
    cancel();
    await expect(second).resolves.toBe(false);
  });
});
