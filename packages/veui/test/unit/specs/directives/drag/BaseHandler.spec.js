import BaseHandler from '@/directives/drag/BaseHandler'

describe('directives/drag/BaseHandler', () => {
  let handler = new BaseHandler(
    {
      foo: 0
    },
    {
      bar: 1
    }
  )

  it('should be instantiatable with specified options and context', () => {
    expect(handler.options.foo).to.be.equal(0)
    expect(handler.context.bar).to.be.equal(1)
    expect(handler.isDragging).to.be.equal(false)
  })

  it('should respond correctly when its methods are called', () => {
    expect(() => {
      handler.setOptions({
        foo: 2
      })
    }).to.not.throw()
    expect(handler.options.foo).to.be.equal(2)

    handler.start()
    expect(handler.isDragging).to.equal(true)

    expect(() => {
      handler.drag()
    }).to.throw('`drag` method must be implemented.')

    expect(() => {
      handler.setOptions({})
    }).to.throw('Do not set `options` while dragging.')

    handler.end()
    expect(handler.isDragging).to.be.equal(false)

    expect(() => {
      handler.reset()
    }).to.throw('`reset` method must be implemented.')

    expect(() => {
      handler.destroy()
    }).to.throw('`destroy` method must be implemented.')
  })
})
