import numeric from 'veui/managers/rules/numeric'

describe('managers/rules/numeric', () => {
  it('should allow empty values.', () => {
    expect(numeric.validate(null)).toBe(true)
    expect(numeric.validate(undefined)).toBe(true)
    expect(numeric.validate('')).toBe(true)
    expect(numeric.validate([])).toBe(true)
  })

  it('should allow numbers.', () => {
    expect(numeric.validate(2)).toBe(true)
    expect(numeric.validate(-2)).toBe(true)
    expect(numeric.validate(0e3)).toBe(true)
  })

  it('should allow strings that are like Number.', () => {
    expect(numeric.validate('2')).toBe(true)
    expect(numeric.validate('0.2')).toBe(true)
    expect(numeric.validate('.2')).toBe(true)
  })

  it('should not allow strings that start with illegal zeros.', () => {
    expect(numeric.validate('00.2')).toBe(false)
  })
})
