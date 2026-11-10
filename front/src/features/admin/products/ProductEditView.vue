<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import SkeletonForm from "@/components/ui/SkeletonForm.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseSwitch from "@/components/ui/BaseSwitch.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import ImageManager from "@/features/admin/products/ImageManager.vue";
import VariantsEditor from "@/features/admin/products/VariantsEditor.vue";
import { useCategoriesAdminStore } from "@/features/admin/categories/categories-admin.store";
import { useProductsAdminStore } from "@/features/admin/products/products-admin.store";
import { emptyProductForm, formToInput, toProductForm } from "@/features/admin/products/product-form.mapper";
import { hasErrors, validateProductInput } from "@/features/admin/products/product-form.validation";
import { useApiError } from "@/composables/useApiError";
import { useHead } from "@/composables/useHead";
import { useToast } from "@/composables/useToast";
import { ROUTE_NAMES } from "@/router/routes.constants";
import type { ProductEditProps, ProductFormErrors, ProductFormState } from "@/features/admin/products/products-admin.types";
import type { Product } from "@/types/product.types";

const props = defineProps<ProductEditProps>();
const { t } = useI18n();
const router = useRouter();
const products = useProductsAdminStore();
const categories = useCategoriesAdminStore();
const toast = useToast();
const { messageFor } = useApiError();
const form = ref<ProductFormState>(emptyProductForm());
const errors = ref<ProductFormErrors>({});
const product = ref<Product | null>(null);
const saving = ref(false);
const loading = ref(true);

const editing = computed(() => props.id !== undefined);
const categoryOptions = computed(() => [
  { value: "", label: t("admin.products.noCategory") },
  ...categories.items.map((category) => ({ value: category.id, label: category.name })),
]);
const translated = computed(() => ({
  name: errors.value.name ? t(errors.value.name) : "",
  price: errors.value.price ? t(errors.value.price) : "",
  promoPrice: errors.value.promoPrice ? t(errors.value.promoPrice) : "",
  variants: errors.value.variants ? t(errors.value.variants) : "",
}));

useHead({ title: () => `${editing.value ? t("admin.products.editTitle") : t("admin.products.newTitle")} | ${t("brand.name")}` });

onMounted(async () => {
  loading.value = true;
  try {
    await categories.load();
    if (props.id) {
      product.value = await products.loadOne(props.id);
      form.value = toProductForm(product.value);
    }
  } catch (error) {
    toast.error(messageFor(error));
    await router.replace({ name: ROUTE_NAMES.adminProducts });
  } finally {
    loading.value = false;
  }
});

async function save(): Promise<void> {
  const input = formToInput(form.value);
  errors.value = validateProductInput(input);
  if (hasErrors(errors.value)) return;
  saving.value = true;
  try {
    if (props.id) {
      product.value = await products.update(props.id, input);
      toast.success(t("admin.products.saved"));
    } else {
      const created = await products.create(input);
      product.value = created;
      toast.success(t("admin.products.created"));
      await router.replace({ name: ROUTE_NAMES.adminProductEdit, params: { id: created.id } });
    }
  } catch (error) {
    toast.error(messageFor(error));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <RouterLink :to="{ name: ROUTE_NAMES.adminProducts }" class="text-sm text-muted hover:text-accent">{{ t("admin.products.back") }}</RouterLink>
    <h1 class="font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-steel">{{ editing ? t("admin.products.editTitle") : t("admin.products.newTitle") }}</h1>
    <SkeletonForm v-if="loading" :fields="5" />
    <template v-else>
      <form class="metal-card flex flex-col gap-4 rounded-sm p-4 sm:p-6" novalidate @submit.prevent="save">
        <BaseInput v-model="form.name" :label="t('admin.products.name')" :error="translated.name" required />
        <BaseTextarea v-model="form.description" :label="t('admin.products.description')" />
        <BaseSelect v-model="form.categoryId" :label="t('admin.products.category')" :options="categoryOptions" />
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput v-model="form.price" type="number" :min="0" :step="0.01" inputmode="decimal" :label="t('admin.products.price')" :error="translated.price" required />
          <BaseInput
            v-model="form.promoPrice"
            type="number"
            :min="0"
            :step="0.01"
            inputmode="decimal"
            :label="t('admin.products.promoPrice')"
            :hint="t('admin.products.promoHint')"
            :error="translated.promoPrice"
          />
        </div>
        <VariantsEditor v-model="form.variants" :error="translated.variants" />
        <div class="flex flex-wrap gap-6">
          <BaseSwitch v-model="form.visible" :label="t('admin.products.visible')" />
          <BaseSwitch v-model="form.featured" :label="t('admin.products.featured')" />
        </div>
        <div class="flex justify-end">
          <BaseButton type="submit" :loading="saving">{{ t("common.save") }}</BaseButton>
        </div>
      </form>
      <div v-if="product" class="metal-card rounded-sm p-4 sm:p-6"><ImageManager :product="product" @updated="product = $event" /></div>
      <p v-else class="rounded-sm border border-dashed border-edge px-4 py-6 text-center text-sm text-muted">{{ t("admin.images.saveFirst") }}</p>
    </template>
  </div>
</template>
