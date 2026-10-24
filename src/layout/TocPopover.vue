<script setup lang="ts">
/**
 * Below the `xl` breakpoint the table of contents folds into a bar under the
 * navbar: it names the current section and opens the full list on demand.
 */
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { AnimatePresence, motion } from 'motion-v'
import { ChevronDown } from '@lucide/vue'
import { useToc } from '../composables/toc'

const { headers, active } = useToc()
const open = ref(false)
const route = useRoute()

watch(() => route.path, () => (open.value = false))

const current = computed(() => {
  const i = active.value[0]
  return i === undefined ? 'On this page' : headers.value[i]?.title
})
</script>

<template>
  <div v-if="headers.length" class="sticky top-16 z-30 -mx-4 border-b bg-background/90 px-4 backdrop-blur md:-mx-8 md:px-8 xl:hidden">
    <button
      type="button"
      class="flex h-10 w-full items-center gap-2 text-left text-sm text-muted-foreground"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="truncate text-foreground">{{ current }}</span>
      <ChevronDown :class="['ml-auto size-4 shrink-0 transition-transform', open && 'rotate-180']" />
    </button>
    <AnimatePresence>
      <motion.nav
        v-if="open"
        class="overflow-hidden"
        :initial="{ height: 0, opacity: 0 }"
        :animate="{ height: 'auto', opacity: 1 }"
        :exit="{ height: 0, opacity: 0 }"
        :transition="{ duration: 0.2, ease: 'easeOut' }"
      >
        <div class="flex max-h-[50vh] flex-col overflow-y-auto pb-3">
          <a
            v-for="(h, i) in headers"
            :key="h.link"
            :href="h.link"
            :class="['py-1 text-sm', active.includes(i) ? 'text-foreground' : 'text-muted-foreground']"
            :style="{ paddingInlineStart: `${(h.level - 2) * 0.75}rem` }"
            @click="open = false"
          >{{ h.title }}</a>
        </div>
      </motion.nav>
    </AnimatePresence>
  </div>
</template>
