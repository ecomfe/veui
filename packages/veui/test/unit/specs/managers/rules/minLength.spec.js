import minLength from 'veui/managers/rules/minLength'

describe('managers/rules/minLength', () => {
  it('should allow empty values', () => {
    expect(minLength.validate(null)).to.equal(true)
    expect(minLength.validate(undefined)).to.equal(true)
    expect(minLength.validate('')).to.equal(true)
    expect(minLength.validate([])).to.equal(true)
  })

  it('should compare string/array length correctly', () => {
    expect(minLength.validate('abc', 3)).to.equal(true)
    expect(minLength.validate('abc', 4)).to.equal(false)
    expect(minLength.validate([1, 2, 3], 3)).to.equal(true)
    expect(minLength.validate([1, 2, 3], 4)).to.equal(false)
  })
})
