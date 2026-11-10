import { defineStore } from "pinia";
import { ref } from "vue";
import { publicApi } from "@/api/public.api";
import { ApiError } from "@/api/api-error";
import type { Product } from "@/types/product.types";

export const useProductStore = defineStore("product", () => {
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const notFound = ref(false);
  const failed = ref(false);

  async function load(slug: string): Promise<void> {
    loading.value = true;
    notFound.value = false;
    failed.value = false;
    product.value = null;
    try {
      product.value = await publicApi.product(slug);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) notFound.value = true;
      else failed.value = true;
    } finally {
      loading.value = false;
    }
  }

  return { product, loading, notFound, failed, load };
});
