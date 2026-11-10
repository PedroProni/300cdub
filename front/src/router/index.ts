import { createRouter, createWebHistory } from "vue-router";
import { ROUTE_NAMES, ROUTE_PATHS } from "@/router/routes.constants";
import { authGuard } from "@/router/guards";

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  routes: [
    {
      path: "/",
      component: () => import("@/components/layout/PublicLayout.vue"),
      children: [
        { path: "", name: ROUTE_NAMES.home, component: () => import("@/features/catalog/HomeView.vue") },
        { path: ROUTE_PATHS.catalog, name: ROUTE_NAMES.catalog, component: () => import("@/features/catalog/CatalogView.vue") },
        { path: ROUTE_PATHS.product, name: ROUTE_NAMES.product, component: () => import("@/features/product/ProductView.vue"), props: true },
        { path: ROUTE_PATHS.contact, name: ROUTE_NAMES.contact, component: () => import("@/features/product/ContactView.vue"), props: true },
      ],
    },
    { path: ROUTE_PATHS.login, name: ROUTE_NAMES.login, component: () => import("@/features/auth/LoginView.vue") },
    {
      path: ROUTE_PATHS.admin,
      component: () => import("@/components/layout/AdminLayout.vue"),
      meta: { requiresAuth: true },
      redirect: ROUTE_PATHS.adminProducts,
      children: [
        { path: "produtos", name: ROUTE_NAMES.adminProducts, component: () => import("@/features/admin/products/ProductsAdminView.vue") },
        { path: "produtos/novo", name: ROUTE_NAMES.adminProductNew, component: () => import("@/features/admin/products/ProductEditView.vue") },
        { path: "produtos/:id", name: ROUTE_NAMES.adminProductEdit, component: () => import("@/features/admin/products/ProductEditView.vue"), props: true },
        { path: "categorias", name: ROUTE_NAMES.adminCategories, component: () => import("@/features/admin/categories/CategoriesAdminView.vue") },
        { path: "configuracoes", name: ROUTE_NAMES.adminSettings, component: () => import("@/features/admin/settings/SettingsAdminView.vue") },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/components/layout/PublicLayout.vue"),
      children: [{ path: "", name: ROUTE_NAMES.notFound, component: () => import("@/features/catalog/NotFoundView.vue") }],
    },
  ],
});

router.beforeEach(authGuard);
