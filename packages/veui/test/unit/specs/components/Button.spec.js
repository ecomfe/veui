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

    expect(wrapper.attributes('ui')).to.be.equal('primary')
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

    expect(wrapper.contains(SpinIcon)).to.be.equal(true)
    expect(wrapper.classes()).to.include('veui-button-loading')
    expect(wrapper.attributes('disabled')).to.be.equal('disabled')
  })

  it('should support disabled state', () => {
    const wrapper = mount(Button, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.classes()).to.include('veui-disabled')
    expect(wrapper.attributes('disabled')).to.be.equal('disabled')
  })

  it('should support submit type', () => {
    const wrapper = mount(Button, {
      propsData: {
        type: 'submit'
      }
    })

    expect(wrapper.attributes('type')).to.include('submit')
  })

  it('should support set default slot', () => {
    const VItalic = {
      name: 'v-italic',
      template: '<i>Veui Button</i>'
    }
    const wrapper = mount(Button, {
      slots: {
        default: VItalic
      }
    })

    expect(wrapper.contains(VItalic)).to.be.equal(true)
  })

  it('should handle click', async () => {
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
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.hasClick).to.be.equal(true)
  })
})
