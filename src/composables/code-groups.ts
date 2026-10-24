import { onMounted, onUnmounted } from 'vue'
import { onContentUpdated } from 'vitepress'
import { animate } from 'motion-v'
import { shouldReduceMotion, useMotionMode } from './motion'

const PILL = 'cf-tab-pill'

/** Box of the label for the checked input, relative to its `.tabs` row. */
function target(tabs: HTMLElement) {
  const input = tabs.querySelector<HTMLInputElement>('input:checked') ?? tabs.querySelector('input')
  const label = input && tabs.querySelector<HTMLElement>(`label[for="${CSS.escape(input.id)}"]`)
  return label ? { x: label.offsetLeft, y: label.offsetTop, width: label.offsetWidth, height: label.offsetHeight } : null
}

function pillOf(tabs: HTMLElement): HTMLElement {
  let pill = tabs.querySelector<HTMLElement>(`:scope > .${PILL}`)
  if (!pill) {
    pill = document.createElement('span')
    pill.className = PILL
    pill.setAttribute('aria-hidden', 'true')
    tabs.prepend(pill)
  }
  return pill
}

function place(tabs: HTMLElement, animated: boolean) {
  const box = target(tabs)
  if (!box) return
  const pill = pillOf(tabs)
  pill.style.top = `${box.y}px`
  pill.style.height = `${box.height}px`
  // Instant moves go through Motion too, so it knows where the next spring starts.
  animate(
    pill,
    { x: box.x, width: box.width },
    animated ? { type: 'spring', stiffness: 1100, damping: 60, mass: 0.5 } : { duration: 0 },
  )
}

/**
 * Gives every `::: code-group` tab row one background pill that springs to
 * the selected tab, the way the navbar's highlight moves.
 *
 * VitePress's client core still owns the switching (it listens for clicks on
 * the radio inputs); this only adds the pill and moves it on `change`.
 */
export function useCodeGroupPills() {
  const mode = useMotionMode()
  const rows = () => document.querySelectorAll<HTMLElement>('.cf-doc .vp-code-group > .tabs')

  const resize = new (typeof ResizeObserver === 'undefined' ? class { observe() {} disconnect() {} } : ResizeObserver)(
    (entries: ResizeObserverEntry[]) => entries.forEach((e) => place(e.target as HTMLElement, false)),
  )

  const onChange = (e: Event) => {
    const input = e.target as HTMLElement
    if (!input.matches?.('.vp-code-group input')) return
    const tabs = input.closest<HTMLElement>('.tabs')
    if (tabs) place(tabs, !shouldReduceMotion(mode.value))
  }

  onContentUpdated(() => {
    resize.disconnect()
    rows().forEach((tabs) => {
      place(tabs, false)
      resize.observe(tabs)
    })
  })
  onMounted(() => document.addEventListener('change', onChange))
  onUnmounted(() => {
    document.removeEventListener('change', onChange)
    resize.disconnect()
  })
}
