import min from 'veui/managers/rules/min'
import 'veui/locale/zh-Hans/common'

describe('managers/rules/min', function () {
  this.timeout(10000)

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

  it('should produce validation error message correctly', () => {
    expect(min.message(1, 10)).to.equal('不能小于10')
  })
})
