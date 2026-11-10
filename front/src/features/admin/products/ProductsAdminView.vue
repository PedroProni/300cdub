<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import { GripVertical, Pencil, Trash2 } from "lucide-vue-next";
import BaseSwitch from "@/components/ui/BaseSwitch.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import PriceTag from "@/components/ui/PriceTag.vue";
import SkeletonList from "@/components/ui/SkeletonList.vue";
import StockBadge from "@/components/ui/StockBadge.vue";
import { useProductsAdminStore } from "@/features/admin/products/products-admin.store";
import { useApiError } from "@/composables/useApiError";
import { useConfirm } from "@/composables/useConfirm";
import { useHead } from "@/composables/useHead";
import { useSortable } from "@/composables/useSortable";
import { useToast } from "@/composables/useToast";
import { ROUTE_NAMES } from "@/router/routes.constants";
import type { Product } from "@/types/product.types";

const { t } = useI18n();
const store = useProductsAdminStore();
const toast = useToast();
const { confirm } = useConfirm();
const { messageFor } = useApiError();
const list = ref<HTMLElement | null>(null);
const query = ref("");
const loadError = ref(false);

useHead({ title: () => `${t("nav.products")} | ${t("brand.name")}` });

const filtering = computed(() => query.value.trim() !== "");
const visibleItems = computed(() => {
  const term = query.value.trim().toLowerCase();
  return term ? store.items.filter((item) => item.name.toLowerCase().includes(term)) : store.items;
});

async function guarded(action: () => Promise<void>, successKey?: string): Promise<void> {
  try {
    await action();
    if (successKey) toast.success(t(successKey));
  } catch (error) {
    toast.error(messageFor(error));
  }
}

useSortable(list, (from, to) => {
  if (!filtering.value) guarded(() => store.move(from, to), "admin.products.reordered");
});

async function remove(product: Product): Promise<void> {
  const accepted = await confirm({ title: t("admin.products.deleteTitle"), message: t("admin.products.deleteMessage", { name: product.name }), confirmLabel: t("common.delete") });
  if (accepted) await guarded(() => store.remove(product.id), "admin.products.deleted");
}

onMounted(async () => {
  try {
    await store.load();
  } catch (error) {
    loadError.value = true;
    toast.error(messageFor(error));
  }
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-steel">{{ t("nav.products") }}</h1>
      <RouterLink
        :to="{ name: ROUTE_NAMES.adminProductNew }"
        class="font-display-tight inline-flex min-h-11 items-center rounded-sm bg-accent-fill px-5 text-sm font-bold text-black hover:border-accent hover:bg-accent"
        >{{ t("admin.products.new") }}</RouterLink
      >
    </div>
    <div v-if="store.items.length > 0" class="flex flex-col gap-1.5">
      <label for="admin-product-search" class="micro-label">{{ t("admin.products.search") }}</label>
      <input id="admin-product-search" v-model="query" type="search" class="min-h-11 rounded-sm border border-edge bg-ink px-3 text-base text-steel" />
      <p v-if="filtering" class="text-xs text-muted">{{ t("admin.products.reorderDisabled") }}</p>
    </div>
    <SkeletonList v-if="store.loading" :count="5" />
    <EmptyState v-else-if="store.items.length === 0 && !loadError" :title="t('admin.products.empty.title')" :description="t('admin.products.empty.description')">
      <RouterLink
        :to="{ name: ROUTE_NAMES.adminProductNew }"
        class="font-display-tight inline-flex min-h-11 items-center rounded-sm bg-accent-fill px-5 text-sm font-bold text-black"
        >{{ t("admin.products.new") }}</RouterLink
      >
    </EmptyState>
    <p v-else-if="visibleItems.length === 0 && !loadError" class="text-sm text-muted">{{ t("admin.products.noResults") }}</p>
    <ul ref="list" class="flex flex-col gap-3">
      <li v-for="product in visibleItems" :key="product.id" class="metal-card flex flex-wrap items-center gap-3 rounded-sm p-3" data-testid="product-row">
        <button
          v-if="!filtering"
          type="button"
          data-drag-handle
          class="flex size-10 cursor-grab items-center justify-center text-muted hover:text-steel"
          :aria-label="t('common.dragToReorder')"
        >
          <GripVertical class="size-5" aria-hidden="true" />
        </button>
        <img v-if="product.images[0]" :src="product.images[0].urls.thumb" alt="" width="56" height="56" loading="lazy" decoding="async" class="size-14 rounded-sm object-cover" />
        <div v-else class="size-14 rounded-sm bg-raised" />
        <div class="min-w-0 flex-1">
          <p class="truncate font-semibold text-steel">{{ product.name }}</p>
          <div class="mt-1 flex flex-wrap items-center gap-2">
            <PriceTag :price="product.price" :promo-price="product.promoPrice" /><StockBadge :status="product.stockStatus" />
          </div>
        </div>
        <div class="flex w-full flex-wrap items-center gap-x-6 gap-y-1 border-t border-edge pt-3 xl:w-auto xl:border-t-0 xl:pt-0" data-testid="product-controls">
          <BaseSwitch
            :model-value="product.visible"
            :label="t('admin.products.visible')"
            @update:model-value="guarded(() => store.toggle(product, 'visible'), 'admin.products.saved')"
          />
          <BaseSwitch
            :model-value="product.featured"
            :label="t('admin.products.featured')"
            @update:model-value="guarded(() => store.toggle(product, 'featured'), 'admin.products.saved')"
          />
          <div class="ml-auto flex items-center gap-1 xl:ml-0">
            <RouterLink
              :to="{ name: ROUTE_NAMES.adminProductEdit, params: { id: product.id } }"
              class="flex size-11 items-center justify-center rounded-sm text-steel hover:bg-raised"
              :aria-label="t('common.edit')"
              ><Pencil class="size-5" aria-hidden="true"
            /></RouterLink>
            <button
              type="button"
              class="flex size-11 items-center justify-center rounded-sm text-danger hover:bg-danger/15"
              :aria-label="t('common.delete')"
              @click="remove(product)"
            >
              <Trash2 class="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
