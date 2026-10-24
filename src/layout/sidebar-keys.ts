import type { InjectionKey, Ref } from 'vue'

export const SIDEBAR_HOVER = Symbol('cf-sidebar-hover') as InjectionKey<{
  hovered: Ref<string | null>
  enter: (link: string, el: HTMLElement) => void
  leave: () => void
  /** Keeps two mounted trees (desktop, mobile menu) from sharing one `layoutId`. */
  scope: string
}>
