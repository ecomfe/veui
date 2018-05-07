import { is, sign, isPositive } from '@/utils/math'

describe('utils/math', () => {
  it('should calculate equality correctly and distinguish -0 vs +0', () => {
    expect(is(1, 0)).toBe(false)
    expect(is(-1, -0)).toBe(false)
    expect(is(-1, 0)).toBe(false)
    expect(is(1, -0)).toBe(false)
    expect(is(1, 1)).toBe(true)
    expect(is(0, 0)).toBe(true)
    expect(is(-0, -0)).toBe(true)
    expect(is(-0, 0)).toBe(false)
    expect(is(0, -0)).toBe(false)
    expect(is(Infinity, Infinity)).toBe(true)
    expect(is(NaN, NaN)).toBe(false)
  })

  it('should calculate sign function correctly', () => {
    expect(sign(-Infinity)).toBe(-1)
    expect(sign(-2)).toBe(-1)
    expect(sign(-1)).toBe(-1)
    expect(sign(-0)).toBe(0)
    expect(sign(0)).toBe(0)
    expect(sign(1)).toBe(1)
    expect(sign(2)).toBe(1)
    expect(sign(Infinity)).toBe(1)
  })

  it('should identify positive values as expected', () => {
    expect(isPositive(Infinity)).toBe(true)
    expect(isPositive(1)).toBe(true)
    expect(isPositive(0)).toBe(true)
    expect(isPositive(-0)).toBe(false)
    expect(isPositive(-1)).toBe(false)
    expect(isPositive(-Infinity)).toBe(false)
  })
})
