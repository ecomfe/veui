import numeric from 'veui/managers/rules/numeric'

describe('managers/rules/numeric', () => {
  it('should allow empty values.', () => {
    expect(numeric.validate(null)).to.equal(true)
    expect(numeric.validate(undefined)).to.equal(true)
    expect(numeric.validate('')).to.equal(true)
    expect(numeric.validate([])).to.equal(true)
  })

  it('should allow numbers.', () => {
    expect(numeric.validate(2)).to.equal(true)
    expect(numeric.validate(-2)).to.equal(true)
    expect(numeric.validate(0e3)).to.equal(true)
  })

  it('should allow strings that are like Number.', () => {
    expect(numeric.validate('2')).to.equal(true)
    expect(numeric.validate('0.2')).to.equal(true)
    expect(numeric.validate('.2')).to.equal(true)
    expect(numeric.validate('0')).to.equal(true)
  })

  it('should not allow strings that start with illegal zeros.', () => {
    expect(numeric.validate('00.2')).to.equal(false)
    expect(numeric.validate('00')).to.equal(false)
    expect(numeric.validate('00.0')).to.equal(false)
    expect(numeric.validate('020')).to.equal(false)
  })

  it('should not allow strings that can not convert to Number', () => {
    expect(numeric.validate('aa')).to.equal(false)
    expect(numeric.validate('0|1')).to.equal(false)
    expect(numeric.validate('{0}')).to.equal(false)
  })
})
