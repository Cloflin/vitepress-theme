---
description: How the theme styles VitePress's markdown extensions.
author:
  name: Cloflin
  url: https://github.com/Cloflin
---

# Markdown

## Callouts

::: tip
A tip, for a shortcut the reader may not know.
:::

::: warning
A warning, for something that can go wrong.
:::

::: danger
Danger, for something that loses data.
:::

::: details Click to expand
Details stay folded until opened.
:::

## Code

Inline `code` sits on a soft tint. Blocks get a filename, highlighting and diffs:

```ts{2} [example.ts]
const greeting = 'hello'
console.log(greeting) // highlighted
```

## Lists

1. Ordered items use the accent for their markers.
2. So do unordered ones.

- One
- Two
  - Nested

## Tables

| Prop    | Type     | Default |
| ------- | -------- | ------- |
| `speed` | `number` | `50`    |
| `delay` | `number` | `0`     |

## Quotes

> A quote is set in italics, behind a hairline.
