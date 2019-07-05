import { mount } from '@vue/test-utils'
import CheckButtonGroup from '@/components/CheckButtonGroup'

describe('components/CheckButtonGroup', () => {
  it('should handle props correctly', () => {
    const wrapper = mount(
      CheckButtonGroup,
      {
        propsData: {
          items: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b', disabled: true },
            { label: 'C', value: 'c' }
          ],
          value: ['a']
        }
      },
      {
        sync: false
      }
    )

    let buttons = wrapper.findAll('button.veui-button')

    expect(buttons.length).to.equal(3)
    expect(buttons.at(0).classes('veui-button-selected')).to.equal(true)
    expect(buttons.at(1).classes('veui-button-selected')).to.equal(false)
    expect(buttons.at(1).element.disabled).to.equal(true)
    expect(buttons.at(2).classes('veui-button-selected')).to.equal(false)

    wrapper.destroy()
  })

  it('should handle selected prop correctly with `null` value.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-check-button-group': CheckButtonGroup
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' }
            ],
            selected: null
          }
        },
        template: '<veui-check-button-group v-model="selected" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let buttons = wrapper.findAll('button.veui-button')

    buttons.at(0).trigger('click')
    buttons.at(1).trigger('click')
    await vm.$nextTick()

    expect(vm.selected).to.deep.equal(['a', 'b'])

    buttons.at(0).trigger('click')
    await vm.$nextTick()

    expect(vm.selected).to.deep.equal(['b'])

    wrapper.destroy()
  })
})
