export const ROUTE_NAMES = {
  home: "home",
  catalog: "catalog",
  product: "product",
  contact: "product-contact",
  login: "admin-login",
  adminProducts: "admin-products",
  adminProductNew: "admin-product-new",
  adminProductEdit: "admin-product-edit",
  adminCategories: "admin-categories",
  adminSettings: "admin-settings",
  notFound: "not-found",
} as const;

export const ROUTE_PATHS = {
  home: "/",
  catalog: "/catalogo",
  product: "/produto/:slug",
  contact: "/produto/:slug/contato",
  admin: "/admin",
  login: "/admin/login",
  adminProducts: "/admin/produtos",
  adminProductNew: "/admin/produtos/novo",
  adminProductEdit: "/admin/produtos/:id",
  adminCategories: "/admin/categorias",
  adminSettings: "/admin/configuracoes",
} as const;
