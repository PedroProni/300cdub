import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginView from "@/features/auth/LoginView.vue";
import { authApi } from "@/api/auth.api";
import { ApiError } from "@/api/api-error";
import { mountWithApp } from "@/test/mount";

vi.mock("@/api/auth.api", () => ({ authApi: { login: vi.fn(), me: vi.fn(), logout: vi.fn(), changePassword: vi.fn() } }));

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(authApi.login).mockReset();
});

describe("LoginView", () => {
  it("keeps submit disabled until both fields are filled", async () => {
    const { wrapper } = mountWithApp(LoginView);
    expect(wrapper.get('button[type="submit"]').attributes("disabled")).toBeDefined();
    await wrapper.get('input[type="email"]').setValue("dono@exemplo.com");
    await wrapper.get('input[type="password"]').setValue("segredo123");
    expect(wrapper.get('button[type="submit"]').attributes("disabled")).toBeUndefined();
  });

  it("shows the translated error for wrong credentials", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new ApiError(401, "invalid_credentials", "x"));
    const { wrapper } = mountWithApp(LoginView);
    await wrapper.get('input[type="email"]').setValue("dono@exemplo.com");
    await wrapper.get('input[type="password"]').setValue("errada");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toBe("E-mail ou senha incorretos.");
  });

  it("shows the throttle message on 429 in english", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new ApiError(429, null, "x"));
    const { wrapper } = mountWithApp(LoginView, { locale: "en" });
    await wrapper.get('input[type="email"]').setValue("a@b.c");
    await wrapper.get('input[type="password"]').setValue("x");
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toBe("Too many attempts. Wait a moment and try again.");
  });
});
