import { includes, merge } from '@/utils/range'

describe('utils/range', () => {
  it('should calculate includes correctly', () => {
    expect(includes([0, 0], 0)).to.equal(true)
    expect(includes([0, 0], 1)).to.equal(false)
    expect(includes([0, 1], 0)).to.equal(true)
    expect(includes([0, 1], 1)).to.equal(true)
    expect(includes([1, 1], 0)).to.equal(false)
    expect(includes([1, 1], 1)).to.equal(true)
    expect(includes([0, 10], -1)).to.equal(false)
    expect(includes([0, 10], 5)).to.equal(true)
    expect(includes([0, 10], 11)).to.equal(false)
  })

  it('should calculate range merge as expected', () => {
    expect(merge([0, 5], [1, 1])).to.deep.equal([[0, 0], [2, 5]])
    expect(merge([0, 5], [0, 0])).to.deep.equal([[1, 5]])
  })
})
