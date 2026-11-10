import { request } from "@/api/http";
import { ENDPOINTS } from "@/api/endpoints.constants";
import type { Product, ProductInput } from "@/types/product.types";

const base = ENDPOINTS.adminProducts;

export const adminProductsApi = {
  list: () => request<Product[]>(base),
  get: (id: string) => request<Product>(`${base}/${id}`),
  create: (input: ProductInput) => request<Product>(base, { method: "POST", body: input }),
  update: (id: string, input: ProductInput) => request<Product>(`${base}/${id}`, { method: "PUT", body: input }),
  remove: (id: string) => request<void>(`${base}/${id}`, { method: "DELETE" }),
  reorder: (ids: string[]) => request<void>(ENDPOINTS.adminProductsReorder, { method: "PUT", body: { ids } }),
  uploadImage: (id: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<Product>(`${base}/${id}/images`, { method: "POST", form });
  },
  removeImage: (id: string, imageId: string) => request<Product>(`${base}/${id}/images/${imageId}`, { method: "DELETE" }),
  reorderImages: (id: string, ids: string[]) => request<Product>(`${base}/${id}/images/order`, { method: "PUT", body: { ids } }),
  setCover: (id: string, imageId: string) => request<Product>(`${base}/${id}/images/${imageId}/cover`, { method: "PUT" }),
};
