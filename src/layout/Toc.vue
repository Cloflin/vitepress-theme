<script setup lang="ts">
/**
 * "On this page". A hairline runs down the left of the list; a 3px thumb rides
 * on it beside the current section and springs to the next one as the reader
 * scrolls — the Fumadocs table of contents that unlumen UI Docs uses.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { motion } from 'motion-v'
import { AlignLeft } from '@lucide/vue'
import { useToc } from '../composables/toc'
import type { ThemeConfig } from '../types'

const { theme } = useData<ThemeConfig>()
const { headers, active } = useToc()

const list = ref<HTMLElement>()
const thumb = ref<{ top: number; height: number } | null>(null)

async function place() {
  await nextTick()
  const items = list.value?.querySelectorAll<HTMLElement>('[data-toc-item]')
  if (!items || !active.value.length) {
    thumb.value = null
    return
  }
  const first = items[active.value[0]]
  const last = items[active.value[active.value.length - 1]]
  if (!first || !last) return
  thumb.value = { top: first.offsetTop, height: last.offsetTop + last.offsetHeight - first.offsetTop }
}

watch([active, headers], place, { deep: true })

const minLevel = computed(() => Math.min(...headers.value.map((h) => h.level)))
const label = computed(() => theme.value.outline?.label ?? 'On this page')
</script>

<template>
  <div v-if="headers.length" class="text-sm">
    <p class="mb-3 flex items-center gap-1.5 text-muted-foreground">
      <AlignLeft class="size-3.5" />
      {{ label }}
    </p>
    <div ref="list" class="relative border-l border-foreground/10">
      <motion.div
        v-if="thumb"
        aria-hidden="true"
        class="absolute -left-px w-[3px] -translate-x-px rounded-full bg-foreground"
        :initial="false"
        :animate="{ top: thumb.top, height: thumb.height, opacity: 1 }"
        :transition="{ type: 'spring', stiffness: 500, damping: 40 }"
      />
      <a
        v-for="(h, i) in headers"
        :key="h.link"
        :href="h.link"
        data-toc-item
        :class="[
          'block py-1.5 leading-snug transition-colors',
          active.includes(i) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
        ]"
        :style="{ paddingInlineStart: `${1.25 + (h.level - minLevel) * 0.75}rem` }"
      >
        {{ h.title }}
      </a>
    </div>
  </div>
</template>
