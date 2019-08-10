import { mount } from '@vue/test-utils'
import Collapse from '@/components/Collapse'

describe('components/Collapse', () => {
  it('should expand/collapse correctly with local state', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-collapse': Collapse
        },
        template: `
          <veui-collapse label="点击切换">
            Content
          </veui-collapse>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let header = wrapper.find('.veui-collapse-header')

    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(false)
    header.trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(true)

    wrapper.destroy()
  })

  it('should expand/collapse correctly with .sync', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-collapse': Collapse
        },
        template: `
          <veui-collapse label="点击切换" :expanded.sync="expanded">
            Content
          </veui-collapse>`,
        data () {
          return {
            expanded: true
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let header = wrapper.find('.veui-collapse-header')

    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(true)
    header.trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(false)
    expect(vm.expanded).to.equal(false)
    vm.expanded = true

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(true)

    wrapper.destroy()
  })

  it('should expand/collapse correctly with controlled mode', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-collapse': Collapse
        },
        template: `
          <veui-collapse label="点击切换" :expanded="expanded" @toggle="toggle">
            Content
          </veui-collapse>`,
        data () {
          return {
            expanded: true
          }
        },
        methods: {
          toggle (expand, name) {
            if (expand) {
              this.expanded = true
            }
          }
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let header = wrapper.find('.veui-collapse-header')

    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(true)
    header.trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(true)
    vm.expanded = false

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(false)
    header.trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(true)

    wrapper.destroy()
  })

  it('should handle disabled state correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-collapse': Collapse
        },
        template: `
          <veui-collapse label="点击切换" disabled>
            Content
          </veui-collapse>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let header = wrapper.find('.veui-collapse-header')

    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(false)
    header.trigger('click')

    await vm.$nextTick()
    expect(wrapper.find('.veui-collapse-body').exists()).to.equal(false)

    wrapper.destroy()
  })
})
