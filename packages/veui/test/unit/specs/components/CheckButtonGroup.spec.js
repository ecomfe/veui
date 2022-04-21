import { mount } from '@vue/test-utils'
import CheckButtonGroup from '@/components/CheckButtonGroup'
import { expectDisabled, wait } from '../../../utils'

describe('components/CheckButtonGroup', function () {
  this.timeout(10000)

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

    let buttons = wrapper.findAll('.veui-button')

    expect(buttons.length).to.equal(3)
    expect(buttons.at(0).classes('veui-button-selected')).to.equal(true)
    expect(buttons.at(1).classes('veui-button-selected')).to.equal(false)
    expectDisabled(buttons.at(1))
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
    let buttons = wrapper.findAll('.veui-button')

    buttons.at(0).trigger('click')
    await vm.$nextTick()
    buttons.at(1).trigger('click')
    await vm.$nextTick()

    expect(vm.selected).to.deep.equal(['a', 'b'])

    buttons.at(0).trigger('click')
    await vm.$nextTick()

    expect(vm.selected).to.deep.equal(['b'])

    wrapper.destroy()
  })

  it('should make prop `value` fully controlled.', async () => {
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
        template: '<veui-check-button-group :value="selected" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let buttons = wrapper.findAll('.veui-button')

    buttons.at(0).trigger('click')
    await vm.$nextTick()
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(buttons.at(0).classes()).to.not.include('veui-button-selected')
    expect(buttons.at(1).classes()).to.not.include('veui-button-selected')
    wrapper.destroy()
  })

  it('should handle exclusive items correctly.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-check-button-group': CheckButtonGroup
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a', exclusive: true },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd', exclusive: true }
            ],
            selected: ['a']
          }
        },
        template: '<veui-check-button-group v-model="selected" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let buttons = wrapper.findAll('.veui-button')

    expect(buttons.at(0).classes()).to.include('veui-button-exclusive')
    expect(buttons.at(0).classes()).to.include('veui-button-selected')

    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b'])

    buttons.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b', 'c'])

    buttons.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['a'])

    vm.selected = ['a', 'b'] // error prop
    await vm.$nextTick()
    buttons.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b', 'c'])

    vm.selected = ['a', 'd'] // error prop
    await vm.$nextTick()
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['b'])

    vm.selected = ['a', 'd', 'b'] // error prop
    await vm.$nextTick()
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['a'])

    vm.selected = ['a', 'd', 'b'] // error prop
    await vm.$nextTick()
    buttons.at(3).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal(['a'])

    wrapper.destroy()
  })

  it('should handle empty value correctly.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-check-button-group': CheckButtonGroup
        },
        data () {
          return {
            items: [
              { label: 'A', value: 'a', exclusive: true },
              { label: 'B', value: 'b' },
              { label: 'C', value: 'c' },
              { label: 'D', value: 'd', exclusive: true }
            ],
            selected: ['b'],
            emptyValue: 'a'
          }
        },
        template:
          '<veui-check-button-group :empty-value="emptyValue" v-model="selected" :items="items"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let buttons = wrapper.findAll('.veui-button')

    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(buttons.at(1).classes()).to.not.include('veui-button-selected')
    expect(buttons.at(0).classes()).to.include('veui-button-selected')
    expect(vm.selected).to.deep.equal(['a'])

    vm.emptyValue = undefined
    await vm.$nextTick()
    buttons.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.selected).to.deep.equal([])

    wrapper.destroy()
  })

  it('should handle disabled desc correctly.', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-check-button-group': CheckButtonGroup
        },
        data () {
          return {
            disabled: true,
            items: [
              { label: 'A', value: 'a', desc: 'wrong' },
              { label: 'B', value: 'b' }
            ]
          }
        },
        template:
          '<veui-check-button-group :items="items" :disabled="disabled"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let buttons = wrapper.findAll('.veui-button')

    buttons.at(0).trigger('mouseenter')
    await wait(300)
    expect(wrapper.find('.desc-popover').isVisible()).to.equal(true)
    expect(wrapper.find('.desc-popover').text()).to.contains('wrong')

    buttons.at(0).trigger('mouseout', {
      relatedTarget: document.body
    })
    await wait(300)
    expect(wrapper.find('.desc-popover').isVisible()).to.equal(false)
    wrapper.destroy()
  })
})
