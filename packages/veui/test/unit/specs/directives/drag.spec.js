import { mount } from '@vue/test-utils'
import drag, { registerHandler } from '@/directives/drag'
import BaseHandler from '@/directives/drag/BaseHandler'
import { waitTimeout } from '../../../utils'

describe('directives/drag', () => {
  it(`should receive correct params inside callbacks`, done => {
    let results = []
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="{
          dragstart: handleStart,
          drag: handleMove,
          dragend: handleEnd
        }">foo</div>`,
      methods: {
        handleStart ({ event }) {
          results.push({
            x: event.clientX,
            y: event.clientY
          })
        },
        handleMove ({ event, distanceX, distanceY }) {
          assertTransform(this, `translate(${distanceX}px,${distanceY}px)`)
          results.push({
            x: event.clientX,
            y: event.clientY,
            dx: distanceX,
            dy: distanceY
          })
        },
        handleEnd ({ event, distanceX, distanceY }) {
          results.push({
            x: event.clientX,
            y: event.clientY,
            dx: distanceX,
            dy: distanceY
          })

          expect(results).toEqual([
            { x: 5, y: 5 },
            { x: 105, y: 105, dx: 100, dy: 100 },
            { x: 205, y: 205, dx: 200, dy: 200 },
            { x: 205, y: 205, dx: 200, dy: 200 }
          ])

          assertTransform(this, 'translate(200px,200px)')

          done()
        }
      }
    })

    performDrag(wrapper, [[5, 5], [105, 105], [205, 205], [205, 205]])
  })

  it(`should be able to accept dynamic options`, async done => {
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="dragOptions">foo</div>`,
      data () {
        return {
          dragOptions: {
            axis: 'x'
          }
        }
      }
    })

    const { vm } = wrapper

    performDrag(wrapper)
    assertTransform(wrapper, 'translate(200px,0px)')

    await vm.$nextTick()

    // should skip
    wrapper.vm.dragOptions = { axis: 'x' }
    await vm.$nextTick()
    performDrag(wrapper)
    assertTransform(wrapper, 'translate(200px,0px)')

    wrapper.vm.dragOptions = { axis: 'y' }
    await vm.$nextTick()
    performDrag(wrapper)
    assertTransform(wrapper, 'translate(0px,200px)')

    done()
  })

  it(`doesn't accept non-BaseHandler derivatives in registerHandler method`, () => {
    expect(() => {
      registerHandler('foo', {})
    }).toThrow('The handler class must derive from `BaseHandler`.')
  })

  it('should handle clear up correctly', () => {
    const { element, vm } = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self>foo</div>`
    })

    vm.$destroy()
    expect(element.__dragData__).toBe(null)
  })

  it('should handle @window containment correctly', () => {
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="{
        containment: '@window'
      }">foo</div>`
    })

    performDrag(wrapper, [[0, 0], [-100, 2000]])
    assertTransform(wrapper, 'translate(0px,768px)')
  })

  it('should handle rect containment correctly', () => {
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="{
        containment: {
          top: 0,
          left: 0,
          width: 100,
          height: 100
        }
      }">foo</div>`
    })

    performDrag(wrapper, [[0, 0], [-100, 200]])
    assertTransform(wrapper, 'translate(0px,100px)')
  })

  it('should be able to retrive `reset` method and use when needed', async done => {
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="{
        ready
      }">foo</div>`,
      methods: {
        ready ({ reset }) {
          this.reset = reset
        }
      }
    })

    let { vm } = wrapper
    performDrag(wrapper, [[0, 0], [100, 100]])
    assertTransform(wrapper, 'translate(100px,100px)')

    await waitTimeout(200)
    vm.reset()
    assertTransform(wrapper, '')

    done()
  })

  it('should handle `draggable` option correctly', () => {
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="{
        draggable: false
      }">foo</div>`
    })

    performDrag(wrapper, [[0, 0], [100, 100]])
    assertTransform(wrapper, '')
  })

  it('should handle unknow type option correctly', () => {
    const wrapper = mount({
      directives: { drag },
      template: `<div ref="self" v-drag:self="{
        type: 'foo'
      }">foo</div>`
    })

    expect(wrapper.element.__dragData__.handler.constructor).toBe(BaseHandler)
  })
})

const DEFAULT_MOVEMENT = [[5, 5], [105, 105], [205, 205]]
function performDrag (wrapper, series = DEFAULT_MOVEMENT) {
  let [start, ...moves] = series
  let end = moves.pop()

  wrapper.find('div').trigger('mousedown', {
    clientX: start[0],
    clientY: start[1]
  })

  window.dispatchEvent(new Event('selectstart'))

  moves.forEach(move => {
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: move[0],
        clientY: move[1]
      })
    )
  })

  window.dispatchEvent(
    new MouseEvent('mouseup', {
      clientX: end[0],
      clientY: end[1]
    })
  )
}

function assertTransform (target, value) {
  let el

  if (target.element && target.vm) {
    el = target.element // wrapper
  } else if (target.$el) {
    el = target.$el
  } else if (target instanceof Element) {
    el = target
  } else {
    throw new Error('Invalid target')
  }
  expect(el.style.transform.trim()).toBe(value)
}
