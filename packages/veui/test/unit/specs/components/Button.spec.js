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

  it('should be disabled when the button is loading', async () => {
    let clicked = false
    let entered = false

    const wrapper = mount(Button, {
      propsData: {
        loading: true
      },
      listeners: {
        click () {
          clicked = true
        },
        mouseenter () {
          entered = true
        }
      }
    })

    expect(wrapper.classes('veui-button-loading')).to.equal(true)
    expect(wrapper.attributes('disabled')).to.equal(undefined)
    expect(wrapper.attributes('aria-disabled')).to.equal(undefined)

    wrapper.trigger('click')
    wrapper.trigger('mouseenter')

    await wrapper.vm.$nextTick()

    expect(clicked).to.equal(false)
    expect(entered).to.equal(true)
  })

  it('should support disabled state', async () => {
    let clicked = false
    let entered = false

    const wrapper = mount(Button, {
      propsData: {
        disabled: true
      },
      listeners: {
        click () {
          clicked = true
        },
        mouseenter () {
          entered = true
        }
      }
    })

    expect(wrapper.classes('veui-disabled')).to.equal(true)
    expect(wrapper.attributes('disabled')).to.equal(undefined)
    expect(wrapper.attributes('aria-disabled')).to.equal('true')

    wrapper.trigger('click')
    wrapper.trigger('mouseenter')

    await wrapper.vm.$nextTick()

    expect(clicked).to.equal(false)
    expect(entered).to.equal(true)
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
