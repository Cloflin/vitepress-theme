<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <div class="mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
    <p class="font-mono text-sm text-brand">404</p>
    <h1 class="mt-3 font-serif text-5xl font-light">Page not found</h1>
    <p class="mt-4 text-muted-foreground">The page you are looking for does not exist or has moved.</p>
    <a
      :href="withBase('/')"
      class="mt-8 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >Back home</a>
  </div>
</template>
