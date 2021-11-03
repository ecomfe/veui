import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { wait, mount } from '../../../utils'

describe('components/Dialog', () => {
  it('should support `sync` modifier for prop `open`.', async () => {
    let wrapper = mount({
      components: {
        'veui-dialog': Dialog
      },
      data () {
        return {
          open: true
        }
      },
      template: '<veui-dialog ref="dialog" closable :open.sync="open"/>'
    })

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

  it('should support async `before-close` function prop.', async () => {
    let wrapper = mount({
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
    })

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

    expect(wrapper.find('.veui-dialog-box').classes()).to.not.contain(
      'veui-dialog-box-mask'
    )

    wrapper.setProps({ modal: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.veui-dialog-box').classes()).to.contain(
      'veui-dialog-box-mask'
    )

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
    let wrapper = mount({
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
          <template #title">Title</template>
          <template #foot="{ close }">
            <veui-button ui="primary" @click="close('foo')">foo</veui-button>
            <veui-button @click="close">cancel</veui-button>
          </template>
        </veui-dialog>
        `
    })

    let { vm } = wrapper
    vm.open = true
    await vm.$nextTick()

    wrapper
      .find('.veui-dialog-content-foot button:first-child')
      .trigger('click')

    await vm.$nextTick()

    expect(vm.foo).to.equal(true)

    vm.open = true
    await vm.$nextTick()
    wrapper.find('.veui-dialog-content-foot button:last-child').trigger('click')

    await vm.$nextTick()

    expect(vm.open).to.equal(false)

    wrapper.destroy()
  })

  it('should make prop `open` fully controlled.', async () => {
    let wrapper = mount({
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
    })

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

  it('should respect `loading` and `disabled` props', async () => {
    let wrapper = mount({
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
    })

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

  it('should respect `ok-label` and `cancel-label` props', async () => {
    let wrapper = mount({
      components: {
        'veui-dialog': Dialog
      },
      data () {
        return {
          disabled: false,
          loading: false
        }
      },
      template: '<veui-dialog open ok-label="👍" cancel-label="👎"/>'
    })

    await wrapper.vm.$nextTick()

    let btns = wrapper.findAll('.veui-dialog-content-foot button')
    expect(btns.at(0).text()).to.equal('👍')
    expect(btns.at(1).text()).to.equal('👎')

    wrapper.destroy()
  })
})
