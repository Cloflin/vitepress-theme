<script setup lang="ts">
/**
 * One sidebar link with unlumen UI's ruler: a column of hairline ticks down the
 * left edge, a longer tick at the item's middle that stretches on hover, and an
 * accent bar that replaces it on the active item. The bar carries a `layoutId`,
 * so on navigation it springs from the old item to the new one.
 */
import { computed, inject, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { useRoute, withBase } from 'vitepress'
import { isActive } from '../composables/sidebar'
import { SIDEBAR_HOVER } from './sidebar-keys'

const props = defineProps<{ text: string; link: string; badge?: string }>()

const route = useRoute()
const hover = inject(SIDEBAR_HOVER)!

const external = computed(() => /^[a-z]+:/i.test(props.link))
const active = computed(() => isActive(route.path, props.link))
const hovered = computed(() => hover.hovered.value === props.link)
const href = computed(() => (external.value ? props.link : withBase(props.link)))

const item = ref<HTMLElement>()
onMounted(() => {
  if (!active.value || !item.value) return
  const viewport = item.value.closest<HTMLElement>('[data-sidebar-viewport]')
  if (!viewport) return
  const v = viewport.getBoundingClientRect()
  const e = item.value.getBoundingClientRect()
  const offset = e.top - v.top - v.height / 2 + e.height / 2
  if (Math.abs(offset) > 40) viewport.scrollBy({ top: offset })
})

const spring = (stiffness: number, damping: number) => ({ type: 'spring' as const, stiffness, damping })
</script>

<template>
  <div class="relative">
    <motion.span
      v-if="active"
      :layout-id="`cf-sidebar-active-bar-${hover.scope}`"
      aria-hidden="true"
      class="pointer-events-none absolute top-[calc(50%-0.9px)] left-[4px] z-[11] h-[1.8px] rounded-full bg-brand"
      :initial="false"
      :animate="{ width: 30 }"
      :transition="spring(800, 40)"
    />
    <motion.span
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-0 h-px bg-foreground/50"
      :initial="false"
      :animate="{ width: active ? 0 : hovered ? 26 : 18 }"
      :transition="spring(600, 30)"
    />
    <span aria-hidden="true" class="pointer-events-none absolute top-0 left-0 h-px w-[16px] bg-foreground/30" />
    <span aria-hidden="true" class="pointer-events-none absolute top-1/4 left-0 h-px w-[13px] bg-foreground/30" />
    <span aria-hidden="true" class="pointer-events-none absolute top-3/4 left-0 h-px w-[13px] bg-foreground/30" />

    <motion.div
      :initial="false"
      :animate="{ opacity: active || hovered ? 1 : 0.55, x: active ? 8 : hovered ? 6 : 0 }"
      :transition="spring(700, 30)"
      :style="{ transformOrigin: 'left center' }"
    >
      <a
        ref="item"
        :href="href"
        :target="external ? '_blank' : undefined"
        :rel="external ? 'noreferrer' : undefined"
        :aria-current="active ? 'page' : undefined"
        class="relative ml-2 flex items-center rounded-md py-1.5 pl-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @pointerenter="hover.enter(link, $event.currentTarget as HTMLElement)"
        @pointerleave="hover.leave()"
        @focus="hover.enter(link, $event.currentTarget as HTMLElement)"
        @blur="hover.leave()"
      >
        <span class="relative z-[1] inline-flex w-full items-center gap-2 pl-2.5">
          {{ text }}
          <span v-if="badge === 'new'" class="size-1.5 shrink-0 rounded-full bg-brand" aria-label="new" />
          <span
            v-else-if="badge"
            class="rounded-full border px-1.5 py-px text-[10px] leading-none text-muted-foreground"
          >{{ badge }}</span>
        </span>
      </a>
    </motion.div>
  </div>
</template>
