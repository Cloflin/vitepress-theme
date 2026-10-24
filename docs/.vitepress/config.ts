import { defineConfig } from 'vitepress'
import type { ThemeConfig } from '../../src/types.ts'
import { cloflinTheme } from '../../src/vite.ts'

const code = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>'
const blocks = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>'

export default defineConfig<ThemeConfig>({
  title: 'Cloflin Theme',
  description: 'An animated VitePress theme.',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    plugins: [cloflinTheme()],
  },
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/', activeMatch: '^/(guide/)?$|^/guide/' },
      { text: 'Components', link: '/components/' },
      { text: 'Changelog', link: '/changelog' },
    ],
    navCta: { text: 'Get started', link: '/guide/installation' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Cloflin/vitepress-theme' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@cloflin/vitepress-theme' },
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    lastUpdated: { text: 'Last updated' },
    sidebar: [
      {
        text: 'Guide',
        icon: code,
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Markdown', link: '/guide/markdown' },
          { text: 'Changelog', link: '/changelog', badge: 'new' },
          { text: 'Credits', link: '/guide/credits' },
        ],
      },
      {
        text: 'Registry',
        icon: blocks,
        items: [{ text: 'Components', link: '/components/' }],
      },
    ],
  },
})
