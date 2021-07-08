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
    await performDrag(
      $el,
      [
        [120, 175],
        [125, 160],
        [128, 162],
        [130, 130],
        [131, 128]
      ],
      $el,
      {
        onDragStart () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        },
        onDragEnd () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        }
      }
    )

    expect(results).to.eql([[2, 0]])
    expect(attrs).to.eql(['', undefined])

    wrapper.destroy()
  })

  it('should respect `disabled` option correctly', async () => {
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
            disabled: false
          }
        },
        computed: {
          dragOptions () {
            return {
              name: '🤯',
              containment: 'self',
              sort: this.handleSort,
              disabled: this.disabled
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
    let handlers = {
      onDragStart () {
        attrs.push($el.attributes('data-veui-drag-sort-dragging'))
      },
      onDragEnd () {
        attrs.push($el.attributes('data-veui-drag-sort-dragging'))
      }
    }

    await performDrag(
      $el,
      [
        [120, 175],
        [125, 160],
        [128, 162],
        [130, 130],
        [131, 128]
      ],
      $el,
      handlers
    )

    expect(results).to.eql([[2, 0]])
    expect(attrs).to.eql(['', undefined])

    wrapper.vm.disabled = true

    await wrapper.vm.$nextTick()
    await performDrag(
      $el,
      [
        [120, 175],
        [125, 160],
        [128, 162],
        [130, 130],
        [131, 128]
      ],
      $el,
      handlers
    )

    expect(results).to.eql([[2, 0]])
    expect(attrs).to.eql(['', undefined])

    wrapper.vm.disabled = false

    await wrapper.vm.$nextTick()
    await performDrag(
      $el,
      [
        [120, 175],
        [125, 160],
        [128, 162],
        [130, 130],
        [131, 128]
      ],
      $el,
      handlers
    )

    expect(results).to.eql([
      [2, 0],
      [2, 0]
    ])
    expect(attrs).to.eql(['', undefined, '', undefined])
    wrapper.destroy()
  })

  it('should respect `handle` option correctly', async () => {
    let results = []
    let wrapper = mount(
      {
        directives: { drag },
        template: `<div ref="self" style="position: fixed; top: 200px; left: 200px; transform: translate(-100px, -100px); border: 1px solid red; width: 300px">
          <div style="height: 20px; margin: 5px 0;" v-drag.sort.y="dragOptions">1</div>
          <div style="height: 20px; margin: 5px 0;" v-drag.sort.y="dragOptions">2</div>
          <div style="height: 20px; margin: 5px 0; display: flex;" v-drag.sort.y="{ ...dragOptions, handle: 'h' }" class="third"><div class="h" ref="h" style="width: 40px; height: 20px"></div>3</div>
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
    let $handle = $el.find('.h')
    expect($el.attributes('data-veui-drag-sort')).to.be.equal('🤯')

    let attrs = []
    await performDrag(
      $el,
      [
        [220, 175],
        [225, 160],
        [228, 162],
        [230, 130],
        [231, 128]
      ],
      $handle,
      {
        onDragStart () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        },
        onDragEnd () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        }
      }
    )

    expect(results).to.eql([])
    expect(attrs).to.eql([])

    attrs = []
    await performDrag(
      $el,
      [
        [120, 175],
        [125, 160],
        [128, 162],
        [130, 130],
        [131, 128]
      ],
      $handle,
      {
        onDragStart () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        },
        onDragEnd () {
          attrs.push($el.attributes('data-veui-drag-sort-dragging'))
        }
      }
    )

    expect(results).to.eql([[2, 0]])
    expect(attrs).to.eql(['', undefined])

    wrapper.destroy()
  })
})

async function performDrag ($el, series, $handle = $el, handlers = {}) {
  let [start, ...moves] = series
  let end = moves.pop()

  let el = $el.element

  let { top, left, right, bottom } = $handle.element.getBoundingClientRect()
  let [x, y] = start
  if (top < y && right > x && bottom > y && left < x) {
    $handle.trigger('mousedown', {
      clientX: start[0],
      clientY: start[1]
    })
  }

  dispatchDrag(
    el,
    'dragstart',
    {
      clientX: start[0],
      clientY: start[1]
    },
    handlers
  )

  await wait(50)

  for (let i = 0; i < moves.length; i++) {
    let move = moves[i]
    dispatchDrag(
      el,
      'drag',
      {
        clientX: move[0],
        clientY: move[1]
      },
      handlers
    )

    await wait(100)
  }

  dispatchDrag(
    el,
    'dragend',
    {
      clientX: end[0],
      clientY: end[1]
    },
    handlers
  )
}

// wrapper.trigger doesn't work for DragEvent for now
// https://github.com/vuejs/vue-test-utils/issues/1762
function createDragEvent (type, args) {
  return new DragEvent(type, {
    dataTransfer: new DataTransfer(),
    ...args
  })
}

function dispatchDrag (el, type, args, handlers) {
  if (!el.draggable) {
    return
  }

  el.dispatchEvent(createDragEvent(type, args))

  let handler = {
    dragstart: handlers.onDragStart,
    dragend: handlers.onDragEnd
  }[type]
  if (handler) {
    handler()
  }
}
