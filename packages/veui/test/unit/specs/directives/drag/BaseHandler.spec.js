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
    expect(handler.options.foo).toBe(0)
    expect(handler.context.bar).toBe(1)
    expect(handler.isDragging).toBe(false)
  })

  it('should respond correctly when its methods are called', () => {
    expect(() => {
      handler.setOptions({
        foo: 2
      })
    }).not.toThrow()
    expect(handler.options.foo).toBe(2)

    handler.start()
    expect(handler.isDragging).toBe(true)

    expect(() => {
      handler.drag()
    }).toThrow('`drag` method must be implemented.')

    expect(() => {
      handler.setOptions({})
    }).toThrow('Do not set `options` while dragging.')

    handler.end()
    expect(handler.isDragging).toBe(false)

    expect(() => {
      handler.reset()
    }).toThrow('`reset` method must be implemented.')

    expect(() => {
      handler.destroy()
    }).toThrow('`destroy` method must be implemented.')
  })
})
