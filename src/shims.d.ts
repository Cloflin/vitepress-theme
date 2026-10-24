declare module '@localSearchIndex' {
  const data: Record<string, () => Promise<{ default: string }>>
  export default data
}

/** Defined by VitePress: true when `themeConfig.search.provider` is `'local'`. */
declare const __VP_LOCAL_SEARCH__: boolean
