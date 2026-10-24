import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import type { ThemeConfig, TocHeader } from '../types'

/** Height of the fixed navbar plus breathing room; a heading above this line has been reached. */
export const SCROLL_OFFSET = 96

/**
 * Index of the current section: the last heading that has crossed `line`
 * (the navbar's bottom edge plus room), or the first heading while none has.
 * At the end of the page, where the last headings can never reach the line,
 * the last heading wins. One item at a time, as unlumen UI Docs shows it.
 */
export function activeHeading(tops: number[], line: number, atEnd: boolean): number {
  if (!tops.length) return -1
  if (atEnd) return tops.length - 1
  let current = 0
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= line) current = i
    else break
  }
  return current
}

/** Reads the outline headings from the rendered page, skipping ones marked `.ignore-header`. */
export function readHeaders(root: ParentNode, [min, max]: [number, number]): TocHeader[] {
  const selector = Array.from({ length: max - min + 1 }, (_, i) => `h${min + i}[id]`).join(',')
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter((el) => !el.classList.contains('ignore-header') && el.offsetParent !== null)
    .map((el) => ({
      level: Number(el.tagName[1]),
      link: `#${el.id}`,
      title: headerText(el),
    }))
}

function headerText(el: HTMLElement): string {
  let text = ''
  for (const node of Array.from(el.childNodes)) {
    if (node instanceof HTMLElement && (node.classList.contains('header-anchor') || node.classList.contains('ignore-header'))) continue
    text += node.textContent ?? ''
  }
  return text.trim()
}

export function useToc() {
  const { theme, frontmatter } = useData<ThemeConfig>()
  const headers = shallowRef<TocHeader[]>([])
  const active = ref<number[]>([])

  const levels = (): [number, number] => {
    const fm = frontmatter.value.outline
    if (fm === false) return [0, -1]
    if (Array.isArray(fm)) return fm as [number, number]
    if (typeof fm === 'number') return [fm, fm]
    return theme.value.outline?.level ?? [2, 3]
  }

  const update = () => {
    const els = headers.value
      .map((h) => document.getElementById(decodeURIComponent(h.link.slice(1))))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) {
      active.value = []
      return
    }
    const scrollY = window.scrollY
    const tops = els.map((el) => el.getBoundingClientRect().top + scrollY)
    const atEnd = window.innerHeight + scrollY >= document.body.offsetHeight - 2
    active.value = [activeHeading(tops, scrollY + SCROLL_OFFSET + 8, atEnd && scrollY > 0)]
  }

  onContentUpdated(() => {
    const content = document.querySelector('.cf-doc')
    headers.value = content ? readHeaders(content, levels()) : []
    requestAnimationFrame(update)
  })

  let frame = 0
  const onScroll = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(update)
  }
  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { headers, active }
}
