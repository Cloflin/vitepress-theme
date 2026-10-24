<script setup lang="ts">
/**
 * The article column: serif title with prev/next arrows beside it, the
 * description, an optional "Made by" line, then the markdown, then the footer.
 *
 * The title comes from VitePress's page data (frontmatter `title`, else the
 * first `# heading`), so the markdown's own leading h1 is hidden to avoid
 * printing it twice. A page that wants its h1 back sets `title: false`.
 */
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { usePrevNext } from '../composables/sidebar'
import type { ThemeConfig } from '../types'
import TocPopover from './TocPopover.vue'

const { page, frontmatter, theme, lang } = useData<ThemeConfig>()
const nav = usePrevNext()

const showTitle = computed(() => frontmatter.value.title !== false && !!page.value.title)
const description = computed(() => frontmatter.value.description ?? page.value.description)
const author = computed(() => frontmatter.value.author as { name: string; url?: string } | undefined)

const lastUpdated = computed(() => {
  if (!theme.value.lastUpdated || !page.value.lastUpdated) return null
  return new Intl.DateTimeFormat(lang.value, { dateStyle: 'medium' }).format(new Date(page.value.lastUpdated))
})
const editLink = computed(() => {
  const e = theme.value.editLink
  return e ? { url: e.pattern.replace(/:path/g, page.value.filePath), text: e.text ?? 'Edit this page' } : null
})
const prevLabel = computed(() => theme.value.docFooter?.prev ?? 'Previous')
const nextLabel = computed(() => theme.value.docFooter?.next ?? 'Next')
</script>

<template>
  <article class="mx-auto w-full max-w-[860px] pt-10 pb-24 md:pt-12 2xl:max-w-[1124px]">
    <TocPopover />

    <slot name="doc-top" />

    <header v-if="showTitle" class="mt-6 xl:mt-0">
      <div class="flex w-full items-start justify-between gap-2">
        <h1 class="font-serif text-4xl font-light tracking-normal text-foreground sm:text-5xl">
          {{ page.title }}
        </h1>
        <div v-if="nav.prev || nav.next" class="flex shrink-0 items-center gap-1.5 pt-0.5">
          <a
            :href="nav.prev ? withBase(nav.prev.link) : undefined"
            :aria-disabled="!nav.prev"
            :aria-label="nav.prev ? `Go to ${nav.prev.text}` : 'No previous page'"
            :class="[
              'inline-flex size-8 items-center justify-center rounded-md bg-accent text-foreground transition-colors hover:bg-accent/70',
              !nav.prev && 'pointer-events-none opacity-50',
            ]"
          ><ArrowLeft class="size-4" /></a>
          <a
            :href="nav.next ? withBase(nav.next.link) : undefined"
            :aria-disabled="!nav.next"
            :aria-label="nav.next ? `Go to ${nav.next.text}` : 'No next page'"
            :class="[
              'inline-flex size-8 items-center justify-center rounded-md bg-accent text-foreground transition-colors hover:bg-accent/70',
              !nav.next && 'pointer-events-none opacity-50',
            ]"
          ><ArrowRight class="size-4" /></a>
        </div>
      </div>
      <p v-if="description" class="mt-3 mb-1 text-base text-muted-foreground md:text-lg">{{ description }}</p>
      <p v-if="author" class="mb-2.5 text-sm text-muted-foreground italic">
        Made by
        <a
          v-if="author.url"
          :href="author.url"
          target="_blank"
          rel="noreferrer"
          class="font-medium text-foreground underline decoration-primary underline-offset-2 hover:decoration-foreground"
        >{{ author.name }}</a>
        <span v-else class="font-medium text-foreground">{{ author.name }}</span>
      </p>
    </header>

    <slot name="doc-before" />

    <Content :class="['cf-doc pt-4', showTitle && 'cf-doc--titled']" />

    <slot name="doc-after" />

    <footer class="mt-16 flex flex-col gap-6">
      <div v-if="nav.prev || nav.next" class="grid gap-3 sm:grid-cols-2">
        <a
          v-if="nav.prev"
          :href="withBase(nav.prev.link)"
          class="group flex flex-col gap-1 rounded-xl border p-4 text-sm transition-colors hover:bg-accent/40"
        >
          <span class="inline-flex items-center gap-1 text-muted-foreground">
            <ArrowLeft class="size-3.5 transition-transform group-hover:-translate-x-0.5" />{{ prevLabel }}
          </span>
          <span class="font-medium">{{ nav.prev.text }}</span>
        </a>
        <a
          v-if="nav.next"
          :href="withBase(nav.next.link)"
          class="group flex flex-col items-end gap-1 rounded-xl border p-4 text-sm transition-colors hover:bg-accent/40 sm:col-start-2"
        >
          <span class="inline-flex items-center gap-1 text-muted-foreground">
            {{ nextLabel }}<ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span class="font-medium">{{ nav.next.text }}</span>
        </a>
      </div>
      <div v-if="lastUpdated || editLink" class="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <a v-if="editLink" :href="editLink.url" target="_blank" rel="noreferrer" class="hover:text-foreground">{{ editLink.text }}</a>
        <span v-if="lastUpdated">{{ theme.lastUpdated?.text ?? 'Last updated' }}: {{ lastUpdated }}</span>
      </div>
    </footer>
  </article>
</template>

<style>
/* The page title is printed above; drop the markdown's own leading h1. */
.cf-doc--titled > div > h1:first-child {
  display: none;
}
.cf-doc--titled > div > h1:first-child + * {
  margin-top: 0;
}
</style>
