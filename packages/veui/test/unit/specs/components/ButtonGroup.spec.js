import { mount } from '@vue/test-utils'
import ButtonGroup from '@/components/ButtonGroup'

describe('components/ButtonGroup', function () {
  this.timeout(10000)

  it('should create a buttonGroup with `primary` ui', () => {
    const wrapper = mount(ButtonGroup, {
      propsData: {
        ui: 'primary',
        items: [
          {
            label: 'Undo',
            value: 'undo'
          },
          {
            label: 'Redo',
            value: 'redo'
          }
        ]
      }
    })

    const buttons = wrapper.findAll('.veui-button')
    expect(wrapper.attributes('ui')).to.include('primary')
    expect(buttons.length).to.equal(2)
    expect(buttons.at(0).text()).to.equal('Undo')
    expect(buttons.at(1).text()).to.equal('Redo')
  })

  it('should support disabled state', () => {
    const wrapper = mount(ButtonGroup, {
      propsData: {
        ui: 'primary',
        items: [
          {
            label: 'Undo',
            value: 'undo'
          },
          {
            label: 'Redo',
            value: 'redo'
          }
        ],
        disabled: 'disabled'
      }
    })

    expect(wrapper.classes('veui-button-group-disabled')).to.equal(true)
  })

  it('should handle click correctly', async () => {
    const ButtonGroupClick = {
      components: {
        'veui-button-group': ButtonGroup
      },
      methods: {
        handleClick (item, index, event) {
          this.event = event
          this.clicktime += 1
        },
        handleUndo (item, index, event) {
          this.event = event
          this.hasUndo = true
          this.value = item.value
          this.index = index
        },
        handleRedo (item, index, event) {
          this.event = event
          this.hasRedo = true
          this.value = item.value
          this.index = index
        }
      },
      data () {
        return {
          value: '',
          index: -1,
          clicktime: 0,
          hasUndo: false,
          hasRedo: false,
          items: [
            {
              label: 'Undo',
              value: 'undo'
            },
            {
              label: 'Redo',
              value: 'redo'
            }
          ],
          event
        }
      },
      template:
        '<veui-button-group ui="primary" :items="items" @click="handleClick" @undo="handleUndo" @redo="handleRedo" />'
    }

    const wrapper = mount(ButtonGroupClick)

    wrapper.findAll('.veui-button').at(0).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasUndo).to.equal(true)
    expect(wrapper.vm.clicktime).to.equal(1)
    expect(wrapper.vm.index).to.equal(0)
    expect(wrapper.vm.value).to.equal('undo')
    expect(wrapper.vm.event.type).to.equal('click')

    wrapper.findAll('.veui-button').at(1).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasUndo).to.equal(true)
    expect(wrapper.vm.clicktime).to.equal(2)
    expect(wrapper.vm.index).to.equal(1)
    expect(wrapper.vm.value).to.equal('redo')
    expect(wrapper.vm.event.type).to.equal('click')
  })
})
