import { mount } from '@vue/test-utils'
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { wait } from '../../../utils'

describe('components/Dialog', () => {
  it('should support `sync` modifier for prop `open`.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-dialog': Dialog
        },
        data () {
          return {
            open: true
          }
        },
        template: '<veui-dialog ref="dialog" closable :open.sync="open"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    wrapper
      .find('.veui-dialog-content-foot button:first-child')
      .trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper.find('.veui-dialog-content-foot button:last-child').trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper.find('.veui-dialog-content-head-close').trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper.find('.veui-dialog-content').trigger('keydown.esc')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    wrapper.destroy()
  })

  it('should support async `beforeClose` function prop.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-dialog': Dialog
        },
        data () {
          return {
            open: true,
            confirm (type) {
              if (type !== 'ok') {
                return
              }
              return new Promise(resolve => {
                setTimeout(() => resolve(), 300)
              })
            }
          }
        },
        template:
          '<veui-dialog ref="dialog" :open.sync="open" :before-close="confirm"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    wrapper.find('.veui-dialog-content-foot button:last-child').trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper
      .find('.veui-dialog-content-foot button:first-child')
      .trigger('click')

    await wait(100)
    expect(vm.open).to.equal(true)

    await wait(500)
    expect(vm.open).to.equal(false)

    wrapper.destroy()
  })

  it('should support customized modal property correctly.', async () => {
    let wrapper = mount(Dialog, {
      propsData: {
        modal: false,
        open: true
      },
      sync: false
    })

    expect(
      wrapper.vm.$refs.overlay.overlayClass['veui-dialog-box-mask']
    ).to.equal(false)

    wrapper.setProps({ modal: true })

    await wrapper.vm.$nextTick()

    expect(
      wrapper.vm.$refs.overlay.overlayClass['veui-dialog-box-mask']
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should render slot correctly.', () => {
    let wrapper = mount(Dialog, {
      sync: false,
      propsData: {
        open: true
      },
      slots: {
        default: 'Content',
        title: 'Title',
        foot: 'Foot'
      }
    })

    expect(wrapper.find('.veui-dialog-content-head-title').text()).to.equal(
      'Title'
    )
    expect(wrapper.find('.veui-dialog-content-body').text()).to.equal('Content')
    expect(wrapper.find('.veui-dialog-content-foot').text()).to.equal('Foot')

    wrapper.destroy()
  })

  it('should support customized close(*) event', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            foo: false,
            open: false
          }
        },
        components: {
          'veui-dialog': Dialog,
          'veui-button': Button
        },
        methods: {
          handleFoo () {
            this.foo = true
          }
        },
        template: `
        <veui-dialog :open.sync="open" @foo="handleFoo">
          <template slot="title">Title</template>
          <template slot="foot" slot-scope="prop">
            <veui-button ui="primary" @click="prop.close('foo')">foo</veui-button>
            <veui-button ui="primary" @click="prop.close">cancel</veui-button>
          </template>
        </veui-dialog>
        `
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    vm.open = true

    await vm.$nextTick()

    wrapper
      .find('.veui-dialog-content-foot button:first-child')
      .trigger('click')

    await vm.$nextTick()

    expect(vm.foo).to.equal(true)

    wrapper.find('.veui-dialog-content-foot button:last-child').trigger('click')

    await vm.$nextTick()

    expect(vm.open).to.equal(false)

    wrapper.destroy()
  })

  it('should make prop `open` fully controlled.', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            open: true
          }
        },
        components: {
          'veui-dialog': Dialog,
          'veui-button': Button
        },
        template: `
        <veui-dialog :open="open">
          <template slot="title">Title</template>
          <template slot="foot" slot-scope="prop">
            <veui-button ui="primary" @click="prop.close">ok</veui-button>
            <veui-button @click="prop.close">cancel</veui-button>
          </template>
        </veui-dialog>
        `
      },
      {
        sync: false
      }
    )

    wrapper
      .find('.veui-dialog-content-foot button:first-child')
      .trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-dialog-box').isVisible()).to.equal(true)

    wrapper.find('.veui-dialog-content-foot button:last-child').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-dialog-box').isVisible()).to.equal(true)

    wrapper.destroy()
  })

  it('should honor `loading` and `disabled` prop', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-dialog': Dialog
        },
        data () {
          return {
            disabled: false,
            loading: false
          }
        },
        template: '<veui-dialog open :disabled="disabled" :loading="loading"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let btn = wrapper.find('.veui-dialog-content-foot button:first-child')
    expect(btn.classes('veui-disabled')).to.equal(false)
    expect(btn.classes('veui-button-loading')).to.equal(false)

    vm.disabled = true
    await vm.$nextTick()
    expect(btn.classes('veui-disabled')).to.equal(true)
    expect(btn.classes('veui-button-loading')).to.equal(false)

    vm.disabled = false
    vm.loading = true
    await vm.$nextTick()
    expect(btn.classes('veui-disabled')).to.equal(false)
    expect(btn.classes('veui-button-loading')).to.equal(true)

    wrapper.destroy()
  })
})
