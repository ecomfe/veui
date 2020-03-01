import { mount } from '@vue/test-utils'
import Button from '@/components/Button'

describe('components/Button', () => {
  it('should create a button component with `primary` ui', () => {
    const wrapper = mount(Button, {
      propsData: {
        ui: 'primary'
      }
    })

    expect(wrapper.attributes('ui').split(/\s+/)).to.include('primary')
  })

  it('should be disabled when the button is loading', () => {
    const wrapper = mount(Button, {
      propsData: {
        loading: true
      }
    })

    expect(wrapper.classes('veui-button-loading')).to.equal(true)
    expect(wrapper.attributes('disabled')).to.equal('disabled')
  })

  it('should support disabled state', () => {
    const wrapper = mount(Button, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.classes('veui-disabled')).to.equal(true)
    expect(wrapper.attributes('disabled')).to.equal('disabled')
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

    expect(wrapper.contains(VItalic)).to.equal(true)
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
    expect(wrapper.vm.hasClick).to.equal(true)
  })
})
