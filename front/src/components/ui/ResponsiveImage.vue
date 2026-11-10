<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { IMAGE_VARIANT_WIDTHS } from "@/components/ui/ui.constants";
import type { ResponsiveImageProps } from "@/components/ui/ui.types";

const props = withDefaults(defineProps<ResponsiveImageProps>(), { eager: false, priority: false, fallbackSrc: "medium", imgClass: "" });
const loaded = ref(false);
const element = ref<HTMLImageElement | null>(null);

const srcset = computed(
  () => `${props.urls.thumb} ${IMAGE_VARIANT_WIDTHS.thumb}w, ${props.urls.medium} ${IMAGE_VARIANT_WIDTHS.medium}w, ${props.urls.large} ${IMAGE_VARIANT_WIDTHS.large}w`,
);
const dimension = computed(() => IMAGE_VARIANT_WIDTHS[props.fallbackSrc]);

onMounted(() => {
  if (element.value?.complete && element.value.naturalWidth > 0) loaded.value = true;
});
</script>

<template>
  <img
    ref="element"
    :src="props.urls[props.fallbackSrc]"
    :srcset="srcset"
    :sizes="props.sizes"
    :alt="props.alt"
    :width="dimension"
    :height="dimension"
    :loading="props.eager ? 'eager' : 'lazy'"
    :fetchpriority="props.priority ? 'high' : 'auto'"
    decoding="async"
    class="img-fade size-full object-cover"
    :class="props.imgClass"
    :data-loaded="loaded"
    @load="loaded = true"
    @error="loaded = true"
  />
</template>
