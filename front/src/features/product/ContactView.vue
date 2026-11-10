<script setup lang="ts">
import ContactSkeleton from "@/features/product/ContactSkeleton.vue";
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import BaseButton from "@/components/ui/BaseButton.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import PriceTag from "@/components/ui/PriceTag.vue";
import { useProductStore } from "@/features/product/product.store";
import { useSiteStore } from "@/features/site/site.store";
import { useHead } from "@/composables/useHead";
import { useToast } from "@/composables/useToast";
import { copyText } from "@/utils/clipboard";
import { instagramDmUrl, shareUrl, whatsappUrl } from "@/utils/buy-link";
import { ROUTE_NAMES } from "@/router/routes.constants";
import type { SlugProps } from "@/features/product/product-view.types";

const props = defineProps<SlugProps>();
const { t } = useI18n();
const route = useRoute();
const store = useProductStore();
const site = useSiteStore();
const toast = useToast();
const message = ref("");
const edited = ref(false);
const copied = ref(false);

const size = computed(() => (typeof route.query.size === "string" ? route.query.size : ""));
const product = computed(() => store.product);
const defaultMessage = computed(() => {
  if (!product.value) return "";
  const link = shareUrl(product.value.slug);
  return size.value
    ? t("contact.message.withSize", { product: product.value.name, size: size.value, link })
    : t("contact.message.withoutSize", { product: product.value.name, link });
});
const whatsappHref = computed(() => (site.settings?.whatsappNumber ? whatsappUrl(site.settings.whatsappNumber, message.value) : null));
const instagramHref = computed(() => (site.settings?.instagramHandle ? instagramDmUrl(site.settings.instagramHandle) : null));
const hasMessage = computed(() => message.value.trim() !== "");

site.load();
watch(
  () => props.slug,
  (slug) => store.load(slug),
  { immediate: true },
);
watch(
  defaultMessage,
  (value) => {
    if (!edited.value) message.value = value;
  },
  { immediate: true },
);

useHead({ title: () => `${t("contact.title")} | ${t("brand.name")}` });

function markEdited(): void {
  edited.value = true;
  copied.value = false;
}

async function openInstagram(): Promise<void> {
  if (!instagramHref.value) return;
  const copy = copyText(message.value);
  window.open(instagramHref.value, "_blank", "noopener,noreferrer");
  const ok = await copy;
  copied.value = ok;
  if (ok) toast.success(t("contact.instagram.copiedToast"));
  else toast.error(t("contact.instagram.copyFailed"));
}
</script>

<template>
  <ContactSkeleton v-if="store.loading" />
  <EmptyState v-else-if="store.notFound || store.failed" :title="t('product.notFound.title')" :description="t('product.notFound.description')">
    <RouterLink :to="{ name: ROUTE_NAMES.catalog }" class="font-display-tight inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-black">{{
      t("product.notFound.back")
    }}</RouterLink>
  </EmptyState>
  <div v-else-if="product" class="mx-auto flex max-w-2xl flex-col gap-6">
    <RouterLink :to="{ name: ROUTE_NAMES.product, params: { slug: product.slug } }" class="text-sm text-muted hover:text-accent">{{ t("contact.back") }}</RouterLink>
    <h1 class="font-display-tight text-3xl font-bold text-steel">{{ t("contact.title") }}</h1>
    <div class="metal-card flex items-center gap-4 rounded-xl p-3" data-testid="contact-summary">
      <img
        v-if="product.images[0]"
        :src="product.images[0].urls.thumb"
        :alt="product.name"
        width="80"
        height="80"
        decoding="async"
        class="size-20 shrink-0 rounded-md object-cover"
      />
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-steel">{{ product.name }}</p>
        <p v-if="size" class="text-sm text-muted">{{ t("contact.size", { size }) }}</p>
        <PriceTag :price="product.price" :promo-price="product.promoPrice" />
      </div>
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="contact-message" class="text-sm font-medium text-steel">{{ t("contact.messageLabel") }}</label>
      <textarea id="contact-message" v-model="message" rows="6" class="rounded-md border border-edge bg-ink px-3 py-2 text-base text-steel" @input="markEdited" />
      <p class="text-xs text-muted">{{ t("contact.messageHint") }}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <a
        :href="hasMessage && whatsappHref ? whatsappHref : undefined"
        target="_blank"
        rel="noopener noreferrer"
        :aria-disabled="!hasMessage || !whatsappHref"
        class="font-display-tight inline-flex min-h-14 items-center justify-center press rounded-md bg-accent px-6 text-base font-bold text-black hover:bg-accent-hot aria-disabled:pointer-events-none aria-disabled:opacity-50"
        data-testid="whatsapp"
      >
        {{ t("contact.whatsapp") }}
      </a>
      <BaseButton variant="secondary" class="min-h-14 text-base" :disabled="!hasMessage || !instagramHref" data-testid="instagram" @click="openInstagram">{{
        t("contact.instagram.button")
      }}</BaseButton>
    </div>
    <p class="text-sm text-muted">{{ t("contact.instagram.preHint") }}</p>
    <p v-if="copied" role="status" class="rounded-md border border-accent/60 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent" data-testid="copied-hint">
      {{ t("contact.instagram.copiedHint") }}
    </p>
  </div>
</template>
