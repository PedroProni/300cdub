import { defineStore } from "pinia";
import { ref } from "vue";
import { authApi } from "@/api/auth.api";
import { ApiError } from "@/api/api-error";
import type { AuthUser, ChangePasswordInput, LoginInput } from "@/types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const ready = ref(false);
  let pending: Promise<void> | null = null;

  async function loadSession(): Promise<void> {
    try {
      user.value = (await authApi.me()).user;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      user.value = null;
    } finally {
      ready.value = true;
    }
  }

  function ensureSession(): Promise<void> {
    if (ready.value) return Promise.resolve();
    pending ??= loadSession().finally(() => {
      pending = null;
    });
    return pending;
  }

  async function login(input: LoginInput): Promise<void> {
    user.value = (await authApi.login(input)).user;
    ready.value = true;
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      user.value = null;
    }
  }

  function clear(): void {
    user.value = null;
    ready.value = true;
  }

  function changePassword(input: ChangePasswordInput): Promise<void> {
    return authApi.changePassword(input);
  }

  return { user, ready, ensureSession, login, logout, clear, changePassword };
});
