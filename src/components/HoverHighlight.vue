<script setup lang="ts">
/**
 * A single background pill that springs between the children under the pointer.
 *
 * Vue port of the `mode="parent" hover` variant of unlumen UI's `Highlight`:
 * one absolutely positioned element is moved, rather than one per item, so the
 * pill slides across the gap between neighbours instead of fading in and out.
 * Any descendant carrying `data-highlight` is a target.
 */
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const props = withDefaults(
  defineProps<{
    /** Classes for the pill itself. */
    pillClass?: string
    stiffness?: number
    damping?: number
  }>(),
  { pillClass: 'bg-accent rounded-md', stiffness: 1100, damping: 40 },
)

const root = ref<HTMLElement>()
const rect = ref<{ left: number; top: number; width: number; height: number } | null>(null)

function onOver(e: PointerEvent) {
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-highlight]')
  if (!target || !root.value?.contains(target)) return
  const box = target.getBoundingClientRect()
  const base = root.value.getBoundingClientRect()
  rect.value = { left: box.left - base.left, top: box.top - base.top, width: box.width, height: box.height }
}
</script>

<template>
  <div ref="root" class="relative" @pointerover="onOver" @pointerleave="rect = null">
    <AnimatePresence>
      <motion.div
        v-if="rect"
        key="pill"
        aria-hidden="true"
        :class="['pointer-events-none absolute z-0', props.pillClass]"
        :initial="{ opacity: 0, ...rect }"
        :animate="{ opacity: 1, ...rect }"
        :exit="{ opacity: 0 }"
        :transition="{ type: 'spring', stiffness: props.stiffness, damping: props.damping, mass: 0.5 }"
      />
    </AnimatePresence>
    <slot />
  </div>
</template>
