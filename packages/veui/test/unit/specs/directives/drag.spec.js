import { mount } from '@vue/test-utils'
import drag from '@/directives/drag'

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
          expect(this.$el.style.transform.trim()).toBe(
            `translate(${distanceX}px,${distanceY}px)`
          )
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

          expect(this.$el.style.transform.trim()).toBe('translate(200px,200px)')

          done()
        }
      }
    })

    wrapper.find('div').trigger('mousedown', {
      clientX: 5,
      clientY: 5
    })
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 105,
        clientY: 105
      })
    )
    window.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 205,
        clientY: 205
      })
    )
    window.dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: 205,
        clientY: 205
      })
    )
  })
})
