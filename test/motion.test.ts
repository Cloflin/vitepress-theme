import { afterEach, describe, expect, it, vi } from 'vitest'
import { REDUCED_MOTION, shouldReduceMotion } from '../src/composables/motion'

const prefersReduced = (matches: boolean) =>
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches } as MediaQueryList)

describe('shouldReduceMotion', () => {
  afterEach(() => vi.restoreAllMocks())

  it("'on' animates even when the OS asks for reduced motion", () => {
    prefersReduced(true)
    expect(shouldReduceMotion('on')).toBe(false)
  })
  it("'off' never animates", () => {
    prefersReduced(false)
    expect(shouldReduceMotion('off')).toBe(true)
  })
  it("'system' follows the OS", () => {
    prefersReduced(true)
    expect(shouldReduceMotion('system')).toBe(true)
    vi.restoreAllMocks()
    prefersReduced(false)
    expect(shouldReduceMotion('system')).toBe(false)
  })
})

describe('REDUCED_MOTION', () => {
  it('maps each mode onto MotionConfig', () => {
    expect(REDUCED_MOTION).toEqual({ on: 'never', system: 'user', off: 'always' })
  })
})
