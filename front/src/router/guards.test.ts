import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { authGuard } from "@/router/guards";
import { ROUTE_NAMES } from "@/router/routes.constants";
import { authApi } from "@/api/auth.api";
import { ApiError } from "@/api/api-error";

vi.mock("@/api/auth.api", () => ({ authApi: { me: vi.fn(), login: vi.fn(), logout: vi.fn(), changePassword: vi.fn() } }));

const Stub = { template: "<div />" };

function buildRouter() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: ROUTE_NAMES.home, component: Stub },
      { path: "/admin/login", name: ROUTE_NAMES.login, component: Stub },
      { path: "/admin", meta: { requiresAuth: true }, component: Stub, children: [{ path: "produtos", name: ROUTE_NAMES.adminProducts, component: Stub }] },
    ],
  });
  router.beforeEach(authGuard);
  return router;
}

beforeEach(() => {
  setActivePinia(createPinia());
  vi.mocked(authApi.me).mockReset();
});

describe("auth guard", () => {
  it("redirects anonymous visitors from /admin to the login with a redirect query", async () => {
    vi.mocked(authApi.me).mockRejectedValue(new ApiError(401, null, "no"));
    const router = buildRouter();
    await router.push("/admin/produtos");
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.login);
    expect(router.currentRoute.value.query.redirect).toBe("/admin/produtos");
  });

  it("lets an authenticated admin in and skips the login page", async () => {
    vi.mocked(authApi.me).mockResolvedValue({ user: { id: "1", email: "a@b.c" } });
    const router = buildRouter();
    await router.push("/admin/produtos");
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.adminProducts);
    await router.push("/admin/login");
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.adminProducts);
  });

  it("never calls the session endpoint for public routes", async () => {
    const router = buildRouter();
    await router.push("/");
    expect(authApi.me).not.toHaveBeenCalled();
  });
});
