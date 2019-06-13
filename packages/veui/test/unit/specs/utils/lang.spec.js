import {
  getTypeByInstance,
  getType,
  isType,
  isEqualSet
} from '@/utils/lang'

function test () {}
let promise = Promise.resolve()

describe('utils/lang', () => {
  it('should implement `getTypeByInstance` correctly', () => {
    expect(getTypeByInstance(null)).to.equal(null)
    expect(getTypeByInstance(undefined)).to.equal(undefined)
    expect(getTypeByInstance(1)).to.equal('Number')
    expect(getTypeByInstance('')).to.equal('String')
    expect(getTypeByInstance(false)).to.equal('Boolean')
    expect(getTypeByInstance([])).to.equal('Array')
    expect(getTypeByInstance({})).to.equal('Object')
    expect(getTypeByInstance(test)).to.equal('Function')
    expect(getTypeByInstance(promise)).to.equal('Promise')
  })

  it('should implement `getType` correctly', () => {
    let a1 = 1
    let a2 = ''
    let a3 = false
    let a4 = []
    let a5 = {}

    expect(getType(a1.constructor)).to.equal('Number')
    expect(getType(a2.constructor)).to.equal('String')
    expect(getType(a3.constructor)).to.equal('Boolean')
    expect(getType(a4.constructor)).to.equal('Array')
    expect(getType(a5.constructor)).to.equal('Object')
    expect(getType(test.constructor)).to.equal('Function')
    expect(getType(promise.constructor)).to.equal('Promise')
    expect(getType('123')).to.equal('')
  })

  it('should implement `isType` correctly', () => {
    expect(isType(Number.prototype.constructor, 1)).to.equal(true)
    expect(isType(Number.prototype.constructor, '')).to.equal(false)
    expect(isType(String.prototype.constructor, '')).to.equal(true)
    expect(isType(String.prototype.constructor, true)).to.equal(false)
    expect(isType(Boolean.prototype.constructor, false)).to.equal(true)
    expect(isType(Boolean.prototype.constructor, [])).to.equal(false)
    expect(isType(Array.prototype.constructor, [])).to.equal(true)
    expect(isType(Array.prototype.constructor, {})).to.equal(false)
    expect(isType(Function.prototype.constructor, test)).to.equal(true)
    expect(isType(Function.prototype.constructor, promise)).to.equal(false)
    expect(isType(Object.prototype.constructor, {})).to.equal(true)
    expect(isType(Object.prototype.constructor, test)).to.equal(false)
    expect(isType(Promise.prototype.constructor, promise)).to.equal(true)
    expect(isType(Promise.prototype.constructor, 1)).to.equal(false)
  })

  it('should implement `isEqualSet` correctly', () => {
    let obj = { a: 1 }
    expect(isEqualSet(1, [1])).to.equal(false)
    expect(isEqualSet([1], 1)).to.equal(false)
    expect(isEqualSet(1, 1)).to.equal(false)
    expect(isEqualSet([1, 2], [1, 2])).to.equal(true)
    expect(isEqualSet([1, 2, 2], [1, 1, 2])).to.equal(true)
    expect(isEqualSet([obj, 2, obj], [2, 2, obj])).to.equal(true)
  })
})
