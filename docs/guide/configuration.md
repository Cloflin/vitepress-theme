---
description: Every field the theme reads from themeConfig.
---

# Configuration

The theme reads `themeConfig` in the same shape as VitePress's default theme wherever the two overlap, so an existing config keeps working.

## Navigation

`nav` lists the links after the logo. Each item can set `activeMatch`, a regular expression tested against the path.

```ts
nav: [
  { text: 'Docs', link: '/' },
  { text: 'Components', link: '/components/' },
]
```

### Call to action

`navCta` adds one filled button at the right end of the navbar.

## Sidebar

`sidebar` is an array of groups, or an object of arrays keyed by path prefix.

### Groups

A top-level item with `items` is a group. It renders a muted heading, with `icon` (raw SVG) before it.

### Badges

`badge: 'new'` puts the accent dot after a link. Any other string renders a small pill.

## Search

Set `search: { provider: 'local' }`. VitePress builds the index; the theme supplies the command menu.

## Outline

`outline.level` picks which heading levels appear in the table of contents. The default is `[2, 3]`. A page can override it with `outline` in its frontmatter, or hide it with `aside: false`.

## Appearance

Override `--cf-accent` to re-brand links, the active sidebar bar, list markers and the "new" dot:

```css
:root {
  --cf-accent: #476be3;
}
```

## Motion

`motion` decides when the theme animates:

| Value            | Behaviour                                                    |
| ---------------- | ------------------------------------------------------------ |
| `'on'` (default) | Always animates, even when the OS asks for reduced motion    |
| `'system'`       | Follows the reader's "Reduce motion" setting                 |
| `'off'`          | Never animates                                               |

```ts
themeConfig: {
  motion: 'system',
}
```

## Frontmatter

| Key           | Effect                                          |
| ------------- | ----------------------------------------------- |
| `title`       | Page title; `false` keeps the markdown's own h1 |
| `description` | Muted line under the title                      |
| `author`      | `{ name, url }`, rendered as "Made by"          |
| `layout`      | `doc`, `page` or `home`                         |
| `sidebar`     | `false` hides the sidebar                       |
| `aside`       | `false` hides the table of contents             |
| `prev`/`next` | Override or hide the neighbour links            |
