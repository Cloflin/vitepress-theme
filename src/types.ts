/**
 * `themeConfig` for @cloflin/vitepress-theme.
 *
 * The shapes deliberately follow VitePress's default theme where they overlap
 * (`nav`, `sidebar`, `socialLinks`, `outline`, `search`), so a site moving over
 * keeps its config and only gains the fields below that have no default-theme
 * equivalent (`navCta`, item `badge`, group `icon`).
 */
export interface ThemeConfig {
  /** Logo image path, or one image per appearance. */
  logo?: string | { light: string; dark: string }
  /** Text beside the logo. `false` hides it; defaults to the site title. */
  siteTitle?: string | false
  /** Top navigation, left side after the logo. */
  nav?: NavItem[]
  /** A single filled button at the right end of the navbar (Unlumen's "Login"). */
  navCta?: NavItem
  socialLinks?: SocialLink[]
  sidebar?: SidebarItem[] | Record<string, SidebarItem[]>
  outline?: { label?: string; level?: [number, number] }
  search?: { provider: 'local'; options?: { placeholder?: string } }
  docFooter?: { prev?: string | false; next?: string | false }
  /** Shown in the page footer when the page has `lastUpdated` data. */
  lastUpdated?: { text?: string }
  editLink?: { pattern: string; text?: string }
  footer?: { message?: string; copyright?: string }
}

export interface NavItem {
  text: string
  link: string
  /** Extra path prefixes that mark this item active, e.g. `['/guide/']`. */
  activeMatch?: string
}

export interface SocialLink {
  icon: 'github' | 'x' | 'discord' | 'npm' | 'bluesky' | { svg: string }
  link: string
  ariaLabel?: string
}

export interface SidebarItem {
  text: string
  link?: string
  /** A group when present: the item renders as a heading over these links. */
  items?: SidebarItem[]
  /** Raw SVG markup shown before a group heading. */
  icon?: string
  /** `'new'` renders the accent dot; any other string renders a pill. */
  badge?: 'new' | string
}

/** One entry of the flat, ordered page list that prev/next walks. */
export interface FlatLink {
  text: string
  link: string
}

export interface TocHeader {
  level: number
  title: string
  link: string
}
