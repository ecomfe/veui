import { mount } from '@vue/test-utils'
import Sidebar from '@/components/Sidebar'

const options = {
  components: {
    'veui-sidebar': Sidebar
  },
  data () {
    return {
      collapsible: true,
      collapsed: true,
      mode: 'slim'
    }
  }
}

describe('components/Sidebar', () => {
  it('should handle collapsed prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-sidebar collapsible :collapsed.sync="collapsed" collapse-mode="slim"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let sidebar = wrapper.find('.veui-layout-sidebar')
    expect(sidebar.classes()).to.contains('veui-layout-sidebar-collapsed')

    let { vm } = wrapper
    vm.collapsed = false
    await vm.$nextTick()
    expect(sidebar.classes()).to.not.contains('veui-layout-sidebar-collapsed')

    sidebar.find('.veui-layout-sidebar-toggle-inside').trigger('click')
    await vm.$nextTick()
    expect(vm.collapsed).to.equal(true)
    wrapper.destroy()
  })

  it('should handle collapsible prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-sidebar :collapsible="collapsible" collapse-mode="slim"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let toggle = wrapper.find('.veui-layout-sidebar-toggle-inside')
    expect(toggle.exists()).to.equal(true)

    let { vm } = wrapper
    vm.collapsible = false
    await vm.$nextTick()
    toggle = wrapper.find('.veui-layout-sidebar-toggle-inside')
    expect(toggle.exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should handle collapseMode prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template: '<veui-sidebar collapsible :collapse-mode="mode"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    expect(
      wrapper.find('.veui-layout-sidebar-toggle-inside').exists()
    ).to.equal(true)
    expect(wrapper.find('.veui-layout-sidebar-float-toggle').exists()).to.equal(
      false
    )

    let { vm } = wrapper
    vm.mode = 'hidden'
    await vm.$nextTick()
    expect(
      wrapper.find('.veui-layout-sidebar-toggle-inside').exists()
    ).to.equal(false)
    expect(wrapper.find('.veui-layout-sidebar-float-toggle').exists()).to.equal(
      true
    )

    wrapper.destroy()
  })
})
