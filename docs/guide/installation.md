---
description: Install the theme and point VitePress at it.
---

# Installation

::: info Note
The theme targets VitePress 2. It ships its Vue and CSS sources; your site's Vite build compiles them.
:::

## Install the package

::: code-group

```sh [pnpm]
pnpm add -D @cloflin/vitepress-theme
```

```sh [npm]
npm i -D @cloflin/vitepress-theme
```

```sh [yarn]
yarn add -D @cloflin/vitepress-theme
```

```sh [bun]
bun add -d @cloflin/vitepress-theme
```

:::

## Register the theme

Create `.vitepress/theme/index.ts` and re-export the theme:

```ts [.vitepress/theme/index.ts]
import Theme from '@cloflin/vitepress-theme'

export default Theme
```

## Add the Vite plugins

The theme's styles are compiled by Tailwind in your build. Add the plugin bundle to your config:

```ts [.vitepress/config.ts]
import { defineConfig } from 'vitepress'
import { cloflinTheme } from '@cloflin/vitepress-theme/vite' // [!code ++]

export default defineConfig({
  vite: {
    plugins: [cloflinTheme()], // [!code ++]
  },
})
```

## Extend the theme

To add your own components, extend it like any VitePress theme:

```ts
import Theme from '@cloflin/vitepress-theme'
import type { Theme as T } from 'vitepress'
import MyBanner from './MyBanner.vue'

export default {
  extends: Theme,
  enhanceApp({ app }) {
    app.component('MyBanner', MyBanner)
  },
} satisfies T
```
