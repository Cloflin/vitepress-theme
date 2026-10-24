import type { Theme } from 'vitepress'
import Layout from './layout/Layout.vue'
import NotFound from './layout/NotFound.vue'
import './styles/index.css'

export type { NavItem, SidebarItem, SocialLink, ThemeConfig } from './types'
export { default as HoverHighlight } from './components/HoverHighlight.vue'
export { default as ThemeSwitcher } from './components/ThemeSwitcher.vue'
export { searchOpen } from './composables/search'
export { useThemeTransition } from './composables/theme-transition'

const theme: Theme = {
  Layout,
  NotFound,
}

export default theme
