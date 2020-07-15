import { mount } from '@vue/test-utils'
import Menu from '@/components/Menu'
import 'veui-theme-dls-icons/eye'

const fullPathMatches = (route, item) => {
  return route.fullPath === item.path + item.to
}

const options = {
  components: {
    'veui-menu': Menu
  },
  data () {
    return {
      active: 'Input',
      expanded: ['一级导航1', '二级导航11'],
      collapsed: true,
      fullPathMatches,
      items: [
        {
          label: '一级导航1',
          name: '一级导航1',
          icon: 'eye',
          children: [
            {
              label: '二级导航11',
              name: '二级导航11',
              children: [
                {
                  label: 'Input',
                  name: 'Input',
                  to: '#input'
                },
                {
                  label: 'Progress',
                  to: '/menu/progress'
                }
              ]
            },
            {
              label: '二级导航12',
              name: '二级导航12',
              children: [
                {
                  label: 'Link121',
                  to: 'Link121'
                },
                {
                  label: 'Link122',
                  to: 'Link122'
                }
              ]
            }
          ]
        }
      ]
    }
  }
}

describe('components/Menu', () => {
  it('should handle ui prop & collapsible prop correctly', () => {
    let wrapper = mount(
      {
        ...options,
        template: `<div>
          <veui-menu class="small-menu" ui="s" :items="items"/>
          <veui-menu class="large-menu" ui="l" :items="items" collapsible/>
        </div>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let menuUI = wrapper.find('.veui-menu.small-menu').attributes().ui
    let menuTreeUI = wrapper.find('.small-menu .veui-menu-tree').attributes().ui
    let menuLinkUI = wrapper.find('.small-menu .veui-menu-link').attributes().ui
    expect(menuUI).to.include('s')
    expect(menuTreeUI).to.include('s')
    expect(menuLinkUI).to.include('s')

    let largeMenuUI = wrapper.find('.veui-menu.large-menu').attributes().ui
    let largeMenuTreeUI = wrapper
      .find('.large-menu .veui-menu-tree')
      .attributes().ui
    let largeMenuLinkUI = wrapper
      .find('.large-menu .veui-menu-link')
      .attributes().ui
    expect(largeMenuUI).to.include('l')
    expect(largeMenuTreeUI).to.include('l')
    expect(largeMenuLinkUI).to.include('l')

    let collapseSwitcher = wrapper.find('.small-menu .veui-menu-toggle')
    expect(collapseSwitcher.exists()).to.equal(false)

    let largeCollapseSwitcher = wrapper.find('.large-menu .veui-menu-toggle')
    expect(largeCollapseSwitcher.exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should handle collapsed prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-menu collapsible :collapsed.sync="collapsed" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let menu = wrapper.find('.veui-menu')
    expect(menu.classes('veui-menu-collapsed')).to.equal(true)

    let { vm } = wrapper
    vm.collapsed = false
    await vm.$nextTick()
    expect(menu.classes('veui-menu-collapsed')).to.equal(false)

    wrapper.find('.veui-menu-toggle').trigger('click')
    await vm.$nextTick()
    expect(menu.classes('veui-menu-collapsed')).to.equal(true)
    expect(vm.collapsed).to.equal(true)
    wrapper.destroy()
  })

  it('should handle expanded prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template: '<veui-menu :expanded.sync="expanded" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let menuUI = wrapper.find('.veui-menu-tree-item')
    expect(menuUI.classes('veui-menu-item-expanded')).to.equal(true)

    wrapper.find('.veui-menu-item-toggle').trigger('click')
    await vm.$nextTick()
    expect(menuUI.classes('veui-menu-item-expanded')).to.equal(false)

    wrapper.find('.veui-menu-item-toggle').trigger('click')
    await vm.$nextTick()
    expect(menuUI.classes('veui-menu-item-expanded')).to.equal(true)
    expect(wrapper.findAll('.veui-menu-item').length).to.equal(5)
    wrapper.destroy()
  })

  it('should handle active prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-menu :active.sync="active" :items="items" :matches="fullPathMatches"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let item = wrapper.findAll('.veui-menu-item').at(2)
    expect(item.classes('veui-menu-item-exact-active')).to.equal(true)

    vm.active = null
    await vm.$nextTick()
    expect(item.classes('veui-menu-item-exact-active')).to.equal(false)

    item = wrapper.findAll('.veui-menu-link').at(2)
    item.trigger('click')
    await vm.$nextTick()
    expect(vm.active).to.equal('Input')
    wrapper.destroy()
  })

  it('should expand active items correctly on activating', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-menu :active.sync="active" :expanded.sync="expanded" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    await vm.$nextTick()
    let item = wrapper.findAll('.veui-menu-item').at(2)
    expect(item.find('.veui-menu-item-label').text()).to.equal('Input')
    expect(vm.expanded).to.deep.equal(['一级导航1', '二级导航11'])
    wrapper.destroy()
  })
})
