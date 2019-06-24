import max from 'veui/managers/rules/max'

describe('managers/rules/max', () => {
  it('should allow empty values', () => {
    expect(max.validate(null)).to.equal(true)
    expect(max.validate(undefined)).to.equal(true)
    expect(max.validate('')).to.equal(true)
    expect(max.validate([])).to.equal(true)
  })

  it('should compare numbers correctly', () => {
    expect(max.validate(3, 2)).to.equal(false)
    expect(max.validate(-3, -2)).to.equal(true)
    expect(max.validate(0.3, 0.2)).to.equal(false)
  })
})
