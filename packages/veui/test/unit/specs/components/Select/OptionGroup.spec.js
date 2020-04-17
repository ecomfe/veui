import Select from 'veui/components/Select'
import Dropdown from 'veui/components/Dropdown'
import Option from 'veui/components/Option'
import OptionGroup from 'veui/components/OptionGroup'
import { mount } from '@vue/test-utils'

describe('components/Select/OptionGroup', () => {
  it('should pass down the `disabled` prop to the Option.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: [
              {
                value: 1,
                label: '1',
                disabled: true
              },
              {
                value: 2,
                label: '2',
                disabled: false
              }
            ]
          }
        },
        template: `<veui-select :options="options"/>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let disabledWrappers = wrapper.findAll('.veui-option-disabled')
    expect(disabledWrappers.length).to.equal(1)
    wrapper.destroy()
  })

  it('should handle disabled prop of OptionGroup correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: [
              {
                label: 'a',
                value: 'a'
              },
              {
                label: 'b',
                disabled: true,
                options: [
                  {
                    label: 'c',
                    value: 'c'
                  },
                  {
                    label: 'd',
                    value: 'd'
                  }
                ]
              }
            ]
          }
        },
        template: '<veui-select :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    await wrapper.vm.$nextTick()

    let disabledWrappers = wrapper.findAll('.veui-option-disabled')
    expect(disabledWrappers.length).to.equal(2)
    wrapper.destroy()
  })

  it('should not open subMenu if disabled prop of OptionGroup is true', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: [
              {
                label: 'a',
                position: 'popup',
                options: [
                  {
                    label: 'e',
                    value: 'e'
                  }
                ]
              },
              {
                label: 'b',
                disabled: true,
                position: 'popup',
                options: [
                  {
                    label: 'c',
                    value: 'c'
                  },
                  {
                    label: 'd',
                    value: 'd'
                  }
                ]
              }
            ]
          }
        },
        template: '<veui-select :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    await wrapper.vm.$nextTick()

    let controlButton = wrapper.find('.veui-select-trigger .veui-input-main')
    controlButton.trigger('click')
    await wrapper.vm.$nextTick()
    let options = wrapper.findAll('.veui-option')
    let command = wrapper.findAll('.veui-option-group-button')
    expect(options.length).to.equal(3)
    command.wrappers[1].trigger('click')
    await wrapper.vm.$nextTick()
    let menus = wrapper.findAll('.veui-option-group-box')
    expect(menus.wrappers[1].element.style.display).to.equal('none')
    command.wrappers[0].trigger('click')
    await wrapper.vm.$nextTick()
    expect(menus.wrappers[0].element.style.display).to.equal('')
    wrapper.destroy()
  })

  it('should handle trigger prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-dropdown': Dropdown
        },
        data () {
          return {
            options: [
              {
                label: 'h',
                position: 'popup',
                options: [
                  {
                    label: 'm',
                    value: 'm'
                  },
                  {
                    label: 'n',
                    value: 'n'
                  }
                ]
              }
            ]
          }
        },
        template:
          '<veui-dropdown label="Go" :options="options" trigger="hover"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let btn = wrapper.find('.veui-dropdown-button')
    btn.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    let label = wrapper.find('.veui-option-group-button')
    label.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    let group = wrapper.find('.veui-option-group-box')
    expect(group.element.style.display).to.equal('')
    wrapper.destroy()
  })

  it('should render `before` and `after` slot correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select,
          'veui-option-group': OptionGroup,
          'veui-option': Option
        },
        template: `
        <veui-select>
          <veui-option-group label="A" position="popup" overlay-class="my-group">
            <veui-option value="a0" label="A.0"/>
            <veui-option value="a1" label="A.1"/>
            <veui-option value="a2" label="A.2"/>
            <template #before>BEFORE</template>
            <template #after>AFTER</template>
          </veui-option-group>
        </veui-select>
      `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    wrapper.find(Select).vm.expanded = true

    await wrapper.vm.$nextTick()
    wrapper
      .find(
        '.veui-option-group:not([aria-hidden="true"]) > .veui-option-group > .veui-option-group-button'
      )
      .trigger('click')
    await wrapper.vm.$nextTick()

    let options = wrapper.find(
      '.veui-option-group-options[aria-expanded="true"]'
    )
    expect(options.element.firstChild.nodeValue).to.equal('BEFORE')
    expect(options.element.lastChild.nodeValue).to.equal('AFTER')

    wrapper.destroy()
  })
})
