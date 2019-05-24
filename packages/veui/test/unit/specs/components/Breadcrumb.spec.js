import { mount } from '@vue/test-utils'
import Breadcrumb from '@/components/Breadcrumb'
import BreadcrumbItem from '@/components/BreadcrumbItem'

let routes = [
  {
    label: 'label 1',
    to: '/home'
  },
  {
    label: 'label 2',
    to: '/list',
    native: true,
    customAttr: 'custom attr'
  },
  {
    label: 'label 3'
  }
]

describe('components/Breadcrumb', () => {
  it('should handle routes prop with `null` value.', () => {
    let wrapper = mount(Breadcrumb, {
      propsData: {
        routes: undefined
      }
    })

    expect(wrapper.contains('.veui-breadcrumb')).to.equal(true)
    wrapper.destroy()
  })

  it('should render label correctly.', () => {
    let wrapper = mount(Breadcrumb, {
      propsData: {
        routes
      }
    })

    let items = wrapper.findAll(BreadcrumbItem)
    expect(items.at(0).text()).to.equal('label 1')
    expect(items.at(1).text()).to.equal('label 2')
    expect(items.at(2).text()).to.equal('label 3')
    wrapper.destroy()
  })

  it('should render item slot correctly.', () => {
    let wrapper = mount(Breadcrumb, {
      propsData: {
        routes
      },
      scopedSlots: {
        item: `
          <template slot-scope="props">
            {{ props.index + 1 }} {{ props.label }} {{ props.customAttr }}
          </template>
        `
      }
    })

    let items = wrapper.findAll(BreadcrumbItem)
    expect(items.at(0).text()).to.equal('1 label 1')
    expect(items.at(1).text()).to.equal('2 label 2 custom attr')
    expect(items.at(2).text()).to.equal('3 label 3')
    wrapper.destroy()
  })

  it('should render separator slot correctly.', () => {
    let wrapper = mount(Breadcrumb, {
      propsData: {
        routes
      },
      slots: {
        separator: '<span class="test-separator">--</span>'
      }
    })

    expect(wrapper.find('.test-separator').text()).to.equal('--')
  })

  it('should set the default type of the last route to `text`.', () => {
    let wrapper = mount(Breadcrumb, {
      propsData: {
        routes
      }
    })

    expect(wrapper.findAll(BreadcrumbItem).at(2).props('type')).to.equal('text')
  })

  it('should handle `redirect` event correctly.', () => {
    let wrapper = mount(Breadcrumb, {
      propsData: {
        routes
      }
    })

    wrapper.find(BreadcrumbItem).vm.$emit('redirect')
    let payloads = wrapper.emitted().redirect[0]
    expect(payloads[1]).to.eql(routes[0])
    expect(payloads[2]).to.equal(0)
  })
})
