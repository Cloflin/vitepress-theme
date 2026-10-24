<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { AnimatePresence, motion } from 'motion-v'
import { useThemeTransition } from '../composables/theme-transition'

const { isDark, toggle } = useThemeTransition()
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="relative inline-flex size-8 items-center justify-center overflow-hidden rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      title="Toggle theme (D)"
      @click="toggle($event)"
    >
      <AnimatePresence :initial="false" mode="wait">
        <motion.span
          :key="isDark ? 'sun' : 'moon'"
          class="inline-flex"
          :initial="{ opacity: 0, rotate: -45, scale: 0.75, y: 6 }"
          :animate="{ opacity: 1, rotate: 0, scale: 1, y: 0 }"
          :exit="{ opacity: 0, rotate: 45, scale: 0.75, y: -6 }"
          :transition="{ duration: 0.18, ease: 'easeOut' }"
        >
          <Sun v-if="isDark" class="size-4" />
          <Moon v-else class="size-4" />
        </motion.span>
      </AnimatePresence>
    </button>
  </ClientOnly>
</template>
