import required from 'veui/managers/rules/required'
import 'veui/locale/zh-Hans/common'

describe('managers/rules/required', function () {
  this.timeout(10000)

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

  it('should produce validation error message correctly', () => {
    expect(required.message('a')).to.equal('请填写')
  })
})
