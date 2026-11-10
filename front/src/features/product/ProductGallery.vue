<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import ResponsiveImage from "@/components/ui/ResponsiveImage.vue";
import { GALLERY_SIZES } from "@/features/product/product-view.constants";
import type { ProductGalleryProps } from "@/features/product/product-view.types";

const props = defineProps<ProductGalleryProps>();
const { t } = useI18n();
const index = ref(0);
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
  <div class="flex flex-col gap-3">
    <div class="metal-card relative aspect-square overflow-hidden rounded-xl">
      <div v-if="count > 0" ref="track" class="gallery-track size-full touch-pan-x" data-testid="gallery-track" @scroll.passive="onScroll">
        <div v-for="(image, position) in props.images" :key="image.id" class="gallery-slide size-full" data-testid="gallery-slide">
          <ResponsiveImage
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
      <div v-else class="font-display-tight flex size-full items-center justify-center text-muted">{{ t("catalog.noImage") }}</div>
      <template v-if="count > 1">
        <button
          type="button"
          class="absolute left-2 top-1/2 size-10 -translate-y-1/2 rounded-full bg-black/60 text-xl text-steel transition-[transform,background-color] duration-150 hover:bg-black active:scale-90 motion-reduce:transition-none"
          :aria-label="t('product.gallery.previous')"
          @click="go(-1)"
        >
          <ChevronLeft class="mx-auto size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 size-10 -translate-y-1/2 rounded-full bg-black/60 text-xl text-steel transition-[transform,background-color] duration-150 hover:bg-black active:scale-90 motion-reduce:transition-none"
          :aria-label="t('product.gallery.next')"
          @click="go(1)"
        >
          <ChevronRight class="mx-auto size-5" aria-hidden="true" />
        </button>
      </template>
    </div>
    <div v-if="count > 1" class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(image, position) in props.images"
        :key="image.id"
        type="button"
        class="size-16 shrink-0 overflow-hidden rounded-md border-2 transition-[border-color,opacity] duration-150 motion-reduce:transition-none"
        :class="position === index ? 'border-accent' : 'border-edge opacity-70 hover:opacity-100'"
        :aria-label="t('product.gallery.show', { number: position + 1 })"
        :aria-current="position === index"
        @click="scrollToIndex(position)"
      >
        <img :src="image.urls.thumb" alt="" width="64" height="64" loading="lazy" decoding="async" class="size-full object-cover" />
      </button>
    </div>
  </div>
</template>
