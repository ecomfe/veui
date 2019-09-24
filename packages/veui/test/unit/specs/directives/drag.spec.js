import { mount } from '@vue/test-utils'
import drag, { registerHandler } from '@/directives/drag'
import { wait, normalizeTransform } from '../../../utils'

describe('directives/drag', () => {
  it(`should receive correct params inside callbacks`, done => {
    let results = []
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self"
        v-drag:self="{
          dragstart: handleStart,
          drag: handleMove,
          dragend: handleEnd
        }"
        style="width: 20px; height: 20px">foo</div>`,
        methods: {
          handleStart ({ event }) {
            results.push({
              x: event.clientX,
              y: event.clientY
            })
          },
          handleMove ({ event, distanceX, distanceY }) {
            assertTransform(this, `translate(${distanceX}px, ${distanceY}px)`)
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

            expect(results).to.deep.equal([
              { x: 5, y: 5 },
              { x: 105, y: 105, dx: 100, dy: 100 },
              { x: 205, y: 205, dx: 200, dy: 200 },
              { x: 205, y: 205, dx: 200, dy: 200 }
            ])

            assertTransform(this, 'translate(200px, 200px)')

            wrapper.destroy()
            done()
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    performDrag(wrapper, [[5, 5], [105, 105], [205, 205], [205, 205]])
  })

  it(`should accept dynamic options`, async () => {
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self="dragOptions">foo</div>`,
        data () {
          return {
            dragOptions: {
              axis: 'x'
            }
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    performDrag(wrapper)
    assertTransform(wrapper, 'translate(200px, 0px)')

    await vm.$nextTick()

    // should skip
    wrapper.vm.dragOptions = { axis: 'y' }
    await vm.$nextTick()
    performDrag(wrapper)
    assertTransform(wrapper, 'translate(200px, 200px)')

    wrapper.vm.dragOptions = { axis: 'x' }
    await vm.$nextTick()
    performDrag(wrapper)
    assertTransform(wrapper, 'translate(400px, 200px)')

    wrapper.destroy()
  })

  it(`doesn't accept non-BaseHandler derivatives in registerHandler method`, () => {
    expect(() => {
      registerHandler('foo', {})
    }).to.throw('The handler class must derive from `BaseHandler`.')
  })

  it('should handle clear up correctly', () => {
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self>foo</div>`
      },
      {
        attachToDocument: true
      }
    )

    wrapper.vm.$destroy()
    expect(wrapper.element.__dragData__).to.be.equal(null)
    wrapper.destroy()
  })

  it('should handle @window containment correctly', () => {
    document.body.style = 'margin: 0'
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self="{
        containment: '@window'
      }">foo</div>`
      },
      {
        attachToDocument: true
      }
    )

    performDrag(wrapper, [[0, 0], [-100, 2000]])
    assertTransform(
      wrapper,
      `translate(0px, ${window.innerHeight -
        wrapper.vm.$refs.self.offsetHeight}px)`
    )
    document.body.style = ''
    wrapper.destroy()
  })

  it('should handle rect containment correctly', () => {
    document.body.style = 'margin: 0'
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self="{
        containment: {
          top: 0,
          left: 0,
          width: 100,
          height: 100
        }
      }" style="width: 20px; height: 20px">foo</div>`
      },
      {
        attachToDocument: true
      }
    )

    performDrag(wrapper, [[0, 0], [-100, 200]])
    assertTransform(
      wrapper,
      `translate(0px, ${100 - wrapper.element.offsetHeight}px)`
    )
    document.body.style = ''
    wrapper.destroy()
  })

  it('should ignore dragging triggered from right click', () => {
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self="dragOptions">foo</div>`,
        data () {
          return {
            dragOptions: {
              axis: 'x'
            }
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    performDrag(wrapper, { button: 2 })
    assertTransform(wrapper, '')
    wrapper.destroy()
  })

  it('should be able to retrieve `reset` method and use when needed', async () => {
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self="{
        ready
      }">foo</div>`,
        methods: {
          ready ({ reset }) {
            this.reset = reset
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    performDrag(wrapper, [[0, 0], [100, 100]])
    assertTransform(wrapper, 'translate(100px, 100px)')

    await wait(200)
    vm.reset()
    assertTransform(wrapper, '')

    wrapper.destroy()
  })

  it('should be able to `cancel` certain drag behavior when needed', async () => {
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" v-drag:self="{
        dragend: dragEnd
      }">foo</div>`,
        methods: {
          dragEnd ({ distanceX, cancel }) {
            if (distanceX > 200) {
              cancel()
            }
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    performDrag(wrapper, [[0, 0], [100, 100], [400, 200]])
    assertTransform(wrapper, '')
    wrapper.destroy()
  })

  it(
    'should handle `draggable` option correctly',
    () => {
      let wrapper = mount({
        directives: { drag },
        template: `<div ref="self" v-drag:self="{
        draggable: false
      }">foo</div>`
      })

      performDrag(wrapper, [[0, 0], [100, 100]])
      assertTransform(wrapper, '')

      wrapper.destroy()
    },
    {
      attachToDocument: true
    }
  )

  it('should handle unknown type option correctly', () => {
    expect(() => {
      mount(
        {
          directives: { drag },
          template: `<div ref="self" v-drag:self="{
          type: 'foo'
        }">foo</div>`
        },
        {
          attachToDocument: true
        }
      )
    }).to.throw('No handler is registered for type "foo".')
  })
})

let DEFAULT_MOVEMENT = [[5, 5], [105, 105], [205, 205]]
function performDrag (wrapper, ...rest) {
  let series = DEFAULT_MOVEMENT
  let data = {}
  if (rest.length === 1) {
    if (Array.isArray(rest[0])) {
      series = rest[0]
    } else {
      data = rest[0]
    }
  } else if (rest.length === 2) {
    [series, data] = rest
  }
  let [start, ...moves] = series
  let end = moves.pop()

  wrapper.find('div').trigger('mousedown', {
    clientX: start[0],
    clientY: start[1],
    ...data
  })

  window.dispatchEvent(new Event('selectstart'))

  moves.forEach(move => {
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: move[0],
        clientY: move[1],
        ...data
      })
    )
  })

  window.dispatchEvent(
    new MouseEvent('mouseup', {
      clientX: end[0],
      clientY: end[1],
      ...data
    })
  )
}

function assertTransform (target, transform) {
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

  expect(normalizeTransform(el.style.transform)).to.equal(
    normalizeTransform(transform)
  )
}
