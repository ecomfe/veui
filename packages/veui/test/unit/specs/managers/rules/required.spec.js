import required from 'veui/managers/rules/required'

describe('managers/rules/required', () => {
  it('should validate empty value correctly', () => {
    expect(required.validate(null)).to.equal(false)
    expect(required.validate(undefined)).to.equal(false)
    expect(required.validate('')).to.equal(false)
    expect(required.validate([])).to.equal(false)
    expect(required.validate({})).to.equal(true)
    expect(required.validate(1)).to.equal(true)
    expect(required.validate('a')).to.equal(true)
    expect(required.validate([1])).to.equal(true)
  })
})
