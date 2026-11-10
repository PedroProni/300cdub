<template>
  <div class="grid gap-8 md:grid-cols-2" aria-busy="true" data-testid="product-skeleton">
    <div class="flex flex-col gap-3" aria-hidden="true">
      <div class="skeleton aspect-square w-full rounded-xl" />
      <div class="flex gap-2"><div v-for="n in 3" :key="n" class="skeleton size-16 shrink-0 rounded-md" /></div>
    </div>
    <div class="flex flex-col gap-4" aria-hidden="true">
      <div class="skeleton h-4 w-24 rounded" />
      <div class="skeleton h-10 w-2/3 rounded" />
      <div class="flex items-center gap-3">
        <div class="skeleton h-9 w-32 rounded" />
        <div class="skeleton h-7 w-28 rounded-full" />
      </div>
      <div class="space-y-2">
        <div class="skeleton h-4 w-full rounded" />
        <div class="skeleton h-4 w-full rounded" />
        <div class="skeleton h-4 w-2/3 rounded" />
      </div>
      <div class="flex gap-2"><div v-for="n in 4" :key="n" class="skeleton size-11 rounded-md" /></div>
      <div class="skeleton h-12 w-full rounded-md" />
    </div>
  </div>
</template>
