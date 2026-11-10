<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { setLocale } from "@/i18n";
import { LOCALE_LABEL_KEYS, SUPPORTED_LOCALES } from "@/i18n/i18n.constants";
import type { AppLocale } from "@/i18n/i18n.types";

const { t, locale } = useI18n();

function choose(next: AppLocale): void {
  setLocale(next);
}
</script>

<template>
  <div class="flex items-center gap-1" role="group" :aria-label="t('language.label')">
    <button
      v-for="option in SUPPORTED_LOCALES"
      :key="option"
      type="button"
      :aria-pressed="locale === option"
      class="min-h-9 min-w-9 rounded px-2 text-xs font-bold uppercase transition-colors"
      :class="locale === option ? 'bg-accent text-black' : 'text-muted hover:text-steel'"
      @click="choose(option)"
    >
      {{ t(LOCALE_LABEL_KEYS[option]) }}
    </button>
  </div>
</template>
