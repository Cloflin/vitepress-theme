import { describe, expect, it } from 'vitest'
import { activeHeading, readHeaders } from '../src/composables/toc'

describe('activeHeading', () => {
  const tops = [100, 500, 600, 1500]
  it('is the last heading above the line', () => {
    expect(activeHeading(tops, 650, false)).toBe(2)
    expect(activeHeading(tops, 500, false)).toBe(1)
  })
  it('is the first heading before any is reached', () => {
    expect(activeHeading(tops, 50, false)).toBe(0)
  })
  it('is the last heading at the end of the page', () => {
    expect(activeHeading(tops, 700, true)).toBe(3)
  })
  it('is -1 with no headings', () => {
    expect(activeHeading([], 0, false)).toBe(-1)
  })
})

describe('readHeaders', () => {
  it('reads levels in range, strips the anchor and skips ignored headings', () => {
    document.body.innerHTML = `
      <div id="root">
        <h1 id="t">Title</h1>
        <h2 id="a">Alpha <a class="header-anchor" href="#a">#</a></h2>
        <h3 id="b">Beta</h3>
        <h4 id="c">Gamma</h4>
        <h2 id="d" class="ignore-header">Hidden</h2>
      </div>`
    // happy-dom has no layout; give every heading an offsetParent.
    for (const el of document.querySelectorAll('h1,h2,h3,h4')) Object.defineProperty(el, 'offsetParent', { value: document.body })
    const headers = readHeaders(document.getElementById('root')!, [2, 3])
    expect(headers).toEqual([
      { level: 2, link: '#a', title: 'Alpha' },
      { level: 3, link: '#b', title: 'Beta' },
    ])
  })
})
