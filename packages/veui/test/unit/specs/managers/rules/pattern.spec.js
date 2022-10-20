import pattern from 'veui/managers/rules/pattern'
import 'veui/locale/zh-Hans/common'

describe('managers/rules/pattern', function () {
  this.timeout(10000)

  it('should match string RegExp correctly', () => {
    expect(pattern.validate('abc', '\\w+')).to.equal(true)
    expect(pattern.validate(' ', '\\w+')).to.equal(false)
  })

  it('should match RegExp correctly', () => {
    expect(pattern.validate(10, /\d+/)).to.equal(true)
    expect(pattern.validate('abc', /\d+/)).to.equal(false)
  })

  it('should produce validation error message correctly', () => {
    expect(pattern.message('a')).to.equal('格式不符合要求')
  })
})
