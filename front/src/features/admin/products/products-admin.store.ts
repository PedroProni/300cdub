import { defineStore } from "pinia";
import { ref } from "vue";
import { adminProductsApi } from "@/api/admin-products.api";
import { moveItem } from "@/utils/reorder";
import { toProductInput } from "@/features/admin/products/product-form.mapper";
import type { Product, ProductInput } from "@/types/product.types";

export const useProductsAdminStore = defineStore("productsAdmin", () => {
  const items = ref<Product[]>([]);
  const loading = ref(true);

  async function load(): Promise<void> {
    loading.value = true;
    try {
      items.value = await adminProductsApi.list();
    } finally {
      loading.value = false;
    }
  }

  function loadOne(id: string): Promise<Product> {
    return adminProductsApi.get(id);
  }

  function replace(product: Product): void {
    items.value = items.value.map((item) => (item.id === product.id ? product : item));
  }

  async function create(input: ProductInput): Promise<Product> {
    const product = await adminProductsApi.create(input);
    items.value = [...items.value, product];
    return product;
  }

  async function update(id: string, input: ProductInput): Promise<Product> {
    const product = await adminProductsApi.update(id, input);
    replace(product);
    return product;
  }

  async function toggle(product: Product, field: "visible" | "featured"): Promise<void> {
    const input = { ...toProductInput(product), [field]: !product[field] };
    await update(product.id, input);
  }

  async function remove(id: string): Promise<void> {
    await adminProductsApi.remove(id);
    items.value = items.value.filter((item) => item.id !== id);
  }

  async function move(from: number, to: number): Promise<void> {
    const previous = items.value;
    items.value = moveItem(previous, from, to);
    try {
      await adminProductsApi.reorder(items.value.map((item) => item.id));
    } catch (error) {
      items.value = previous;
      throw error;
    }
  }

  async function uploadImage(id: string, file: File): Promise<Product> {
    const product = await adminProductsApi.uploadImage(id, file);
    replace(product);
    return product;
  }

  async function removeImage(id: string, imageId: string): Promise<Product> {
    const product = await adminProductsApi.removeImage(id, imageId);
    replace(product);
    return product;
  }

  async function moveImage(product: Product, from: number, to: number): Promise<Product> {
    const ids = moveItem(product.images, from, to).map((image) => image.id);
    const updated = await adminProductsApi.reorderImages(product.id, ids);
    replace(updated);
    return updated;
  }

  async function setCover(id: string, imageId: string): Promise<Product> {
    const product = await adminProductsApi.setCover(id, imageId);
    replace(product);
    return product;
  }

  return { items, loading, load, loadOne, create, update, toggle, remove, move, uploadImage, removeImage, moveImage, setCover };
});
