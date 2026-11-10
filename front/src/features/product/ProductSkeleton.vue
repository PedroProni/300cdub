<template>
  <div class="grid gap-8 lg:grid-cols-12 lg:gap-12" aria-busy="true" data-testid="product-skeleton">
    <div class="flex flex-col gap-3 lg:col-span-7 lg:flex-row-reverse" aria-hidden="true">
      <div class="skeleton aspect-[4/5] max-h-[70vh] w-full lg:flex-1" />
      <div class="flex gap-2 lg:w-20 lg:shrink-0 lg:flex-col"><div v-for="n in 3" :key="n" class="skeleton size-16 shrink-0 lg:size-20" /></div>
    </div>
    <div class="flex flex-col gap-5 lg:col-span-5" aria-hidden="true">
      <div class="skeleton h-4 w-24" />
      <div class="skeleton h-14 w-2/3" />
      <div class="flex items-center gap-3 border-y border-edge py-4">
        <div class="skeleton h-9 w-32" />
        <div class="skeleton h-6 w-24" />
      </div>
      <div class="space-y-2">
        <div class="skeleton h-4 w-full" />
        <div class="skeleton h-4 w-full" />
        <div class="skeleton h-4 w-2/3" />
      </div>
      <div class="flex gap-2"><div v-for="n in 4" :key="n" class="skeleton h-12 w-14" /></div>
      <div class="skeleton h-12 w-full" />
    </div>
  </div>
</template>
