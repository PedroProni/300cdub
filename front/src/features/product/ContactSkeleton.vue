<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6" aria-busy="true" data-testid="contact-skeleton">
    <div class="skeleton h-5 w-24" aria-hidden="true" />
    <div class="skeleton h-16 w-2/3" aria-hidden="true" />
    <div class="flex items-center gap-4 border border-edge bg-panel p-3" aria-hidden="true">
      <div class="skeleton size-24 shrink-0" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="skeleton h-6 w-2/3" />
        <div class="skeleton h-5 w-1/4" />
      </div>
    </div>
    <div class="skeleton h-40 w-full" aria-hidden="true" />
    <div class="flex gap-3" aria-hidden="true">
      <div class="skeleton h-14 flex-1" />
      <div class="skeleton h-14 flex-1" />
    </div>
  </div>
</template>
