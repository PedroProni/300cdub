import { defineStore } from "pinia";
import { ref } from "vue";
import { adminCategoriesApi } from "@/api/admin-categories.api";
import { moveItem } from "@/utils/reorder";
import type { Category } from "@/types/category.types";

export const useCategoriesAdminStore = defineStore("categoriesAdmin", () => {
  const items = ref<Category[]>([]);
  const loading = ref(true);

  async function load(): Promise<void> {
    loading.value = true;
    try {
      items.value = await adminCategoriesApi.list();
    } finally {
      loading.value = false;
    }
  }

  async function create(name: string): Promise<void> {
    items.value = [...items.value, await adminCategoriesApi.create(name)];
  }

  async function rename(id: string, name: string): Promise<void> {
    const updated = await adminCategoriesApi.update(id, name);
    items.value = items.value.map((item) => (item.id === id ? updated : item));
  }

  async function remove(id: string): Promise<void> {
    await adminCategoriesApi.remove(id);
    items.value = items.value.filter((item) => item.id !== id);
  }

  async function move(from: number, to: number): Promise<void> {
    const previous = items.value;
    items.value = moveItem(previous, from, to);
    try {
      await adminCategoriesApi.reorder(items.value.map((item) => item.id));
    } catch (error) {
      items.value = previous;
      throw error;
    }
  }

  return { items, loading, load, create, rename, remove, move };
});
