<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import VariantPicker from "@/features/product/VariantPicker.vue";
import { useToast } from "@/composables/useToast";
import { copyText } from "@/utils/clipboard";
import { shareUrl } from "@/utils/buy-link";
import { ROUTE_NAMES } from "@/router/routes.constants";
import type { ProductPurchaseProps } from "@/features/product/product-view.types";

const props = defineProps<ProductPurchaseProps>();
const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const selected = ref<string | null>(null);

const hasVariants = computed(() => props.product.variants.length > 0);
const soleVariant = computed(() => (props.product.variants.length === 1 ? props.product.variants[0] : null));
const needsChoice = computed(() => props.product.variants.length > 1);

watch(
  () => props.product.id,
  () => {
    selected.value = soleVariant.value && soleVariant.value.stock > 0 ? soleVariant.value.id : null;
  },
  { immediate: true },
);

const soldOut = computed(() => props.product.stockStatus === "sold_out");
const selectedVariant = computed(() => props.product.variants.find((variant) => variant.id === selected.value) ?? null);
const canContinue = computed(() => !soldOut.value && (!hasVariants.value || (selectedVariant.value !== null && selectedVariant.value.stock > 0)));

function continueToContact(): void {
  if (!canContinue.value) return;
  router.push({ name: ROUTE_NAMES.contact, params: { slug: props.product.slug }, query: selectedVariant.value ? { size: selectedVariant.value.label } : {} });
}

async function share(): Promise<void> {
  const url = shareUrl(props.product.slug);
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: props.product.name, url });
      return;
    } catch {
      return;
    }
  }
  const copied = await copyText(url);
  if (copied) toast.success(t("product.linkCopied"));
  else toast.error(t("errors.generic"));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <VariantPicker v-if="needsChoice && !soldOut" v-model="selected" :variants="props.product.variants" />
    <p v-else-if="soleVariant && !soldOut" class="micro-label" data-testid="single-variant">{{ t("product.sizeSingle", { size: soleVariant.label }) }}</p>
    <BaseButton block :disabled="!canContinue" data-testid="want-this" @click="continueToContact">{{ soldOut ? t("product.cta.soldOut") : t("product.cta.want") }}</BaseButton>
    <p v-if="!soldOut && needsChoice && !selectedVariant" class="micro-label">{{ t("product.cta.chooseSize") }}</p>
    <BaseButton variant="ghost" data-testid="share" @click="share">{{ t("product.share") }}</BaseButton>
  </div>
</template>
