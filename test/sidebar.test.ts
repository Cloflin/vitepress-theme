import { describe, expect, it } from 'vitest'
import { flattenSidebar, isActive, normalizeLink, resolveSidebar } from '../src/composables/sidebar'

describe('normalizeLink', () => {
  it('drops .html, .md, index and the hash', () => {
    expect(normalizeLink('/guide/a.html#x')).toBe('/guide/a')
    expect(normalizeLink('/guide/index.md')).toBe('/guide/')
    expect(normalizeLink('/index.html')).toBe('/')
    expect(normalizeLink('/')).toBe('/')
  })
})

describe('isActive', () => {
  it('matches a page under clean and .html urls', () => {
    expect(isActive('/guide/a.html', '/guide/a')).toBe(true)
    expect(isActive('/guide/a', '/guide/a.md')).toBe(true)
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/guide/', '/guide/index')).toBe(true)
  })
  it('never matches external or missing links', () => {
    expect(isActive('/x', 'https://x.dev/x')).toBe(false)
    expect(isActive('/x', undefined)).toBe(false)
  })
  it('does not treat a prefix as a match', () => {
    expect(isActive('/guide/ab', '/guide/a')).toBe(false)
  })
})

describe('resolveSidebar', () => {
  const multi = { '/guide/': [{ text: 'G' }], '/guide/api/': [{ text: 'API' }], '/': [{ text: 'Root' }] }
  it('picks the longest matching prefix', () => {
    expect(resolveSidebar(multi, '/guide/api/x')[0].text).toBe('API')
    expect(resolveSidebar(multi, '/guide/x')[0].text).toBe('G')
    expect(resolveSidebar(multi, '/other')[0].text).toBe('Root')
  })
  it('returns an array sidebar as is and nothing for none', () => {
    expect(resolveSidebar([{ text: 'A' }], '/x')).toHaveLength(1)
    expect(resolveSidebar(undefined, '/x')).toEqual([])
  })
})

describe('flattenSidebar', () => {
  it('lists linked items depth first and skips external links', () => {
    const flat = flattenSidebar([
      { text: 'G', items: [{ text: 'a', link: '/a' }, { text: 'Sub', items: [{ text: 'b', link: '/b' }] }] },
      { text: 'ext', link: 'https://x.dev' },
      { text: 'c', link: '/c' },
    ])
    expect(flat.map((l) => l.link)).toEqual(['/a', '/b', '/c'])
  })
})
