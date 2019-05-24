import min from 'veui/managers/rules/min'

describe('managers/rules/min', () => {
  it('should allow empty values', () => {
    expect(min.validate(null)).to.equal(true)
    expect(min.validate(undefined)).to.equal(true)
    expect(min.validate('')).to.equal(true)
    expect(min.validate([])).to.equal(true)
  })

  it('should compare numbers correctly', () => {
    expect(min.validate(3, 2)).to.equal(true)
    expect(min.validate(-3, -2)).to.equal(false)
    expect(min.validate(0.3, 0.2)).to.equal(true)
  })
})
