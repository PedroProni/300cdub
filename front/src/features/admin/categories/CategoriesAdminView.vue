<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Check, GripVertical, Pencil, Trash2, X } from "lucide-vue-next";
import BaseButton from "@/components/ui/BaseButton.vue";
import SkeletonList from "@/components/ui/SkeletonList.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { useCategoriesAdminStore } from "@/features/admin/categories/categories-admin.store";
import { useApiError } from "@/composables/useApiError";
import { useConfirm } from "@/composables/useConfirm";
import { useHead } from "@/composables/useHead";
import { useSortable } from "@/composables/useSortable";
import { useToast } from "@/composables/useToast";
import type { Category } from "@/types/category.types";

const { t } = useI18n();
const store = useCategoriesAdminStore();
const toast = useToast();
const { confirm } = useConfirm();
const { messageFor } = useApiError();
const list = ref<HTMLElement | null>(null);
const name = ref("");
const nameError = ref("");
const editingId = ref<string | null>(null);
const editingName = ref("");
const busy = ref(false);

useHead({ title: () => `${t("nav.categories")} | ${t("brand.name")}` });

async function guarded(action: () => Promise<void>, successKey: string): Promise<boolean> {
  busy.value = true;
  try {
    await action();
    toast.success(t(successKey));
    return true;
  } catch (error) {
    toast.error(messageFor(error));
    return false;
  } finally {
    busy.value = false;
  }
}

useSortable(list, (from, to) => {
  guarded(() => store.move(from, to), "admin.categories.reordered");
});

async function add(): Promise<void> {
  nameError.value = name.value.trim().length < 2 ? t("admin.categories.nameError") : "";
  if (nameError.value) return;
  if (await guarded(() => store.create(name.value.trim()), "admin.categories.created")) name.value = "";
}

function startEdit(category: Category): void {
  editingId.value = category.id;
  editingName.value = category.name;
}

async function saveEdit(category: Category): Promise<void> {
  if (editingName.value.trim().length < 2) {
    toast.error(t("admin.categories.nameError"));
    return;
  }
  if (await guarded(() => store.rename(category.id, editingName.value.trim()), "admin.categories.saved")) editingId.value = null;
}

async function remove(category: Category): Promise<void> {
  const accepted = await confirm({
    title: t("admin.categories.deleteTitle"),
    message: t("admin.categories.deleteMessage", { name: category.name }),
    confirmLabel: t("common.delete"),
  });
  if (accepted) await guarded(() => store.remove(category.id), "admin.categories.deleted");
}

onMounted(async () => {
  try {
    await store.load();
  } catch (error) {
    toast.error(messageFor(error));
  }
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <h1 class="font-display-tight text-2xl font-bold text-steel">{{ t("nav.categories") }}</h1>
    <form class="metal-card flex flex-wrap items-end gap-3 rounded-xl p-4" novalidate @submit.prevent="add">
      <div class="min-w-48 flex-1"><BaseInput v-model="name" :label="t('admin.categories.newLabel')" :error="nameError" /></div>
      <BaseButton type="submit" :loading="busy">{{ t("admin.categories.add") }}</BaseButton>
    </form>
    <SkeletonList v-if="store.loading" :count="3" />
    <EmptyState v-else-if="store.items.length === 0" :title="t('admin.categories.empty.title')" :description="t('admin.categories.empty.description')" />
    <ul ref="list" class="flex flex-col gap-2">
      <li v-for="category in store.items" :key="category.id" class="metal-card flex items-center gap-2 rounded-xl p-2" data-testid="category-row">
        <button type="button" data-drag-handle class="flex size-10 cursor-grab items-center justify-center text-muted hover:text-steel" :aria-label="t('common.dragToReorder')">
          <GripVertical class="size-5" aria-hidden="true" />
        </button>
        <template v-if="editingId === category.id">
          <input
            v-model="editingName"
            type="text"
            :aria-label="t('admin.categories.newLabel')"
            class="min-h-11 min-w-0 flex-1 rounded-md border border-edge bg-ink px-3 text-base text-steel"
            @keydown.enter.prevent="saveEdit(category)"
          />
          <button type="button" class="flex size-11 items-center justify-center rounded-md text-accent hover:bg-raised" :aria-label="t('common.save')" @click="saveEdit(category)">
            <Check class="size-5" aria-hidden="true" />
          </button>
          <button type="button" class="flex size-11 items-center justify-center rounded-md text-muted hover:bg-raised" :aria-label="t('common.cancel')" @click="editingId = null">
            <X class="size-5" aria-hidden="true" />
          </button>
        </template>
        <template v-else>
          <span class="min-w-0 flex-1 truncate px-2 font-semibold text-steel">{{ category.name }}</span>
          <button type="button" class="flex size-11 items-center justify-center rounded-md text-steel hover:bg-raised" :aria-label="t('common.edit')" @click="startEdit(category)">
            <Pencil class="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="flex size-11 items-center justify-center rounded-md text-danger hover:bg-danger/15"
            :aria-label="t('common.delete')"
            @click="remove(category)"
          >
            <Trash2 class="size-5" aria-hidden="true" />
          </button>
        </template>
      </li>
    </ul>
  </div>
</template>
