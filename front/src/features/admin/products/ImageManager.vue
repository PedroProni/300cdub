<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { GripVertical, Star, Trash2 } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useProductsAdminStore } from "@/features/admin/products/products-admin.store";
import { validateImageFile } from "@/features/admin/products/image-validation";
import { IMAGE_ACCEPT } from "@/features/admin/products/products-admin.constants";
import { useApiError } from "@/composables/useApiError";
import { useConfirm } from "@/composables/useConfirm";
import { useSortable } from "@/composables/useSortable";
import { useToast } from "@/composables/useToast";
import type { ImageManagerProps } from "@/features/admin/products/products-admin.types";
import type { Product } from "@/types/product.types";

const props = defineProps<ImageManagerProps>();
const emit = defineEmits<{ updated: [product: Product] }>();
const { t } = useI18n();
const store = useProductsAdminStore();
const toast = useToast();
const { confirm } = useConfirm();
const { messageFor } = useApiError();
const list = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const busy = ref(false);

async function run(action: () => Promise<Product>, successKey?: string): Promise<void> {
  busy.value = true;
  try {
    emit("updated", await action());
    if (successKey) toast.success(t(successKey));
  } catch (error) {
    toast.error(messageFor(error));
  } finally {
    busy.value = false;
  }
}

useSortable(list, (from, to) => run(() => store.moveImage(props.product, from, to), "admin.images.reordered"));

async function onFiles(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  target.value = "";
  for (const file of files) {
    const invalid = validateImageFile(file);
    if (invalid) {
      toast.error(`${file.name}: ${t(invalid)}`);
      continue;
    }
    await run(() => store.uploadImage(props.product.id, file), "admin.images.uploaded");
  }
}

async function remove(imageId: string): Promise<void> {
  const accepted = await confirm({ title: t("admin.images.deleteTitle"), message: t("admin.images.deleteMessage"), confirmLabel: t("common.delete") });
  if (accepted) await run(() => store.removeImage(props.product.id, imageId), "admin.images.deleted");
}
</script>

<template>
  <section class="flex flex-col gap-3" :aria-label="t('admin.images.title')">
    <h2 class="font-display text-3xl font-bold uppercase leading-none text-steel">{{ t("admin.images.title") }}</h2>
    <p class="text-xs text-muted">{{ t("admin.images.help") }}</p>
    <ul ref="list" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <li v-for="image in props.product.images" :key="image.id" class="metal-card flex flex-col gap-2 rounded-sm p-2" data-testid="image-item">
        <div class="relative aspect-square overflow-hidden rounded-sm bg-raised">
          <img :src="image.urls.thumb" alt="" class="size-full object-cover" />
          <span v-if="image.isCover" class="absolute left-1 top-1 rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-black">{{ t("admin.images.cover") }}</span>
        </div>
        <div class="flex items-center justify-between gap-1">
          <button
            type="button"
            data-drag-handle
            class="flex size-10 cursor-grab items-center justify-center rounded text-muted hover:text-steel"
            :aria-label="t('common.dragToReorder')"
          >
            <GripVertical class="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded text-muted hover:text-accent disabled:opacity-40"
            :disabled="image.isCover || busy"
            :aria-label="t('admin.images.makeCover')"
            @click="run(() => store.setCover(props.product.id, image.id), 'admin.images.coverChanged')"
          >
            <Star class="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded text-danger hover:bg-danger/15"
            :disabled="busy"
            :aria-label="t('common.delete')"
            @click="remove(image.id)"
          >
            <Trash2 class="size-5" aria-hidden="true" />
          </button>
        </div>
      </li>
    </ul>
    <p v-if="props.product.images.length === 0" class="rounded-sm border border-dashed border-edge px-4 py-6 text-center text-sm text-muted">{{ t("admin.images.empty") }}</p>
    <input ref="input" type="file" class="sr-only" multiple :accept="IMAGE_ACCEPT" :aria-label="t('admin.images.upload')" data-testid="image-input" @change="onFiles" />
    <div>
      <BaseButton variant="secondary" :loading="busy" @click="input?.click()">{{ t("admin.images.upload") }}</BaseButton>
    </div>
  </section>
</template>
