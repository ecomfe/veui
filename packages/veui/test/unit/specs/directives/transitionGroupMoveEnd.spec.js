import { mount } from '@vue/test-utils'
import moveEnd from '@/directives/transitionGroupMoveEnd'
import { wait } from '../../../utils'

describe('directives/transitionGroupMoveEnd', () => {
  let style = document.createElement('style')
  style.textContent = `.item-move {transition: transform .5s}`

  beforeEach(function () {
    document.head.insertBefore(style, document.head.firstChild)
  })

  afterEach(function () {
    style.parentNode.removeChild(style)
  })

  it('should trigger `move-end` event after finishing move transition(s)', async function () {
    let wrapper = mount(
      {
        directives: { moveEnd },
        template: `<transition-group name="item" tag="ul" v-move-end @move-end="handleMoveEnd">
          <li v-for="item in items" :key="item">{{ item }}</li>
        </transition-group>`,
        data () {
          return {
            items: ['a', 'b', 'c']
          }
        },
        methods: {
          handleMoveEnd () {
            this.$emit('move-end')
          }
        }
      },
      {
        stubs: {
          'transition-group': false
        },
        sync: true,
        attachToDocument: true
      }
    )

    await wait(0)
    wrapper.vm.items = ['b', 'c', 'a']
    expect(wrapper.emitted('move-end')).to.be.a('undefined')
    await wait(800)
    expect(wrapper.emitted('move-end').length).to.equal(1)

    wrapper.destroy()
  })
})
