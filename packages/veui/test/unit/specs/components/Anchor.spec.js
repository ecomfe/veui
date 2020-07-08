import { mount } from '@vue/test-utils'
import Anchor from '@/components/Anchor'

const ANCHOR_ITEM = '.veui-anchor-item'

let componentOptions = {
  components: {
    'veui-anchor': Anchor
  },
  data () {
    return {
      coffees: [
        {
          label: 'Infused',
          value: '#infused',
          children: [
            {
              label: 'Breadcrumb',
              value: '/breadcrumb'
            }
          ]
        },
        {
          label: 'Boiled',
          value: '#boiled',
          children: [
            {
              label: 'Button',
              value: '/button'
            }
          ]
        },
        {
          label: 'Espresso',
          value: '#espresso'
        },
        {
          label: 'Milk coffee',
          value: '#milk-coffee'
        }
      ]
    }
  }
}

const debugInBrowser = {
  attachToDocument: true,
  sync: false
}

describe('components/Anchor', function () {
  it('should render items correctly', () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-anchor :items="coffees"/>'
      },
      debugInBrowser
    )

    let items = wrapper.findAll(ANCHOR_ITEM)
    expect(items.length === 6).to.equal(true)
    wrapper.destroy()
  })

  it('should handle scroll correctly when container is window(or falsy)', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<div style="padding-top: 50px;">
            <veui-anchor :items="coffees"/>
            <veui-anchor class="anchor-two" :items="coffees" :sticky="false"/>
            <div style="height: 200vh;"/>
          </div>`
      },
      debugInBrowser
    )
    await wrapper.vm.$nextTick()
    // 滚动一下
    window.scrollTo(0, 100)
    await wrapper.vm.$nextTick()
    let stickyFirstAnchor = wrapper.find(ANCHOR_ITEM)
    await new Promise(resolve => {
      setTimeout(() => {
        expect(
          stickyFirstAnchor.element.getBoundingClientRect().top === 0
        ).to.equal(true)
        let staticFirstAnchor = wrapper.find(`.anchor-two ${ANCHOR_ITEM}`)
        expect(
          staticFirstAnchor.element.getBoundingClientRect().top !== 0
        ).to.equal(true)
        resolve()
      }, 500)
    })

    // 滚动回来
    window.scrollTo(0, 0)
    await new Promise(resolve => {
      setTimeout(() => {
        expect(
          stickyFirstAnchor.element.getBoundingClientRect().top !== 0
        ).to.equal(true)
        resolve()
      }, 500)
    })
    wrapper.destroy()
  })

  it('should handle scroll correctly when container is a element', async () => {
    // 先覆盖掉 body 的默认样式
    document.body.style.margin = '0px'
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<div ref="wrapper" style="overflow: auto;height: 80vh;">
            <div style="height: 10px;"/>
            <veui-anchor ref="anchor" :items="coffees" container="wrapper"/>
            <veui-anchor class="anchor-two" :items="coffees" :sticky="false"/>
            <div style="height: 200vh;"/>
          </div>`
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await wrapper.vm.$nextTick()
    // 滚动一下
    vm.$refs.wrapper.scrollTop = 100
    await vm.$nextTick()
    let stickyFirstAnchor = wrapper.find(ANCHOR_ITEM)
    await new Promise(resolve => {
      setTimeout(() => {
        expect(
          stickyFirstAnchor.element.getBoundingClientRect().top === 0
        ).to.equal(true)
        let staticFirstAnchor = wrapper.find(`.anchor-two ${ANCHOR_ITEM}`)
        expect(
          staticFirstAnchor.element.getBoundingClientRect().top !== 0
        ).to.equal(true)
        resolve()
      }, 500)
    })

    // 滚动回来
    vm.$refs.wrapper.scrollTop = 0
    await new Promise(resolve => {
      setTimeout(() => {
        expect(
          stickyFirstAnchor.element.getBoundingClientRect().top !== 0
        ).to.equal(true)
        resolve()
      }, 500)
    })
    document.body.style.margin = ''
    wrapper.destroy()
  })

  it('should handle click correctly', async () => {
    document.body.style.margin = '0px'
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<div ref="wrapper" style="overflow: auto;height: 80vh;">
            <div style="height: 10px;"/>
            <veui-anchor ref="anchor" :items="coffees" container="wrapper"/>
            <div id="infused" style="height: 200vh;"/>
          </div>`
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()
    let stickyFirstAnchor = wrapper.find(ANCHOR_ITEM)
    stickyFirstAnchor.trigger('click')
    // 延时检查下
    await new Promise(resolve => {
      setTimeout(() => {
        expect(
          stickyFirstAnchor.element.getBoundingClientRect().top === 0
        ).to.equal(true)
        resolve()
      }, 500)
    })
    document.body.style.margin = ''
    wrapper.destroy()
  })
})
