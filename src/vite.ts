import tailwindcss from '@tailwindcss/vite'
import type { PluginOption } from 'vite'

/**
 * Vite plugins the theme needs in the consuming site's `vite.plugins`:
 *
 * - Tailwind, which compiles the theme's stylesheet (the package ships its
 *   source, not a prebuilt CSS file, so a site's own Tailwind classes and the
 *   theme's share one build);
 * - `ssr.noExternal` for the theme and its Vue-component dependencies, since
 *   VitePress would otherwise hand the raw `.vue` files to Node during SSR.
 */
export function cloflinTheme(): PluginOption[] {
  return [
    tailwindcss(),
    {
      name: 'cloflin-vitepress-theme',
      config: () => ({
        ssr: { noExternal: ['@cloflin/vitepress-theme', 'motion-v', 'reka-ui'] },
      }),
    },
  ]
}
