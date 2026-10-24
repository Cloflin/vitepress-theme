<script setup lang="ts">
/**
 * The page tree. Top-level items with `items` are groups (an optional icon and
 * a muted heading); items inside a group that have their own `items` render as
 * a sub-heading over their links. One floating background follows the pointer
 * across every link in the tree, the way unlumen UI's sidebar does it.
 */
import { provide, ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { useSidebar } from '../composables/sidebar'
import SidebarLink from './SidebarLink.vue'
import { SIDEBAR_HOVER } from './sidebar-keys'

const props = withDefaults(defineProps<{ scope?: string }>(), { scope: 'desktop' })
const { items } = useSidebar()

const container = ref<HTMLElement>()
const hovered = ref<string | null>(null)
const rect = ref<{ top: number; height: number } | null>(null)

provide(SIDEBAR_HOVER, {
  scope: props.scope,
  hovered,
  enter(link, el) {
    hovered.value = link
    const box = el.getBoundingClientRect()
    const base = container.value?.getBoundingClientRect()
    rect.value = base ? { top: box.top - base.top, height: box.height } : null
  },
  leave() {
    hovered.value = null
    rect.value = null
  },
})
</script>

<template>
  <nav aria-label="Sidebar" class="relative pb-14" ref="container">
    <AnimatePresence>
      <motion.div
        v-if="rect"
        key="hover-bg"
        aria-hidden="true"
        class="pointer-events-none absolute right-0 left-[25px] z-0 rounded-md bg-accent/50"
        :initial="{ opacity: 0, top: rect.top + 2, height: rect.height - 4 }"
        :animate="{ opacity: 1, top: rect.top + 2, height: rect.height - 4 }"
        :exit="{ opacity: 0 }"
        :transition="{ type: 'spring', stiffness: 2000, damping: 50, mass: 0.5 }"
      />
    </AnimatePresence>

    <slot name="sidebar-nav-before" />

    <template v-for="(group, gi) in items" :key="group.text + gi">
      <template v-if="group.items">
        <p :class="['mb-3.5 flex items-center gap-2 text-sm font-medium tracking-tight', gi === 0 ? 'mt-0' : 'mt-6']">
          <span
            v-if="group.icon"
            aria-hidden="true"
            class="flex items-center justify-center text-muted-foreground [&_svg]:size-4"
            v-html="group.icon"
          />
          <span class="text-foreground/50">{{ group.text }}</span>
        </p>
        <template v-for="item in group.items" :key="item.text + (item.link ?? '')">
          <template v-if="item.items">
            <p class="mt-4 mb-1.5 pl-[25px] text-xs font-medium tracking-wide text-foreground/40 uppercase">
              {{ item.text }}
            </p>
            <SidebarLink
              v-for="sub in item.items.filter((s) => s.link)"
              :key="sub.link"
              :text="sub.text"
              :link="sub.link!"
              :badge="sub.badge"
            />
          </template>
          <SidebarLink v-else-if="item.link" :text="item.text" :link="item.link" :badge="item.badge" />
        </template>
      </template>
      <SidebarLink v-else-if="group.link" :text="group.text" :link="group.link" :badge="group.badge" />
    </template>

    <slot name="sidebar-nav-after" />
  </nav>
</template>
