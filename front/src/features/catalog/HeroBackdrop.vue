<script setup lang="ts">
import heroPhoto from "@/assets/images/main-img.jpeg";
import heroPhoto540 from "@/assets/images/main-img-540.webp";
import heroPhoto1080 from "@/assets/images/main-img-1080.webp";
import { HERO_PHOTO_HEIGHT, HERO_PHOTO_SIZES, HERO_PHOTO_WIDTH } from "@/features/catalog/home.constants";
</script>

<template>
  <div class="absolute inset-0 bg-ink" aria-hidden="true" data-testid="hero-backdrop">
    <div class="absolute inset-y-0 right-0 w-full lg:w-[62%]">
      <img
        :src="heroPhoto"
        :srcset="`${heroPhoto540} 540w, ${heroPhoto1080} 1080w`"
        :sizes="HERO_PHOTO_SIZES"
        :width="HERO_PHOTO_WIDTH"
        :height="HERO_PHOTO_HEIGHT"
        alt=""
        loading="eager"
        fetchpriority="high"
        decoding="async"
        class="size-full object-cover object-[38%_14%] lg:object-[50%_8%]"
        onerror="this.remove()"
      />
    </div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/80 to-ink max-lg:from-ink/75 max-lg:via-ink/45 lg:bg-gradient-to-r lg:from-ink lg:from-30% lg:via-ink/55 lg:to-transparent"
    />
    <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
  </div>
</template>
