import { mount, type ComponentMountingOptions } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { createI18n } from "vue-i18n";
import type { Component } from "vue";
import pt from "@/i18n/messages/pt.json";
import en from "@/i18n/messages/en.json";
import { ROUTE_NAMES, ROUTE_PATHS } from "@/router/routes.constants";
import type { AppLocale } from "@/i18n/i18n.types";
import type { Product } from "@/types/product.types";

const Stub: Component = { template: "<div />" };

export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: ROUTE_PATHS.home, name: ROUTE_NAMES.home, component: Stub },
      { path: ROUTE_PATHS.catalog, name: ROUTE_NAMES.catalog, component: Stub },
      { path: ROUTE_PATHS.product, name: ROUTE_NAMES.product, component: Stub },
      { path: ROUTE_PATHS.contact, name: ROUTE_NAMES.contact, component: Stub },
      { path: ROUTE_PATHS.login, name: ROUTE_NAMES.login, component: Stub },
      { path: ROUTE_PATHS.adminProducts, name: ROUTE_NAMES.adminProducts, component: Stub },
    ],
  });
}

export function createTestI18n(locale: AppLocale = "pt") {
  return createI18n({ legacy: false, locale, fallbackLocale: "pt", messages: { pt, en } });
}

export function mountWithApp<T extends Component>(component: T, options: ComponentMountingOptions<T> & { locale?: AppLocale } = {}) {
  const { locale, global, ...rest } = options;
  const router = createTestRouter();
  const i18n = createTestI18n(locale);
  const wrapper = mount(component, {
    ...(rest as object),
    global: { ...global, plugins: [createPinia(), router, i18n, ...(global?.plugins ?? [])] },
  } as ComponentMountingOptions<T>);
  return { wrapper, router, i18n };
}

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p1",
    slug: "camiseta-300c",
    name: "Camiseta 300C",
    description: "Algodão premium",
    category: { id: "c1", slug: "camisetas", name: "Camisetas" },
    price: 100,
    promoPrice: null,
    images: [{ id: "i1", isCover: true, urls: { thumb: "http://img/t.webp", medium: "http://img/m.webp", large: "http://img/l.webp" } }],
    variants: [
      { id: "v1", label: "M", stock: 5 },
      { id: "v2", label: "G", stock: 0 },
    ],
    totalStock: 5,
    stockStatus: "in_stock",
    featured: false,
    visible: true,
    sortOrder: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
