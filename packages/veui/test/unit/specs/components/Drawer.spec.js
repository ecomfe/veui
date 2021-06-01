import { mount, wait } from '../../../utils'
import Drawer from '@/components/Drawer'
import Button from '@/components/Button'

let componentOptions = {
  components: {
    'veui-drawer': Drawer
  },
  data () {
    return {
      open: true
    }
  }
}
const attach = {
  attachToDocument: true
}

const CONTENT = '.veui-dialog-content'

describe('components/Drawer', () => {
  it('should support placement `top`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="top" />'
      },
      attach
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { top, right, left } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(top).to.equal(0)
    expect(right).to.equal(window.innerWidth)
    expect(left).to.equal(0)
    wrapper.destroy()
  })

  it('should support placement `right`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="right" />'
      },
      attach
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { top, right, bottom } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(top).to.equal(0)
    expect(right).to.equal(window.innerWidth)
    expect(bottom).to.equal(window.innerHeight)
    wrapper.destroy()
  })

  it('should support placement `bottom`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="bottom" />'
      },
      attach
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { left, right, bottom } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(left).to.equal(0)
    expect(right).to.equal(window.innerWidth)
    expect(bottom).to.equal(window.innerHeight)
    wrapper.destroy()
  })

  it('should support placement `left`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="left" />'
      },
      attach
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { left, top, bottom } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(top).to.equal(0)
    expect(bottom).to.equal(window.innerHeight)
    expect(left).to.equal(0)
    wrapper.destroy()
  })

  it('should render slot correctly.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-drawer :open="open">Content
        <template slot="title" slot-scoped="{close}">Title</template>
        <template slot="foot">Foot</template>
        </veui-drawer>`
      },
      attach
    )
    let { vm } = wrapper
    await vm.$nextTick()

    expect(
      wrapper
        .find('.veui-dialog-content-head-title')
        .text()
        .includes('Title')
    ).to.equal(true)
    expect(
      wrapper
        .find('.veui-dialog-content-body')
        .text()
        .includes('Content')
    ).to.equal(true)
    expect(
      wrapper
        .find('.veui-dialog-content-foot')
        .text()
        .includes('Foot')
    ).to.equal(true)
    wrapper.destroy()
  })

  it('should support `sync` modifier for prop `open`.', async () => {
    let wrapper = mount({
      components: {
        'veui-drawer': Drawer
      },
      data () {
        return {
          open: true
        }
      },
      template: '<veui-drawer ref="dialog" closable :open.sync="open"/>'
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
        'veui-drawer': Drawer
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
        '<veui-drawer ref="dialog" :open.sync="open" :before-close="confirm"/>'
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
    let wrapper = mount(Drawer, {
      propsData: {
        modal: false,
        open: true
      }
    })

    expect(
      wrapper.find('veui-x-overlay').classes('veui-dialog-box-mask')
    ).to.equal(false)

    wrapper.setProps({ modal: true })

    await wrapper.vm.$nextTick()

    expect(
      wrapper.find('veui-x-overlay').classes('veui-dialog-box-mask')
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should render slot correctly.', () => {
    let wrapper = mount(Drawer, {
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
        'veui-drawer': Drawer,
        'veui-button': Button
      },
      methods: {
        handleFoo () {
          this.foo = true
        }
      },
      template: `
        <veui-drawer :open.sync="open" @foo="handleFoo">
          <template #title">Title</template>
          <template #foot="{ close }">
            <veui-button ui="primary" @click="close('foo')">foo</veui-button>
            <veui-button @click="close">cancel</veui-button>
          </template>
        </veui-drawer>
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
        'veui-drawer': Drawer,
        'veui-button': Button
      },
      template: `
        <veui-drawer :open="open">
          <template slot="title">Title</template>
          <template slot="foot" slot-scope="prop">
            <veui-button ui="primary" @click="prop.close">ok</veui-button>
            <veui-button @click="prop.close">cancel</veui-button>
          </template>
        </veui-drawer>
        `
    })

    wrapper
      .find('.veui-dialog-content-foot button:first-child')
      .trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-drawer-box').isVisible()).to.equal(true)

    wrapper.find('.veui-dialog-content-foot button:last-child').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-drawer-box').isVisible()).to.equal(true)

    wrapper.destroy()
  })

  it('should respect `loading` and `disabled` props', async () => {
    let wrapper = mount({
      components: {
        'veui-drawer': Drawer
      },
      data () {
        return {
          disabled: false,
          loading: false
        }
      },
      template: '<veui-drawer open :disabled="disabled" :loading="loading"/>'
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
        'veui-drawer': Drawer
      },
      data () {
        return {
          disabled: false,
          loading: false
        }
      },
      template: '<veui-drawer open ok-label="👍" cancel-label="👎"/>'
    })

    await wrapper.vm.$nextTick()

    let btns = wrapper.findAll('.veui-dialog-content-foot button')
    expect(btns.at(0).text()).to.equal('👍')
    expect(btns.at(1).text()).to.equal('👎')

    wrapper.destroy()
  })
})
