import pattern from 'veui/managers/rules/pattern'

describe('managers/rules/pattern', () => {
  it('should match string RegExp correctly', () => {
    expect(pattern.validate('abc', '\\w+')).to.equal(true)
    expect(pattern.validate(' ', '\\w+')).to.equal(false)
  })

  it('should match RegExp correctly', () => {
    expect(pattern.validate(10, /\d+/)).to.equal(true)
    expect(pattern.validate('abc', /\d+/)).to.equal(false)
  })
})
