import TranslateHandler from '@/directives/drag/TranslateHandler'
import config from '@/managers/config'
import { mount } from '@vue/test-utils'

config.defaults({
  'drag.prefix': '@'
})

const originalGetComputedStyle = window.getComputedStyle

function createHandler (options = { targets: ['target'] }, style = '') {
  let { vm, element } = mount({
    template: `<div ref="target" style="color:red;${style}"></div>`
  })
  let handler = new TranslateHandler(options, vm)

  return {
    vm,
    element,
    handler
  }
}

describe('directives/drag/TranslateHandler', () => {
  it('should be instantiatable with specified options and context', () => {
    let { vm, handler } = createHandler()
    expect(handler.options.targets).toEqual(['target'])
    expect(handler.context).toBe(vm)

    handler.destroy()
  })

  it('should respond correctly when its methods are called with initial transform', () => {
    let { element, handler } = createHandler(
      { targets: ['target'] },
      ' transform: translate(5px,5px);'
    )
    expect(() => {
      handler.setOptions({
        targets: ['target']
      })
    }).not.toThrow()
    expect(handler.isDragged).toBe(false)

    window.getComputedStyle = () => ({
      transform: 'translate(5px,5px)' // just a necessary hack
    })

    handler.start()
    expect(element.style.cssText).toBe(
      'color: red; transform: translate(5px,5px); transition: none; animation: none;'
    )

    handler.drag({ distanceX: 100, distanceY: 200 })
    expect(handler.isDragged).toBe(true)
    expect(element.style.transform).toBe(
      'translate(5px,5px) translate(100px,200px)'
    )

    handler.drag({ distanceX: 200, distanceY: 400 })
    expect(element.style.transform).toBe(
      'translate(5px,5px) translate(200px,400px)'
    )

    handler.reset()
    expect(element.style.transform).toBe('translate(5px,5px)')

    handler.start()
    expect(element.style.cssText).toBe(
      'color: red; transform: translate(5px,5px); transition: none; animation: none;'
    )

    handler.end({ distanceX: 200, distanceY: 400 })
    expect(element.style.transform).toBe(
      'translate(5px,5px) translate(200px,400px)'
    )

    window.getComputedStyle = originalGetComputedStyle
  })

  it('should respond correctly when its methods are called without initial transform', () => {
    window.getComputedStyle = () => ({
      transform: 'none'
    })

    let { element, handler } = createHandler()
    expect(() => {
      handler.setOptions({
        targets: ['target']
      })
    }).not.toThrow()
    expect(handler.isDragged).toBe(false)

    handler.start()
    expect(element.style.cssText).toBe(
      'color: red; transition: none; animation: none;'
    )

    handler.start()
    handler.end({ distanceX: 0, distanceY: 0 })
    expect(element.style.transform).toBe('')

    handler.drag({ distanceX: 100, distanceY: 200 })
    expect(handler.isDragged).toBe(true)
    expect(element.style.transform).toBe('translate(100px,200px)')

    handler.drag({ distanceX: 200, distanceY: 400 })
    expect(element.style.transform).toBe('translate(200px,400px)')

    handler.end({ distanceX: 300, distanceY: 600 })
    expect(element.style.transform).toBe('translate(300px,600px)')

    window.getComputedStyle = () => ({
      transform: 'translate(300px,600px)'
    })

    handler.reset()
    expect(element.style.transform).toBe(
      'translate(300px,600px) translate(-300px,-600px)'
    )

    window.getComputedStyle = originalGetComputedStyle
  })

  it('should handle `@window` containment correctly', () => {
    window.getComputedStyle = () => ({
      transform: 'none'
    })

    let { element, handler } = createHandler({
      targets: ['target'],
      containment: '@window'
    })

    let { innerWidth, innerHeight } = window

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    expect(element.style.transform).toBe('')

    handler.drag({ distanceX: 100, distanceY: 100 })
    expect(element.style.transform).toBe('translate(100px,100px)')

    handler.drag({ distanceX: 100, distanceY: 2000 })
    expect(element.style.transform).toBe(`translate(100px,${innerHeight}px)`)

    handler.drag({ distanceX: 2000, distanceY: 100 })
    expect(element.style.transform).toBe(`translate(${innerWidth}px,100px)`)

    handler.drag({ distanceX: 2000, distanceY: 2000 })
    expect(element.style.transform).toBe(
      `translate(${innerWidth}px,${innerHeight}px)`
    )

    window.getComputedStyle = originalGetComputedStyle
  })

  it('should handle Element containment correctly', () => {
    window.getComputedStyle = () => ({
      transform: 'none'
    })

    let { element, handler } = createHandler({
      targets: ['target'],
      containment: {
        nodeType: 3,
        getBoundingClientRect: () => ({
          top: 0,
          right: 100,
          bottom: 100,
          left: 0,
          width: 100,
          height: 100
        })
      }
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    expect(element.style.transform).toBe('')

    handler.drag({ distanceX: 50, distanceY: 50 })
    expect(element.style.transform).toBe('translate(50px,50px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(50px,100px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    expect(element.style.transform).toBe(`translate(100px,50px)`)

    handler.drag({ distanceX: 200, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(100px,100px)`)

    window.getComputedStyle = originalGetComputedStyle
  })

  it('should handle axis y correctly with containment', () => {
    let { element, handler } = createHandler({
      targets: ['target'],
      containment: {
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
        width: 100,
        height: 100
      },
      axis: 'y'
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    expect(element.style.transform).toBe('')

    handler.drag({ distanceX: 50, distanceY: 50 })
    expect(element.style.transform).toBe('translate(0px,50px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(0px,100px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    expect(element.style.transform).toBe(`translate(0px,50px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(0px,100px)`)
  })

  it('should handle axis y correctly without containment', () => {
    let { element, handler } = createHandler({
      targets: ['target'],
      axis: 'y'
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    expect(element.style.transform).toBe('translate(0px,-100px)')

    handler.drag({ distanceX: 50, distanceY: 50 })
    expect(element.style.transform).toBe('translate(0px,50px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(0px,200px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    expect(element.style.transform).toBe(`translate(0px,50px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(0px,200px)`)
  })

  it('should handle axis x correctly with containment', () => {
    let { element, handler } = createHandler({
      targets: ['target'],
      containment: {
        top: 0,
        right: 100,
        bottom: 100,
        left: 0,
        width: 100,
        height: 100
      },
      axis: 'x'
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    expect(element.style.transform).toBe('')

    handler.drag({ distanceX: 50, distanceY: 50 })
    expect(element.style.transform).toBe('translate(50px,0px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(50px,0px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    expect(element.style.transform).toBe(`translate(100px,0px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(100px,0px)`)
  })

  it('should handle axis x correctly without containment', () => {
    let { element, handler } = createHandler({
      targets: ['target'],
      axis: 'x'
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    expect(element.style.transform).toBe('translate(-100px,0px)')

    handler.drag({ distanceX: 50, distanceY: 50 })
    expect(element.style.transform).toBe('translate(50px,0px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(50px,0px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    expect(element.style.transform).toBe(`translate(200px,0px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    expect(element.style.transform).toBe(`translate(200px,0px)`)
  })
})
