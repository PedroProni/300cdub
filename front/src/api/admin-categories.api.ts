import { request } from "@/api/http";
import { ENDPOINTS } from "@/api/endpoints.constants";
import type { Category } from "@/types/category.types";

const base = ENDPOINTS.adminCategories;

export const adminCategoriesApi = {
  list: () => request<Category[]>(base),
  create: (name: string) => request<Category>(base, { method: "POST", body: { name } }),
  update: (id: string, name: string) => request<Category>(`${base}/${id}`, { method: "PUT", body: { name } }),
  remove: (id: string) => request<void>(`${base}/${id}`, { method: "DELETE" }),
  reorder: (ids: string[]) => request<void>(ENDPOINTS.adminCategoriesReorder, { method: "PUT", body: { ids } }),
};
