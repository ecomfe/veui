import { is, sign, isPositive } from '@/utils/math'

describe('utils/math', () => {
  it('should calculate equality correctly and distinguish -0 vs +0', () => {
    expect(is(1, 0)).to.be.equal(false)
    expect(is(-1, -0)).to.be.equal(false)
    expect(is(-1, 0)).to.be.equal(false)
    expect(is(1, -0)).to.be.equal(false)
    expect(is(1, 1)).to.equal(true)
    expect(is(0, 0)).to.equal(true)
    expect(is(-0, -0)).to.equal(true)
    expect(is(-0, 0)).to.be.equal(false)
    expect(is(0, -0)).to.be.equal(false)
    expect(is(Infinity, Infinity)).to.equal(true)
    expect(is(NaN, NaN)).to.be.equal(false)
  })

  it('should calculate sign function correctly', () => {
    expect(sign(-Infinity)).to.be.equal(-1)
    expect(sign(-2)).to.be.equal(-1)
    expect(sign(-1)).to.be.equal(-1)
    expect(sign(-0)).to.be.equal(0)
    expect(sign(0)).to.be.equal(0)
    expect(sign(1)).to.be.equal(1)
    expect(sign(2)).to.be.equal(1)
    expect(sign(Infinity)).to.be.equal(1)
  })

  it('should identify positive values as expected', () => {
    expect(isPositive(Infinity)).to.equal(true)
    expect(isPositive(1)).to.equal(true)
    expect(isPositive(0)).to.equal(true)
    expect(isPositive(-0)).to.be.equal(false)
    expect(isPositive(-1)).to.be.equal(false)
    expect(isPositive(-Infinity)).to.be.equal(false)
  })
})
