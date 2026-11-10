<script setup lang="ts">
import heroPhoto800 from "@/assets/images/hero-300c-800.webp";
import heroPhoto1600 from "@/assets/images/hero-300c-1600.webp";
import { HERO_BACKDROP_HEIGHT, HERO_BACKDROP_WIDTH } from "@/features/catalog/home.constants";
</script>

<template>
  <div class="absolute inset-0 bg-ink" aria-hidden="true" data-testid="hero-backdrop">
    <img
      :src="heroPhoto1600"
      :srcset="`${heroPhoto800} 800w, ${heroPhoto1600} 1600w`"
      sizes="100vw"
      :width="HERO_BACKDROP_WIDTH"
      :height="HERO_BACKDROP_HEIGHT"
      alt=""
      loading="eager"
      fetchpriority="high"
      decoding="async"
      class="size-full object-cover object-[68%_50%]"
      onerror="this.remove()"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/75 to-ink/55 lg:bg-gradient-to-r lg:from-ink lg:via-ink/80 lg:to-ink/25" />
    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
  </div>
</template>
