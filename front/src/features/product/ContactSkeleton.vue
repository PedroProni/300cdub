<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6" aria-busy="true" data-testid="contact-skeleton">
    <div class="skeleton h-5 w-24 rounded" aria-hidden="true" />
    <div class="skeleton h-10 w-2/3 rounded" aria-hidden="true" />
    <div class="metal-card flex items-center gap-4 rounded-xl p-3" aria-hidden="true">
      <div class="skeleton size-20 shrink-0 rounded-md" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="skeleton h-5 w-2/3 rounded" />
        <div class="skeleton h-5 w-1/4 rounded" />
      </div>
    </div>
    <div class="skeleton h-40 w-full rounded-md" aria-hidden="true" />
    <div class="flex gap-3" aria-hidden="true">
      <div class="skeleton h-12 flex-1 rounded-md" />
      <div class="skeleton h-12 flex-1 rounded-md" />
    </div>
  </div>
</template>
