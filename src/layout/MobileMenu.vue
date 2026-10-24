<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { motion } from 'motion-v'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import { SOCIAL_ICONS } from '../icons/social'
import type { ThemeConfig } from '../types'
import Sidebar from './Sidebar.vue'

defineProps<{ showSidebar: boolean }>()

const { theme } = useData<ThemeConfig>()
const isExternal = (link: string) => /^[a-z]+:/i.test(link)
const svg = (icon: string | { svg: string }) => (typeof icon === 'string' ? SOCIAL_ICONS[icon] ?? '' : icon.svg)
</script>

<template>
  <motion.div
    class="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-background px-6 pt-4 md:hidden"
    data-sidebar-viewport
    :initial="{ opacity: 0, y: -8 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.2, ease: 'easeOut' }"
  >
    <nav v-if="theme.nav?.length" class="mb-6 flex flex-col gap-1 border-b pb-4" aria-label="Main">
      <a
        v-for="item in theme.nav"
        :key="item.link"
        :href="isExternal(item.link) ? item.link : withBase(item.link)"
        class="rounded-md py-2 text-base font-medium"
      >{{ item.text }}</a>
    </nav>

    <Sidebar v-if="showSidebar" scope="mobile" />

    <div class="mt-auto flex items-center justify-between border-t py-3">
      <div class="flex items-center gap-1">
        <a
          v-for="s in theme.socialLinks"
          :key="s.link"
          :href="s.link"
          target="_blank"
          rel="noreferrer"
          :aria-label="s.ariaLabel ?? (typeof s.icon === 'string' ? s.icon : 'link')"
          class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground"
        >
          <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true" v-html="svg(s.icon)" />
        </a>
      </div>
      <ThemeSwitcher />
    </div>
  </motion.div>
</template>
