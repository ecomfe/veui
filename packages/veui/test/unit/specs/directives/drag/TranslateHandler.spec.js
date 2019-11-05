import { pick } from 'lodash'
import TranslateHandler from '@/directives/drag/TranslateHandler'
import config from '@/managers/config'
import { mount } from '@vue/test-utils'
import { normalizeTransform } from '../../../../utils'

config.defaults({
  'drag.prefix': '@'
})

function createHandler (options = { targets: ['target'] }, style = '') {
  let wrapper = mount(
    {
      template: `<div ref="target" style="color: red; position: fixed; top: 0; left: 0;${
        style ? ' ' + style : ''
      }"></div>`
    },
    {
      attachToDocument: true
    }
  )

  let { vm, element } = wrapper
  let handler = new TranslateHandler(options, vm)

  return {
    wrapper,
    vm,
    element,
    handler
  }
}

function assertTransform (el, transform) {
  expect(normalizeTransform(el.style.transform)).to.equal(
    normalizeTransform(transform)
  )
}

describe('directives/drag/TranslateHandler', () => {
  it('should be instantiatable with specified options and context', () => {
    let { wrapper, vm, handler } = createHandler()
    expect(handler.options.targets).to.deep.equal(['target'])
    expect(handler.context).to.be.equal(vm)

    handler.destroy()
    wrapper.destroy()
  })

  it('should respond correctly when its methods are called with initial transform', () => {
    let { wrapper, element, handler } = createHandler(
      { targets: ['target'] },
      'transform: translate(5px, 5px);'
    )
    expect(() => {
      handler.setOptions({
        targets: ['target']
      })
    }).to.not.throw()
    expect(handler.isDragged).to.be.equal(false)

    handler.start()
    expect(
      pick(element.style, [
        'color',
        'transform',
        'transition-property',
        'animation-name'
      ])
    ).to.deep.equal({
      color: 'red',
      transform: 'translate(5px, 5px)',
      'transition-property': 'none',
      'animation-name': 'none'
    })

    handler.drag({ distanceX: 100, distanceY: 200 })
    expect(handler.isDragged).to.equal(true)
    assertTransform(element, 'translate(5px, 5px) translate(100px, 200px)')

    handler.drag({ distanceX: 200, distanceY: 400 })
    assertTransform(element, 'translate(5px, 5px) translate(200px, 400px)')

    handler.end({ distanceX: 200, distanceY: 400 })
    assertTransform(element, 'translate(5px, 5px) translate(200px, 400px)')

    handler.reset()
    assertTransform(element, 'translate(5px, 5px)')

    handler.start()
    assertTransform(element, 'translate(5px, 5px)')

    handler.end({ distanceX: 200, distanceY: 400 })
    assertTransform(element, 'translate(5px, 5px) translate(200px, 400px)')

    wrapper.destroy()
  })

  it('should respond correctly when its methods are called without initial transform', () => {
    let { wrapper, element, handler } = createHandler()
    expect(() => {
      handler.setOptions({
        targets: ['target']
      })
    }).to.not.throw()
    expect(handler.isDragged).to.be.equal(false)

    handler.start()
    expect(
      pick(element.style, ['color', 'transition-property', 'animation-name'])
    ).to.deep.equal({
      color: 'red',
      'transition-property': 'none',
      'animation-name': 'none'
    })

    handler.start()
    handler.end({ distanceX: 0, distanceY: 0 })
    assertTransform(element, '')

    handler.drag({ distanceX: 100, distanceY: 200 })
    expect(handler.isDragged).to.equal(true)
    assertTransform(element, 'translate(100px, 200px)')

    handler.drag({ distanceX: 200, distanceY: 400 })
    assertTransform(element, 'translate(200px, 400px)')

    handler.end({ distanceX: 300, distanceY: 600 })
    assertTransform(element, 'translate(300px, 600px)')

    handler.reset()
    assertTransform(
      element,
      'translate(300px, 600px) translate(-300px, -600px)'
    )

    wrapper.destroy()
  })

  it('should handle `@window` containment correctly', () => {
    let { wrapper, element, handler } = createHandler({
      targets: ['target'],
      containment: '@window'
    })

    let { innerWidth, innerHeight } = window

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    assertTransform(element, '')

    handler.drag({ distanceX: 100, distanceY: 100 })
    assertTransform(element, 'translate(100px, 100px)')

    handler.drag({ distanceX: 100, distanceY: 2000 })
    assertTransform(element, `translate(100px, ${innerHeight}px)`)

    handler.drag({ distanceX: 2000, distanceY: 100 })
    assertTransform(element, `translate(${innerWidth}px, 100px)`)

    handler.drag({ distanceX: 2000, distanceY: 2000 })
    assertTransform(element, `translate(${innerWidth}px, ${innerHeight}px)`)

    wrapper.destroy()
  })

  it('should handle Element containment correctly', () => {
    let { wrapper, element, handler } = createHandler({
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
    assertTransform(element, '')

    handler.drag({ distanceX: 50, distanceY: 50 })
    assertTransform(element, 'translate(50px, 50px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    assertTransform(element, `translate(50px, 100px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    assertTransform(element, `translate(100px, 50px)`)

    handler.drag({ distanceX: 200, distanceY: 200 })
    assertTransform(element, `translate(100px, 100px)`)

    wrapper.destroy()
  })

  it('should handle axis y correctly with containment', () => {
    let { wrapper, element, handler } = createHandler({
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
    assertTransform(element, '')

    handler.drag({ distanceX: 50, distanceY: 50 })
    assertTransform(element, 'translate(0px, 50px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    assertTransform(element, `translate(0px, 100px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    assertTransform(element, `translate(0px, 50px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    assertTransform(element, `translate(0px, 100px)`)

    wrapper.destroy()
  })

  it('should handle axis y correctly without containment', () => {
    let { wrapper, element, handler } = createHandler({
      targets: ['target'],
      axis: 'y'
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    assertTransform(element, 'translate(0px, -100px)')

    handler.drag({ distanceX: 50, distanceY: 50 })
    assertTransform(element, 'translate(0px, 50px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    assertTransform(element, `translate(0px, 200px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    assertTransform(element, `translate(0px, 50px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    assertTransform(element, `translate(0px, 200px)`)

    wrapper.destroy()
  })

  it('should handle axis x correctly with containment', () => {
    let { wrapper, element, handler } = createHandler({
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
    assertTransform(element, '')

    handler.drag({ distanceX: 50, distanceY: 50 })
    assertTransform(element, 'translate(50px, 0px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    assertTransform(element, `translate(50px, 0px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    assertTransform(element, `translate(100px, 0px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    assertTransform(element, `translate(100px, 0px)`)

    wrapper.destroy()
  })

  it('should handle axis x correctly without containment', () => {
    let { wrapper, element, handler } = createHandler({
      targets: ['target'],
      axis: 'x'
    })

    handler.start()

    handler.drag({ distanceX: -100, distanceY: -100 })
    assertTransform(element, 'translate(-100px, 0px)')

    handler.drag({ distanceX: 50, distanceY: 50 })
    assertTransform(element, 'translate(50px, 0px)')

    handler.drag({ distanceX: 50, distanceY: 200 })
    assertTransform(element, `translate(50px, 0px)`)

    handler.drag({ distanceX: 200, distanceY: 50 })
    assertTransform(element, `translate(200px, 0px)`)

    handler.end({ distanceX: 200, distanceY: 200 })
    assertTransform(element, `translate(200px, 0px)`)

    wrapper.destroy()
  })
})
