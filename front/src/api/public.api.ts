import { request } from "@/api/http";
import { takeEarlyProduct } from "@/api/early-product";
import { ENDPOINTS } from "@/api/endpoints.constants";
import type { Product, ProductPage, ProductQuery } from "@/types/product.types";
import type { Category } from "@/types/category.types";
import type { SiteSettings } from "@/types/settings.types";

export const publicApi = {
  settings: () => request<SiteSettings>(ENDPOINTS.publicSettings),
  categories: () => request<Category[]>(ENDPOINTS.publicCategories),
  products: (query: ProductQuery) => request<ProductPage>(ENDPOINTS.publicProducts, { query: { ...query } }),
  product: async (slug: string) => (await takeEarlyProduct(slug)) ?? request<Product>(`${ENDPOINTS.publicProducts}/${encodeURIComponent(slug)}`),
};
