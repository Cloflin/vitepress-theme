<script setup lang="ts">
/** A fade under the navbar that appears once the page scrolls, so text slides out of sight softly. */
import { useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'

const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 6)
</script>

<template>
  <div
    aria-hidden="true"
    :class="[
      'pointer-events-none fixed top-0 left-0 z-40 h-32 w-full transition-opacity duration-300',
      scrolled ? 'opacity-100' : 'opacity-0',
    ]"
    style="
      background: linear-gradient(to bottom, var(--cf-background), transparent);
      mask-image: linear-gradient(to bottom, black 40%, transparent);
    "
  />
</template>
