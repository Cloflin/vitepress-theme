import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import type { FlatLink, SidebarItem, ThemeConfig } from '../types'

/** Strips the `.html` suffix, a trailing `index` and the hash, so links compare by page. */
export function normalizeLink(link: string): string {
  return (
    link
      .replace(/[?#].*$/, '')
      .replace(/(^|\/)index(\.(md|html))?$/, '$1')
      .replace(/\.(md|html)$/, '') || '/'
  )
}

/** True when `link` names the page at `path` (both may carry `.html` or `index`). */
export function isActive(path: string, link: string | undefined): boolean {
  if (!link || /^[a-z]+:/i.test(link)) return false
  return normalizeLink(path) === normalizeLink(link)
}

/**
 * Picks the sidebar for `path`. A multi-sidebar object is keyed by path prefix;
 * the longest matching key wins, as in VitePress's default theme.
 */
export function resolveSidebar(
  sidebar: ThemeConfig['sidebar'],
  path: string,
): SidebarItem[] {
  if (!sidebar) return []
  if (Array.isArray(sidebar)) return sidebar
  const p = path.startsWith('/') ? path : `/${path}`
  const key = Object.keys(sidebar)
    .filter((k) => p.startsWith(k.startsWith('/') ? k : `/${k}`))
    .sort((a, b) => b.length - a.length)[0]
  return key ? sidebar[key] : []
}

/** Depth-first list of every item with a link, in reading order. */
export function flattenSidebar(items: SidebarItem[]): FlatLink[] {
  const out: FlatLink[] = []
  const walk = (list: SidebarItem[]) => {
    for (const item of list) {
      if (item.link && !/^[a-z]+:/i.test(item.link)) out.push({ text: item.text, link: item.link })
      if (item.items) walk(item.items)
    }
  }
  walk(items)
  return out
}

export function useSidebar() {
  const { theme } = useData<ThemeConfig>()
  const route = useRoute()
  const items = computed(() => resolveSidebar(theme.value.sidebar, route.path))
  const hasSidebar = computed(() => items.value.length > 0)
  return { items, hasSidebar }
}

/** Neighbours of the current page, honouring `prev`/`next` frontmatter overrides. */
export function usePrevNext() {
  const { frontmatter } = useData()
  const route = useRoute()
  const { items } = useSidebar()

  return computed(() => {
    const flat = flattenSidebar(items.value)
    const i = flat.findIndex((l) => isActive(route.path, l.link))
    const pick = (key: 'prev' | 'next', fallback: FlatLink | undefined) => {
      const fm = frontmatter.value[key]
      if (fm === false) return undefined
      if (typeof fm === 'string') return fallback ? { ...fallback, text: fm } : undefined
      if (fm && typeof fm === 'object') return { text: fm.text ?? fallback?.text ?? '', link: fm.link ?? fallback?.link ?? '' }
      return fallback
    }
    return {
      prev: pick('prev', i > 0 ? flat[i - 1] : undefined),
      next: pick('next', i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined),
    }
  })
}
