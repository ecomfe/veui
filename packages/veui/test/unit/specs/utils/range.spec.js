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

  it('should calculate range difference correctly', () => {
    expect(merge([], [[1, 1]])).toEqual([[1, 1]])
    expect(merge([0, 5], [1, 1])).toEqual([[0, 0], [2, 5]])
    expect(merge([[0, 5]], [[1, 1]])).toEqual([[0, 0], [2, 5]])
    expect(merge([[0, 5]], [[0, 0]])).toEqual([[1, 5]])
    expect(merge([[0, 0]], [[2, 2]])).toEqual([[0, 0], [2, 2]])
    expect(merge([[0, 1], [4, 8]], [[1, 6]])).toEqual([[0, 0], [2, 3], [7, 8]])
    expect(merge([[0, 1], [4, 8]], [[1, 2], [4, 8]])).toEqual([[0, 0], [2, 2]])
    expect(merge([[0, 1], [5, 7]], [[3, 4], [6, 8]])).toEqual([[0, 1], [3, 5], [8, 8]])
  })

  it('should calculate range union correctly', () => {
    expect(merge([], [[1, 1]], { mode: 'union' })).toEqual([[1, 1]])
    expect(merge([0, 5], [1, 1], { mode: 'union' })).toEqual([[0, 5]])
    expect(merge([[0, 5]], [[1, 1]], { mode: 'union' })).toEqual([[0, 5]])
    expect(merge([[0, 5]], [[0, 0]], { mode: 'union' })).toEqual([[0, 5]])
    expect(merge([[0, 0]], [[2, 2]], { mode: 'union' })).toEqual([[0, 0], [2, 2]])
    expect(merge([[0, 1], [4, 8]], [[1, 6]], { mode: 'union' })).toEqual([[0, 8]])
    expect(merge([[0, 1], [4, 8]], [[1, 2], [4, 8]], { mode: 'union' })).toEqual([[0, 2], [4, 8]])
    expect(merge([[0, 1], [5, 7]], [[3, 4], [6, 8]], { mode: 'union' })).toEqual([[0, 1], [3, 8]])
  })

  it('should calculate range relative complement correctly', () => {
    expect(merge([], [[1, 1]], { mode: 'substract' })).toEqual([])
    expect(merge([0, 5], [1, 1], { mode: 'substract' })).toEqual([[0, 0], [2, 5]])
    expect(merge([[0, 5]], [[1, 1]], { mode: 'substract' })).toEqual([[0, 0], [2, 5]])
    expect(merge([[0, 5]], [[0, 0]], { mode: 'substract' })).toEqual([[1, 5]])
    expect(merge([[0, 0]], [[2, 2]], { mode: 'substract' })).toEqual([[0, 0]])
    expect(merge([[0, 1], [4, 8]], [[1, 6]], { mode: 'substract' })).toEqual([[0, 0], [7, 8]])
    expect(merge([[0, 1], [4, 8]], [[1, 2], [4, 8]], { mode: 'substract' })).toEqual([[0, 0]])
    expect(merge([[0, 1], [5, 7]], [[3, 4], [6, 8]], { mode: 'substract' })).toEqual([[0, 1], [5, 5]])
  })
})
