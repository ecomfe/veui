import { mount } from '@vue/test-utils'
import drag from '@/directives/drag'
import { wait } from '../../../../utils'

describe('directives/drag/SortHandler', () => {
  it(`should callback with insert index when the dragging item matches insert zone`, async () => {
    let results = []
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" style="position: fixed; top: 200px; left: 200px; transform: translate(-100px, -100px); border: 1px solid red; width: 300px">
          <div style="height: 20px; margin: 5px 0;" v-drag.sort.y="dragOptions">1</div>
          <div style="height: 20px; margin: 5px 0;" v-drag.sort.y="dragOptions">2</div>
          <div style="height: 20px; margin: 5px 0;" v-drag.sort.y="dragOptions" class="third">3</div>
          <div style="height: 20px; margin: 5px 0;" v-drag.sort.y="dragOptions">4</div>
        </div>`,
        data () {
          return {
            dragOptions: {
              name: '🤯',
              containment: 'self',
              sort: this.handleSort
            }
          }
        },
        methods: {
          handleSort (from, to) {
            results.push([from, to])
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    let $el = wrapper.find('.third')
    expect($el.attributes('data-veui-drag-sort')).to.be.equal('🤯')

    let attrs = []
    performDrag(
      $el.element,
      [
        [120, 175],
        [125, 160],
        [128, 162],
        [130, 130],
        [131, 128]
      ],
      {
        onDragStart () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        },
        onDragEnd () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        }
      }
    )
    await wait(500)

    expect(results).to.eql([[2, 0]])
    expect(attrs).to.eql(['', undefined])

    wrapper.destroy()
  })
})

async function performDrag (el, series, handler = {}) {
  let [start, ...moves] = series
  let end = moves.pop()

  el.dispatchEvent(
    createDragEvent('dragstart', { clientX: start[0], clientY: start[1] })
  )
  if (handler.onDragStart) {
    handler.onDragStart()
  }

  await wait(50)

  for (let i = 0; i < moves.length; i++) {
    let move = moves[i]
    el.dispatchEvent(
      createDragEvent('drag', {
        clientX: move[0],
        clientY: move[1]
      })
    )

    await wait(100)
  }

  el.dispatchEvent(
    createDragEvent('dragend', {
      clientX: end[0],
      clientY: end[1]
    })
  )
  if (handler.onDragEnd) {
    handler.onDragEnd()
  }
}

// wrapper.trigger doesn't work for DragEvent for now
// https://github.com/vuejs/vue-test-utils/issues/1762
function createDragEvent (type, props) {
  return new DragEvent(type, {
    dataTransfer: new DataTransfer(),
    ...props
  })
}
