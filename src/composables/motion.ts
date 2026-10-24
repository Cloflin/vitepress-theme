import { computed } from 'vue'
import { useData } from 'vitepress'
import type { ThemeConfig } from '../types'

export type MotionMode = NonNullable<ThemeConfig['motion']>

/** `themeConfig.motion` → the value `MotionConfig`'s `reducedMotion` takes. */
export const REDUCED_MOTION = { on: 'never', system: 'user', off: 'always' } as const

export function useMotionMode() {
  const { theme } = useData<ThemeConfig>()
  return computed<MotionMode>(() => theme.value.motion ?? 'on')
}

/** True when the theme should skip an animation right now. */
export function shouldReduceMotion(mode: MotionMode): boolean {
  if (mode === 'off') return true
  if (mode === 'on') return false
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
