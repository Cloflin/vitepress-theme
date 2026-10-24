# @cloflin/vitepress-theme

An animated VitePress theme, adapted from [unlumen UI Docs](https://github.com/leovvx/unlumen-ui-docs).

- A sidebar whose ruler stretches under the pointer, with an accent bar that springs to the active page.
- A table of contents whose thumb follows the current section.
- Command-menu search over VitePress local search (<kbd>⌘K</kbd>, <kbd>/</kbd>).
- A theme switch that reveals the new appearance in a circle from the click (<kbd>D</kbd>).
- Animations are on by default; `themeConfig.motion` can make them follow the OS setting (`'system'`) or turn them off (`'off'`).

## Install

```sh
npm i -D @cloflin/vitepress-theme
```

```ts
// .vitepress/theme/index.ts
import Theme from '@cloflin/vitepress-theme'
export default Theme
```

```ts
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { cloflinTheme } from '@cloflin/vitepress-theme/vite'

export default defineConfig({
  vite: { plugins: [cloflinTheme()] },
  themeConfig: { search: { provider: 'local' } },
})
```

See `docs/guide/configuration.md` for every `themeConfig` field.

## Develop

```sh
npm run docs:dev   # demo site on the theme's own source
npm run verify     # typecheck, tests, docs build
```

## Licence

MIT. Portions are Vue ports of unlumen UI Docs (MIT, © 2026 Léo Wicki); see `NOTICE`.
