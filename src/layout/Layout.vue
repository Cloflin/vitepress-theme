<script setup lang="ts">
/**
 * Page frame. A fixed 64px navbar over a centred row, at most 1670px wide:
 * sidebar (286px, from `md`), article, table of contents (286px, from `xl`).
 *
 * Frontmatter `layout` picks the body: `doc` (default) gets the full frame,
 * `page` keeps the navbar but drops sidebar and contents, and `home` hands the
 * whole area below the navbar to the `home` slot (falling back to the page's
 * markdown).
 *
 * Slots, for a site or a plugin to fill: `layout-top`, `layout-bottom`,
 * `nav-bar-content-before`, `nav-bar-content-after`, `sidebar-nav-before`,
 * `sidebar-nav-after`, `doc-top`, `doc-before`, `doc-after`, `aside-top`,
 * `aside-bottom`, `home`, `not-found`.
 */
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { MotionConfig } from 'motion-v'
import { useScrollLock } from '@vueuse/core'
import { useSidebar } from '../composables/sidebar'
import { useSearchHotkey, useThemeHotkey } from '../composables/search'
import { useThemeTransition } from '../composables/theme-transition'
import NavBar from './NavBar.vue'
import Sidebar from './Sidebar.vue'
import DocPage from './DocPage.vue'
import Toc from './Toc.vue'
import TopShadow from './TopShadow.vue'
import MobileMenu from './MobileMenu.vue'
import NotFound from './NotFound.vue'

// Behind VitePress's compile-time flag: with local search off the dialog, and
// the `@localSearchIndex` module it imports, drop out of the bundle.
const SearchDialog = __VP_LOCAL_SEARCH__
  ? defineAsyncComponent(() => import('../components/SearchDialog.vue'))
  : () => null

const { frontmatter, page } = useData()
const route = useRoute()
const { hasSidebar } = useSidebar()
const { toggle } = useThemeTransition()

useSearchHotkey()
useThemeHotkey(toggle)

const layout = computed(() => (page.value.isNotFound ? '404' : (frontmatter.value.layout ?? 'doc')))
const showSidebar = computed(() => layout.value === 'doc' && hasSidebar.value && frontmatter.value.sidebar !== false)
const showAside = computed(() => layout.value === 'doc' && frontmatter.value.aside !== false)

const menuOpen = ref(false)
const scrollLock = useScrollLock(typeof window !== 'undefined' ? document.body : null)
watch(menuOpen, (open) => (scrollLock.value = open))
watch(() => route.path, () => (menuOpen.value = false))
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div class="cf-layout relative flex min-h-screen flex-col">
      <slot name="layout-top" />
      <TopShadow />

      <NavBar :has-sidebar="showSidebar" :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen">
        <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
        <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
      </NavBar>

      <MobileMenu v-if="menuOpen" :show-sidebar="showSidebar" />

      <div v-if="layout === 'home'" class="pt-16">
        <slot name="home"><Content /></slot>
      </div>

      <div v-else-if="layout === '404'" class="pt-16">
        <slot name="not-found"><NotFound /></slot>
      </div>

      <div v-else class="relative mx-auto flex w-full max-w-[1670px] flex-1 pt-16">
        <aside v-if="showSidebar" class="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[286px] shrink-0 md:block">
          <div data-sidebar-viewport class="h-full overflow-y-auto pt-4 pr-2 pl-6 [scrollbar-width:none]">
            <Sidebar>
              <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>
              <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
            </Sidebar>
          </div>
        </aside>

        <main class="min-w-0 flex-1 px-4 md:px-8 xl:px-12">
          <DocPage v-if="layout === 'doc'">
            <template #doc-top><slot name="doc-top" /></template>
            <template #doc-before><slot name="doc-before" /></template>
            <template #doc-after><slot name="doc-after" /></template>
          </DocPage>
          <Content v-else class="cf-doc mx-auto max-w-[1124px] pt-12 pb-24" />
        </main>

        <aside v-if="showAside" class="sticky top-16 hidden h-[calc(100dvh-4rem)] w-[286px] shrink-0 xl:block">
          <div class="h-full overflow-y-auto pt-10 pr-6 pb-18 [scrollbar-width:none]">
            <slot name="aside-top" />
            <Toc />
            <slot name="aside-bottom" />
          </div>
        </aside>
      </div>

      <slot name="layout-bottom" />
      <SearchDialog />
    </div>
  </MotionConfig>
</template>
