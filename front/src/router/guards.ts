import type { NavigationGuardWithThis } from "vue-router";
import { useAuthStore } from "@/features/auth/auth.store";
import { ROUTE_NAMES } from "@/router/routes.constants";

export const authGuard: NavigationGuardWithThis<undefined> = async (to) => {
  const auth = useAuthStore();
  const needsAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (!needsAuth && to.name !== ROUTE_NAMES.login) return true;
  await auth.ensureSession();
  if (needsAuth && !auth.user) return { name: ROUTE_NAMES.login, query: { redirect: to.fullPath } };
  if (to.name === ROUTE_NAMES.login && auth.user) return { name: ROUTE_NAMES.adminProducts };
  return true;
};
