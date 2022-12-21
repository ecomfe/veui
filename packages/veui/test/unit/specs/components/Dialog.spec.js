import { config } from '@vue/test-utils'
import Dialog from '@/components/Dialog'
import Button from '@/components/Button'
import { wait, mount } from '../../../utils'

config.stubs.transition = false

describe('components/Dialog', function () {
  this.timeout(10000)

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
      .find('.veui-dialog-content-foot .veui-button:first-child')
      .trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper
      .find('.veui-dialog-content-foot .veui-button:last-child')
      .trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper.find('.veui-dialog-content-head-close').trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    wrapper.destroy()
  })

  it('should respect `escapable`', async () => {
    let wrapper = mount({
      components: {
        'veui-dialog': Dialog
      },
      data () {
        return {
          open: true,
          escapable: false
        }
      },
      template: '<veui-dialog :open.sync="open" :escapable="escapable"/>'
    })

    let { vm } = wrapper

    wrapper.find('.veui-dialog-content').trigger('keydown.esc')

    await vm.$nextTick()
    expect(vm.open).to.equal(true)
    vm.escapable = true

    await vm.$nextTick()
    expect(vm.open).to.equal(true)
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
            return new Promise((resolve) => {
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
    wrapper
      .find('.veui-dialog-content-foot .veui-button:last-child')
      .trigger('click')

    await vm.$nextTick()
    expect(vm.open).to.equal(false)

    vm.open = true

    await vm.$nextTick()
    wrapper
      .find('.veui-dialog-content-foot .veui-button:first-child')
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
      .find('.veui-dialog-content-foot .veui-button:first-child')
      .trigger('click')

    await vm.$nextTick()

    expect(vm.foo).to.equal(true)

    vm.open = true
    await vm.$nextTick()
    wrapper
      .find('.veui-dialog-content-foot .veui-button:last-child')
      .trigger('click')

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
      .find('.veui-dialog-content-foot .veui-button:first-child')
      .trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-dialog-box').isVisible()).to.equal(true)

    wrapper
      .find('.veui-dialog-content-foot .veui-button:last-child')
      .trigger('click')
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
    let btn = wrapper.find('.veui-dialog-content-foot .veui-button:first-child')
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

    let btns = wrapper.findAll('.veui-dialog-content-foot .veui-button')
    expect(btns.at(0).text()).to.equal('👍')
    expect(btns.at(1).text()).to.equal('👎')

    wrapper.destroy()
  })

  it('should respect `outside-closable` prop and `afteropen`/`afterclose` event', (done) => {
    let wrapper = mount(
      {
        components: {
          'veui-dialog': Dialog
        },
        template: `
        <veui-dialog :open.sync="open" @afteropen="handleOpen" @afterclose="handleClose" outside-closable>
          <div id="foo">foo</div>
        </veui-dialog>`,
        data () {
          return {
            open: false
          }
        },
        methods: {
          async handleOpen () {
            expect(wrapper.find('#foo').text()).to.equal('foo')

            document.body.dispatchEvent(new MouseEvent('click'))
          },
          async handleClose () {
            expect(document.querySelector('#foo') === null).to.not.equal(true)

            await wait(350)
            wrapper.destroy()
            done()
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    vm.open = true
  })

  it('should handle autofocus correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-dialog': Dialog
        },
        template:
          '<veui-dialog :open="open"><button :autofocus="autofocus">FOO</button></veui-dialog>',
        data () {
          return {
            autofocus: true,
            open: true
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    await wait(100)
    expect(document.activeElement.textContent.trim()).to.equal('FOO')
    wrapper.vm.open = false
    wrapper.vm.autofocus = false

    await wait(350)
    wrapper.vm.open = true

    await wait(100)
    expect(document.activeElement.textContent.trim()).to.equal('取消')

    wrapper.find('.veui-dialog-box').trigger('mousedown')
    await wait(100)
    expect(
      document.activeElement.classList.contains('veui-dialog-content')
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should handle the width of dialog correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-dialog': Dialog
        },
        template: `<veui-dialog
            open
            :overlay-style="{
              [widthProp]: width ? width + 'px' : ''
            }"
          ><div id="foo" style="width: 100%;">foo</div></veui-dialog>`,
        data () {
          return {
            asContentWidth: false,
            width: 300
          }
        },
        computed: {
          widthProp () {
            return `--veui-dialog-${this.asContentWidth ? 'content-' : ''}width`
          }
        }
      },
      {
        attachToDocument: true
      }
    )
    const { vm } = wrapper
    await wait(100)
    let content = wrapper.find('.veui-dialog-content').element
    expect(getComputedStyle(content).width).to.equal(`${vm.width}px`)

    vm.width = 400
    await wait(100)
    expect(getComputedStyle(content).width).to.equal(`${vm.width}px`)

    vm.width = null
    await wait(100)
    expect(getComputedStyle(content).width).to.equal('600px')

    vm.asContentWidth = true
    vm.width = 400
    await wait(100)
    const foo = wrapper.find('#foo').element
    expect(getComputedStyle(foo).width).to.equal(`${vm.width}px`)

    wrapper.destroy()
  })
})
