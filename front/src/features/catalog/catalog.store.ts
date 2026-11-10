import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { publicApi } from "@/api/public.api";
import type { Category } from "@/types/category.types";
import type { Product, ProductQuery } from "@/types/product.types";

export const useCatalogStore = defineStore("catalog", () => {
  const items = ref<Product[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(0);
  const categories = ref<Category[]>([]);
  const featured = ref<Product[]>([]);
  const loading = ref(false);
  const failed = ref(false);
  const loadingMore = ref(false);
  const moreFailed = ref(false);
  let requestId = 0;
  const hasMore = computed(() => items.value.length < total.value);

  async function loadCategories(): Promise<void> {
    if (categories.value.length > 0) return;
    try {
      categories.value = await publicApi.categories();
    } catch {
      categories.value = [];
    }
  }

  async function search(query: ProductQuery): Promise<void> {
    const current = ++requestId;
    loading.value = true;
    failed.value = false;
    moreFailed.value = false;
    loadingMore.value = false;
    try {
      const result = await publicApi.products(query);
      if (current !== requestId) return;
      items.value = result.items;
      total.value = result.total;
      page.value = result.page;
      limit.value = result.limit;
    } catch {
      if (current !== requestId) return;
      failed.value = true;
      items.value = [];
      total.value = 0;
    } finally {
      if (current === requestId) loading.value = false;
    }
  }

  async function loadMore(query: ProductQuery): Promise<void> {
    if (loading.value || loadingMore.value || !hasMore.value) return;
    const current = requestId;
    loadingMore.value = true;
    moreFailed.value = false;
    try {
      const result = await publicApi.products({ ...query, page: page.value + 1 });
      if (current !== requestId) return;
      const known = new Set(items.value.map((item) => item.id));
      items.value = [...items.value, ...result.items.filter((item) => !known.has(item.id))];
      total.value = result.total;
      page.value = result.page;
    } catch {
      if (current === requestId) moreFailed.value = true;
    } finally {
      if (current === requestId) loadingMore.value = false;
    }
  }

  async function loadFeatured(max: number): Promise<void> {
    try {
      featured.value = (await publicApi.products({ featured: true, limit: max })).items;
    } catch {
      featured.value = [];
    }
  }

  return { items, total, page, limit, categories, featured, loading, failed, loadingMore, moreFailed, hasMore, loadCategories, search, loadMore, loadFeatured };
});
