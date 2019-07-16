import { mount } from '@vue/test-utils'
import Drawer from '@/components/Drawer'

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
const debugInBrowser = {
  attachToDocument: true,
  sync: false
}

const CONTENT = '.veui-dialog-content'
const MASK = '.veui-drawer-box-mask'

describe('components/Drawer', () => {
  it('should support placement `top`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="top" />'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { top, right, left } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(top === 0).to.equal(true)
    expect(right === window.innerWidth).to.equal(true)
    expect(left === 0).to.equal(true)
    wrapper.destroy()
  })

  it('should support placement `right`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="right" />'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { top, right, bottom } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(top === 0).to.equal(true)
    expect(right === window.innerWidth).to.equal(true)
    expect(bottom === window.innerHeight).to.equal(true)
    wrapper.destroy()
  })

  it('should support placement `bottom`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="bottom" />'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { left, right, bottom } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(left === 0).to.equal(true)
    expect(right === window.innerWidth).to.equal(true)
    expect(bottom === window.innerHeight).to.equal(true)
    wrapper.destroy()
  })

  it('should support placement `left`.', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open="open" placement="left" />'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let { left, top, bottom } = wrapper
      .find(CONTENT)
      .element.getBoundingClientRect()
    expect(top === 0).to.equal(true)
    expect(bottom === window.innerHeight).to.equal(true)
    expect(left === 0).to.equal(true)
    wrapper.destroy()
  })

  it('should handle maskclick correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-drawer :open.sync="open" />'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()
    wrapper.find(MASK).trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.equal(false)
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
      debugInBrowser
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
})
