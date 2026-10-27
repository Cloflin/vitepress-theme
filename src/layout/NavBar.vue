<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { motion } from 'motion-v'
import { Menu, Search, X } from '@lucide/vue'
import HoverHighlight from '../components/HoverHighlight.vue'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import { searchOpen } from '../composables/search'
import { normalizeLink } from '../composables/sidebar'
import { SOCIAL_ICONS } from '../icons/social'
import type { NavItem, ThemeConfig } from '../types'

defineProps<{ hasSidebar: boolean; menuOpen: boolean }>()
defineEmits<{ toggleMenu: [] }>()

const { site, theme } = useData<ThemeConfig>()
const route = useRoute()

const title = computed(() => (theme.value.siteTitle === false ? '' : (theme.value.siteTitle ?? site.value.title)))
const logo = computed(() => {
  const l = theme.value.logo
  if (!l) return null
  return typeof l === 'string' ? { light: l, dark: l } : l
})
const hasSearch = computed(() => theme.value.search?.provider === 'local')

const isExternal = (link: string) => /^[a-z]+:/i.test(link)
function isNavActive(item: NavItem) {
  if (isExternal(item.link)) return false
  const path = normalizeLink(route.path)
  if (item.activeMatch) return new RegExp(item.activeMatch).test(route.path)
  const link = normalizeLink(item.link)
  return link === '/' ? path === '/' : path.startsWith(link)
}
const href = (link: string) => (isExternal(link) ? link : withBase(link))
const svg = (icon: string | { svg: string }) => (typeof icon === 'string' ? SOCIAL_ICONS[icon] ?? '' : icon.svg)
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
</script>

<template>
  <motion.header
    class="fixed inset-x-0 top-0 z-50 flex h-16 w-full items-center gap-4 px-4 md:px-6"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{ duration: 0.4, ease: 'easeOut' }"
  >
    <div class="cf-navbar-blur" aria-hidden="true"><div v-for="i in 8" :key="i" /></div>
    <HoverHighlight class="flex flex-1 items-center gap-1">
      <a
        :href="withBase('/')"
        data-highlight
        class="relative z-10 flex items-center gap-2 rounded-md p-2 font-medium text-foreground"
        :aria-label="title || 'Home'"
      >
        <template v-if="logo">
          <img :src="withBase(logo.light)" alt="" class="h-6 w-auto dark:hidden" />
          <img :src="withBase(logo.dark)" alt="" class="hidden h-6 w-auto dark:block" />
        </template>
        <span v-if="title" class="text-[15px] tracking-tight">{{ title }}</span>
      </a>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
        <a
          v-for="item in theme.nav"
          :key="item.link"
          :href="href(item.link)"
          :target="isExternal(item.link) ? '_blank' : undefined"
          :rel="isExternal(item.link) ? 'noreferrer' : undefined"
          data-highlight
          :class="[
            'relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            isNavActive(item) ? 'text-foreground' : 'text-foreground/80 hover:text-foreground',
          ]"
        >{{ item.text }}</a>
      </nav>
      <slot name="nav-bar-content-before" />
    </HoverHighlight>

    <div class="flex items-center gap-1.5 md:gap-3">
      <button
        v-if="hasSearch"
        type="button"
        class="inline-flex h-8 items-center gap-2 rounded-md border bg-surface pr-1.5 pl-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground max-md:size-8 max-md:justify-center max-md:border-0 max-md:bg-transparent max-md:p-0"
        aria-label="Search"
        @click="searchOpen = true"
      >
        <Search class="size-4" />
        <span class="hidden pr-6 md:inline">Search…</span>
        <kbd class="hidden rounded border bg-background px-1.5 font-mono text-[11px] md:inline">{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
      </button>

      <slot name="nav-bar-content-after" />

      <div v-if="theme.socialLinks?.length" class="hidden items-center gap-1 md:flex">
        <a
          v-for="s in theme.socialLinks"
          :key="s.link"
          :href="s.link"
          target="_blank"
          rel="noreferrer"
          :aria-label="s.ariaLabel ?? (typeof s.icon === 'string' ? s.icon : 'link')"
          class="inline-flex size-8 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true" v-html="svg(s.icon)" />
        </a>
      </div>

      <span class="max-md:hidden"><ThemeSwitcher /></span>

      <a
        v-if="theme.navCta"
        :href="href(theme.navCta.link)"
        class="hidden h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
      >{{ theme.navCta.text }}</a>

      <button
        v-if="hasSidebar || theme.nav?.length"
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground md:hidden"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="menuOpen"
        @click="$emit('toggleMenu')"
      >
        <X v-if="menuOpen" class="size-5" />
        <Menu v-else class="size-5" />
      </button>
    </div>
  </motion.header>
</template>
