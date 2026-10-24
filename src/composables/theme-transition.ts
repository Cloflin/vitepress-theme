import { nextTick } from 'vue'
import { useData } from 'vitepress'

let origin = { x: 0, y: 0 }

/** Records where the pointer was, so the reveal grows from the button that was clicked. */
export function captureOrigin(e: MouseEvent) {
  origin = { x: e.clientX, y: e.clientY }
}

/**
 * Flips the appearance with a circular reveal grown from the last pointer
 * position, ported from unlumen UI's `use-theme-transition`.
 *
 * Without the View Transitions API, with reduced motion, or on very wide
 * screens (a full-page snapshot there costs more than the effect is worth)
 * the flip is instant.
 */
export function useThemeTransition() {
  const { isDark } = useData()

  const toggle = (e?: MouseEvent) => {
    if (e) captureOrigin(e)
    // The class flip lands on the next tick; the transition must wait for it
    // or the "new" snapshot is taken of the old appearance.
    const apply = async () => {
      isDark.value = !isDark.value
      await nextTick()
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce || window.innerWidth > 1800) {
      void apply()
      return
    }
    const { x, y } = origin.x || origin.y ? origin : { x: window.innerWidth / 2, y: 0 }
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const root = document.documentElement
    root.style.setProperty('--vt-x', `${x}px`)
    root.style.setProperty('--vt-y', `${y}px`)
    root.style.setProperty('--vt-r', `${r}px`)
    document.startViewTransition(apply).ready.catch(() => {})
  }

  return { isDark, toggle }
}
