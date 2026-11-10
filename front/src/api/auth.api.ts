import { request } from "@/api/http";
import { ENDPOINTS } from "@/api/endpoints.constants";
import type { AuthUser, ChangePasswordInput, LoginInput } from "@/types/auth.types";

export const authApi = {
  login: (input: LoginInput) => request<{ user: AuthUser }>(ENDPOINTS.login, { method: "POST", body: input }),
  logout: () => request<void>(ENDPOINTS.logout, { method: "POST" }),
  me: () => request<{ user: AuthUser }>(ENDPOINTS.me),
  changePassword: (input: ChangePasswordInput) => request<void>(ENDPOINTS.password, { method: "PUT", body: input }),
};
