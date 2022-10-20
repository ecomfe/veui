import maxLength from 'veui/managers/rules/maxLength'
import 'veui/locale/zh-Hans/common'

describe('managers/rules/maxLength', function () {
  this.timeout(10000)

  it('should allow empty values', () => {
    expect(maxLength.validate(null)).to.equal(true)
    expect(maxLength.validate(undefined)).to.equal(true)
    expect(maxLength.validate('')).to.equal(true)
    expect(maxLength.validate([])).to.equal(true)
  })

  it('should compare string/array length correctly', () => {
    expect(maxLength.validate('abc', 2)).to.equal(false)
    expect(maxLength.validate('abc', 3)).to.equal(true)
    expect(maxLength.validate([1, 2, 3], 2)).to.equal(false)
    expect(maxLength.validate([1, 2, 3], 3)).to.equal(true)
  })

  it('should produce validation error message correctly', () => {
    expect(maxLength.message(100, 10)).to.equal('字符长度不能超过10')
  })
})
