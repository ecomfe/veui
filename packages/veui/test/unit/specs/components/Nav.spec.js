import { mount } from '@vue/test-utils'
import Nav from '@/components/Nav'
import { wait } from '../../../utils'

const fullPathMatches = (route, item) => {
  return route.fullPath === item.path + item.to
}

const options = {
  components: {
    'veui-nav': Nav
  },
  data () {
    return {
      active: 'Input',
      width: '180px',
      fullPathMatches,
      items: [
        {
          label: 'Group One',
          name: 'group-one',
          position: 'card',
          children: [
            {
              label: 'Sub One',
              name: 'sub-one',
              children: [
                {
                  label: 'Input',
                  name: 'Input'
                }
              ]
            }
          ]
        },
        {
          label: 'Button',
          name: 'Button',
          to: '#button',
          children: [
            {
              label: 'OptionGroup',
              name: 'OptionGroup',
              children: [
                {
                  label: 'Link',
                  name: 'Link'
                }
              ]
            }
          ]
        },
        {
          label: 'Loading',
          name: 'Loading'
        }
      ]
    }
  }
}

describe('components/Nav', () => {
  it('should handle ui prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template: `<div>
          <veui-nav class="small-nav" ui="s" :items="items"/>
          <veui-nav class="large-nav" ui="l" :items="items"/>
        </div>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let navUI = wrapper.find('.small-nav').attributes().ui
    let navLinkUI = wrapper.find('.small-nav .veui-nav-item').attributes().ui
    expect(navUI).to.include('s')
    expect(navLinkUI).to.include('s')

    navUI = wrapper.find('.large-nav').attributes().ui
    navLinkUI = wrapper.find('.large-nav .veui-nav-item').attributes().ui
    expect(navUI).to.include('l')
    expect(navLinkUI).to.include('l')

    wrapper.find('.small-nav .veui-nav-item').trigger('mouseenter')
    await vm.$nextTick()
    let overlay = document.querySelector('.veui-nav-overlay').getAttribute('ui')
    expect(overlay).to.include('s')
    wrapper.destroy()
  })

  it('should handle controlled active prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template: '<veui-nav :active.sync="active" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let item = wrapper.findAll('.veui-nav-body .veui-nav-item').at(0)
    expect(item.classes('veui-nav-item-active')).to.equal(true)

    vm.active = null
    await vm.$nextTick()
    expect(item.classes('veui-nav-item-active')).to.equal(false)
    wrapper
      .findAll('.veui-nav-body .veui-nav-item')
      .at(1)
      .trigger('click')
    await vm.$nextTick()
    expect(vm.active).to.equal('Button')
    wrapper.destroy()
  })

  it('should handle uncontrolled active prop correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-nav ref="nav" :items="items" :matches="fullPathMatches"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    wrapper
      .findAll('.veui-nav-body .veui-nav-item')
      .at(1)
      .trigger('click')
    await vm.$nextTick()
    expect(vm.$refs.nav.realActive).to.equal('Button')
    wrapper.destroy()
  })

  it('should collapse correctly on resizing', async () => {
    let wrapper = mount(
      {
        ...options,
        template: '<veui-nav :style="{width}" ref="nav" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    await vm.$nextTick()
    let length = wrapper.findAll(
      '.veui-nav-body .veui-nav-item:not(.veui-nav-more)'
    ).length
    expect(length).to.equal(1)

    vm.width = 'auto'
    vm.$refs.nav.renderAllThenUpdateLayout()
    await vm.$nextTick()
    length = wrapper.findAll('.veui-nav-body .veui-nav-item').length
    expect(length).to.equal(3)
    wrapper.destroy()
  })

  it('should alway emit `click` event on clicking nav item', async () => {
    let wrapper = mount(
      {
        ...options,
        template: '<veui-nav ref="nav" :items="items"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let count = 0
    vm.$refs.nav.$on('click', () => {
      count++
    })

    let items = wrapper.findAll('.veui-nav-body .veui-nav-item')
    items.at(0).trigger('click')
    expect(count).to.equal(1)
    items.at(1).trigger('mouseenter')
    await wait(300)
    document.querySelector('.veui-nav-overlay .veui-nav-item').click()
    expect(count).to.equal(2)
    wrapper.destroy()
  })

  it('should handle keyboard navigation correctly', async () => {
    let wrapper = mount(
      {
        ...options,
        template:
          '<veui-nav :active.sync="active" :items="items" :matches="fullPathMatches"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let items = wrapper.findAll('.veui-nav-body .veui-nav-item')
    let endIndex = items.length - 1
    items.at(0).trigger('keydown', { key: 'Right' })
    await vm.$nextTick()
    expect(items.at(1).classes()).to.include('focus-visible')

    items.at(endIndex).trigger('keydown', { key: 'Right' })
    await vm.$nextTick()
    expect(items.at(0).classes()).to.include('focus-visible')

    items.at(0).trigger('keydown', { key: 'Left' })
    await vm.$nextTick()
    expect(items.at(endIndex).classes()).to.include('focus-visible')

    items.at(0).trigger('keydown', { key: 'End' })
    await vm.$nextTick()
    expect(items.at(endIndex).classes()).to.include('focus-visible')
    items.at(endIndex).trigger('keydown', { key: 'Home' })
    await vm.$nextTick()
    expect(items.at(0).classes()).to.include('focus-visible')

    items.at(0).trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    expect(items.at(0).classes()).to.include('veui-nav-item-open')

    items.at(0).trigger('keydown', { key: 'Esc' })
    await vm.$nextTick()
    expect(items.at(0).classes()).to.not.include('veui-nav-item-open')

    items.at(1).trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.active).to.equal('Button')

    wrapper.destroy()
  })
})
