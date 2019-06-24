import {
  getTypeByInstance,
  getType,
  isType,
  isEqualSet
} from '@/utils/lang'

function test () {}
let a1 = 1
let a2 = ''
let a3 = false
let a4 = []
let a5 = {}

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
  })

  it('should implement `getType` correctly', () => {
    expect(getType(a1.constructor)).to.equal('Number')
    expect(getType(a2.constructor)).to.equal('String')
    expect(getType(a3.constructor)).to.equal('Boolean')
    expect(getType(a4.constructor)).to.equal('Array')
    expect(getType(a5.constructor)).to.equal('Object')
    expect(getType(test.constructor)).to.equal('Function')
    expect(getType('123')).to.equal('')
  })

  it('should implement `isType` correctly', () => {
    expect(isType(Number, a1)).to.equal(true)
    expect(isType(Number, a2)).to.equal(false)
    expect(isType(String, a2)).to.equal(true)
    expect(isType(String, a3)).to.equal(false)
    expect(isType(Boolean, a3)).to.equal(true)
    expect(isType(Boolean, a4)).to.equal(false)
    expect(isType(Array, a4)).to.equal(true)
    expect(isType(Array, a5)).to.equal(false)
    expect(isType(Object, a5)).to.equal(true)
    expect(isType(Function, test)).to.equal(true)
    expect(isType(Object, test)).to.equal(false)
    expect(isType(Promise, a1)).to.equal(false)
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
