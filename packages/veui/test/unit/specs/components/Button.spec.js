import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import Icon from '@/components/Icon'

describe('components/Button', () => {
  it('should create a button component with `primary` ui', () => {
    const wrapper = mount(Button, {
      propsData: {
        ui: 'primary'
      }
    })

    expect(wrapper.attributes('ui')).toBe('primary')
  })

  it('should be disabled when the button is loading', () => {
    const SpinIcon = {
      components: {
        'veui-icon': Icon
      },
      template: '<veui-icon name="spinner" spin />'
    }
    const wrapper = mount(Button, {
      propsData: {
        loading: true
      },
      slots: {
        loading: SpinIcon
      }
    })

    expect(wrapper.contains(SpinIcon)).toBe(true)
    expect(wrapper.classes()).toContain('veui-button-loading')
    expect(wrapper.attributes('disabled')).toBe('disabled')
  })

  it('should support disabled state', () => {
    const wrapper = mount(Button, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.classes()).toContain('veui-disabled')
    expect(wrapper.attributes('disabled')).toBe('disabled')
  })

  it('should support submit type', () => {
    const wrapper = mount(Button, {
      propsData: {
        type: 'submit'
      }
    })

    expect(wrapper.attributes('type')).toContain('submit')
  })

  it('should support set default slot', () => {
    const Slot = {
      name: 'Slot',
      template: '<i>Veui Button</i>'
    }
    const wrapper = mount(Button, {
      slots: {
        default: Slot
      }
    })

    expect(wrapper.contains(Slot)).toBe(true)
  })

  it('should handle click', (done) => {
    const ButtonClick = {
      components: {
        'veui-button': Button
      },
      methods: {
        handleClick () {
          this.hasClick = true
        }
      },
      data () {
        return {
          hasClick: false
        }
      },
      template: '<veui-button @click="handleClick" ui="primary" />'
    }
    const wrapper = mount(ButtonClick)
    wrapper.find('.veui-button').trigger('click')
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.hasClick).toBe(true)
      done()
    })
  })
})
