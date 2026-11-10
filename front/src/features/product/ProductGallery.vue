<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";
import { GALLERY_REST_FALLBACK_MS, GALLERY_SIZES } from "@/features/product/product-view.constants";
import type { ProductGalleryProps } from "@/features/product/product-view.types";

const props = defineProps<ProductGalleryProps>();
const { t } = useI18n();
const index = ref(0);
const restReady = ref(false);
let restTimer = 0;
const track = ref<HTMLElement | null>(null);
let frame = 0;

const count = computed(() => props.images.length);

watch(
  () => props.images,
  () => {
    index.value = 0;
    track.value?.scrollTo({ left: 0, behavior: "instant" });
  },
);

onMounted(() => {
  restTimer = window.setTimeout(() => (restReady.value = true), GALLERY_REST_FALLBACK_MS);
});

onBeforeUnmount(() => {
  window.clearTimeout(restTimer);
  cancelAnimationFrame(frame);
});

function scrollToIndex(target: number): void {
  const element = track.value;
  index.value = target;
  if (element) element.scrollTo({ left: target * element.clientWidth });
}

function go(step: number): void {
  if (count.value === 0) return;
  scrollToIndex((index.value + step + count.value) % count.value);
}

function onScroll(): void {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const element = track.value;
    if (!element || element.clientWidth === 0) return;
    index.value = Math.round(element.scrollLeft / element.clientWidth);
  });
}
</script>

<template>
  <div class="flex flex-col gap-3 lg:flex-row-reverse">
    <div class="relative aspect-[4/5] w-full overflow-hidden border border-edge bg-raised max-h-[70vh] lg:flex-1">
      <div v-if="count > 0" ref="track" class="gallery-track size-full touch-pan-x" data-testid="gallery-track" @scroll.passive="onScroll">
        <div v-for="(image, position) in props.images" :key="image.id" class="gallery-slide size-full" data-testid="gallery-slide" @load.capture="restReady = true">
          <ResponsiveImage
            v-if="position === 0 || restReady"
            :urls="image.urls"
            :alt="props.alt"
            :sizes="GALLERY_SIZES"
            fallback-src="large"
            :eager="position === 0"
            :priority="position === 0"
            img-class="select-none"
          />
        </div>
      </div>
      <div v-else class="micro-label flex size-full items-center justify-center">{{ t("catalog.noImage") }}</div>
      <template v-if="count > 1">
        <button
          type="button"
          class="absolute left-2 top-1/2 size-10 -translate-y-1/2 rounded-sm border border-edge bg-ink/80 text-xl text-steel transition-[transform,background-color,border-color] duration-150 hover:border-accent active:scale-90 motion-reduce:transition-none"
          :aria-label="t('product.gallery.previous')"
          @click="go(-1)"
        >
          <ChevronLeft class="mx-auto size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-sm border border-edge bg-ink/80 text-xl text-steel transition-[transform,background-color,border-color] duration-150 hover:border-accent active:scale-90 motion-reduce:transition-none"
          :aria-label="t('product.gallery.next')"
          @click="go(1)"
        >
          <ChevronRight class="mx-auto size-5" aria-hidden="true" />
        </button>
        <span class="micro-label absolute bottom-3 left-3 bg-ink/80 px-2 py-1" data-testid="gallery-counter">{{ index + 1 }} / {{ count }}</span>
      </template>
    </div>
    <div v-if="count > 1" class="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
      <button
        v-for="(image, position) in props.images"
        :key="image.id"
        type="button"
        class="size-16 shrink-0 lg:size-20 overflow-hidden rounded-sm border transition-[border-color,opacity] duration-150 motion-reduce:transition-none"
        :class="position === index ? 'border-accent' : 'border-edge opacity-70 hover:opacity-100'"
        :aria-label="t('product.gallery.show', { number: position + 1 })"
        :aria-current="position === index"
        @click="scrollToIndex(position)"
      >
        <img :src="image.urls.thumb" alt="" width="80" height="80" loading="lazy" decoding="async" class="size-full object-cover" />
      </button>
    </div>
  </div>
</template>
