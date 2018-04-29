import { includes, merge } from '@/utils/range'

describe('utils/range', () => {
  it('should calculate includes correctly', () => {
    expect(includes([0, 0], 0)).toBe(true)
    expect(includes([0, 0], 1)).toBe(false)
    expect(includes([0, 1], 0)).toBe(true)
    expect(includes([0, 1], 1)).toBe(true)
    expect(includes([1, 1], 0)).toBe(false)
    expect(includes([1, 1], 1)).toBe(true)
    expect(includes([0, 10], -1)).toBe(false)
    expect(includes([0, 10], 5)).toBe(true)
    expect(includes([0, 10], 11)).toBe(false)
  })

  it('should calculate range merge as expected', () => {
    expect(merge([0, 5], [1, 1])).toEqual([[0, 0], [2, 5]])
    expect(merge([0, 5], [0, 0])).toEqual([[1, 5]])
  })
})
