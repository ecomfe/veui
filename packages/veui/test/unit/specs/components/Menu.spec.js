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
      collapsed2: false,
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
        },
        {
          label: '一级导航2',
          name: '一级导航2',
          icon: 'eye'
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
    expect(wrapper.findAll('.veui-menu-item').length).to.equal(6)
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

  it('should handle keyboard navigation correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-menu collapsible :collapsed.sync="collapsed2" :active.sync="active" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let links = wrapper.findAll('.veui-menu-link')
    let endIndex = links.length - 1
    links.at(0).trigger('keydown', { key: 'Down' })
    await vm.$nextTick()

    expect(links.at(1).attributes().tabindex).to.equal('0')

    links.at(endIndex).trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    expect(links.at(0).attributes().tabindex).to.equal('0')

    links.at(0).trigger('keydown', { key: 'Up' })
    await vm.$nextTick()
    expect(links.at(endIndex).attributes().tabindex).to.equal('0')

    links.at(1).trigger('keydown', { key: 'Up' })
    await vm.$nextTick()
    expect(links.at(0).attributes().tabindex).to.equal('0')

    links.at(0).trigger('keydown', { key: 'Right' })
    let items = wrapper.findAll('.veui-menu-item')
    await vm.$nextTick()
    expect(items.at(0).classes()).to.include('veui-menu-item-expanded')

    links.at(1).trigger('keydown', { key: 'Right' })
    links.at(2).trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.active).to.equal('Input')

    links.at(0).trigger('keydown', { key: 'Left' })
    await vm.$nextTick()
    expect(items.at(0).classes()).to.not.include('veui-menu-item-expanded')

    links.at(0).trigger('keydown', { key: 'End' })
    await vm.$nextTick()
    expect(links.at(endIndex).attributes().tabindex).to.equal('0')

    links.at(endIndex).trigger('keydown', { key: 'Home' })
    await vm.$nextTick()
    expect(links.at(0).attributes().tabindex).to.equal('0')

    links.at(0).trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    expect(links.at(0).attributes().tabindex).to.equal('-1')
    expect(links.at(endIndex).attributes().tabindex).to.equal('0')

    wrapper.find('.veui-menu-toggle').trigger('click')
    await vm.$nextTick()
    expect(links.at(0).attributes().tabindex).to.equal('0')
    expect(links.at(endIndex).attributes().tabindex).to.equal('-1')
    wrapper.destroy()
  })

  it('should handle slots correctly', () => {
    let wrapper = mount(
      {
        ...options,
        template: `
          <div>
            <veui-menu :items="items">
              <template #item="{ label }">
                <span class="my-item">{{ label }}</span>
              </template>
            </veui-menu>
            <veui-menu :items="items">
              <template #item-label="{ label }">
                😀 {{ label }}
              </template>
            </veui-menu>
          </div>`
      },
      {
        sync: false
      }
    )

    const menus = wrapper.findAll(Menu)
    expect(
      menus
        .at(0)
        .find('.veui-menu-item-label')
        .exists()
    ).to.equal(false)
    expect(
      menus
        .at(0)
        .find('.veui-menu-item')
        .exists()
    ).to.equal(false)
    expect(
      menus
        .at(0)
        .find('.my-item')
        .exists()
    ).to.equal(true)
    expect(
      menus
        .at(1)
        .find('.veui-menu-item-label')
        .exists()
    ).to.equal(true)
    expect(
      menus
        .at(1)
        .find('.veui-menu-item')
        .exists()
    ).to.equal(true)
  })
})
