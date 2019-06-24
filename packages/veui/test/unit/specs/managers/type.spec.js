import { Type } from '@/managers/type'

describe('managers/type', () => {
  it('should init `type` instance correctly', () => {
    let type = new Type()

    expect(type.configs.length).to.equal(1)
    expect(type.configs[0].type).to.equal(Function.prototype.constructor)
    expect(type.configs[0].clone({ a: 1 })).to.deep.equal({ a: 1 })
  })

  it('should implement `register` function correctly', () => {
    let type = new Type()
    type.register(null)

    expect(type.configs.length).to.equal(1)

    type.register({
      type: Array,
      clone (value) {
        return [].concat(value)
      }
    })

    expect(type.configs.length).to.equal(2)
    expect(type.configs[1].type).to.equal(Array.prototype.constructor)
    expect(type.configs[1].clone({ a: 1 })).to.deep.equal([{ a: 1 }])

    type.register({
      type: Array,
      clone (value) {
        return value
      }
    })

    expect(type.configs.length).to.equal(2)
    expect(type.configs[1].type).to.equal(Array.prototype.constructor)
    expect(type.configs[1].clone({ a: 1 })).to.deep.equal({ a: 1 })
  })

  it('should implement `clone` function correctly', () => {
    let type = new Type()

    expect(type.clone({ a: 1 })).to.deep.equal({ a: 1 })
    expect(type.clone(1)).to.equal(1)

    type.register({
      type: Number,
      clone (value) {
        return value + 1
      }
    })

    expect(type.clone(1)).to.equal(2)
  })
})
