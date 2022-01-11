import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import ui from '@/managers/ui'

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

  it('should be focusable', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-button': Button
        },
        template: '<veui-button :disabled="disabled"/>',
        data () {
          return {
            disabled: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const Btn = wrapper.find(Button)
    const { vm } = wrapper

    Btn.vm.focus()
    expect(document.activeElement).to.equal(Btn.element)

    Btn.element.blur()
    vm.disabled = true
    await vm.$nextTick()
    Btn.vm.focus()
    expect(document.activeElement).to.equal(Btn.element)

    wrapper.destroy()
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

  it('should support emulate native button', async () => {
    let count = 0
    const wrapper = mount(
      {
        components: {
          'veui-button': Button
        },
        template: `
        <form @submit="handleSubmit">
          <veui-button
            aria-label="wow"
            name="foo"
            :disabled="disabled"
            type="submit"
          />
        </form>`,
        data () {
          return {
            disabled: false
          }
        },
        methods: {
          handleSubmit (e) {
            count++
            e.preventDefault()
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const button = wrapper.find('button')
    const Btn = wrapper.find(Button)
    const { vm } = wrapper

    expect(Btn.attributes('aria-label')).to.equal('wow')
    expect(button.attributes('type')).to.equal('submit')
    expect(button.attributes('name')).to.equal('foo')

    Btn.trigger('click')
    await vm.$nextTick()
    expect(count).to.equal(1)

    Btn.trigger('keypress', { key: 'Enter' })
    await vm.$nextTick()
    expect(count).to.equal(2)

    Btn.trigger('keypress', { key: ' ' })
    await vm.$nextTick()
    expect(count).to.equal(2)

    Btn.trigger('keydown', { key: ' ' })
    Btn.trigger('keyup', { key: ' ' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    Btn.trigger('keydown', { key: ' ' })
    Btn.trigger('blur')
    Btn.trigger('keyup', { key: ' ' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    Btn.trigger('keyup', { key: ' ' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    Btn.trigger('keydown', { key: 'A' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    Btn.trigger('keyup', { key: 'A' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    vm.disabled = true
    await vm.$nextTick()

    Btn.trigger('click')
    await vm.$nextTick()
    expect(count).to.equal(3)

    Btn.trigger('keypress', { key: 'Enter' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    Btn.trigger('keydown', { key: ' ' })
    Btn.trigger('keyup', { key: ' ' })
    await vm.$nextTick()
    expect(count).to.equal(3)

    wrapper.destroy()
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

  it('should support icon config', () => {
    ui.set('button.icons', {
      loading: 'loading'
    })

    const wrapper = mount(Button, {
      propsData: {
        loading: true
      }
    })

    expect(wrapper.find('.veui-icon').exists()).to.equal(true)

    ui.set('button.icons', {})
  })
})
