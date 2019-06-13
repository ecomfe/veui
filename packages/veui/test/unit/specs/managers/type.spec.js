import type from '@/managers/type'
import { cloneDeep } from 'lodash'

describe('managers/type', () => {
  it('should init `type` instance correctly', () => {
    let curType = cloneDeep(type)

    expect(curType.configs.length).to.equal(1)
    expect(curType.configs[0].type).to.equal(Function.prototype.constructor)
    expect(curType.configs[0].clone({ a: 1 })).to.deep.equal({ a: 1 })
  })

  it('should implement `register` function correctly', () => {
    let curType = cloneDeep(type)
    curType.register(null)

    expect(curType.configs.length).to.equal(1)

    curType.register({
      type: Array,
      clone (value) {
        return [].concat(value)
      }
    })

    expect(curType.configs.length).to.equal(2)
    expect(curType.configs[1].type).to.equal(Array.prototype.constructor)
    expect(curType.configs[1].clone({ a: 1 })).to.deep.equal([{ a: 1 }])

    curType.register({
      type: Array,
      clone (value) {
        return value
      }
    })

    expect(curType.configs.length).to.equal(2)
    expect(curType.configs[1].type).to.equal(Array.prototype.constructor)
    expect(curType.configs[1].clone({ a: 1 })).to.deep.equal({ a: 1 })
  })

  it('should implement `clone` function correctly', () => {
    let curType = cloneDeep(type)

    expect(curType.clone({ a: 1 })).to.deep.equal({ a: 1 })
    expect(curType.clone(1)).to.equal(1)

    curType.register({
      type: Number,
      clone (value) {
        return value + 1
      }
    })

    expect(curType.clone(1)).to.equal(2)
  })
})
