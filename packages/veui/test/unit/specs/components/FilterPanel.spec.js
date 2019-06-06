import { mount } from '@vue/test-utils'
import FilterPanel from '@/components/FilterPanel'
import { wait } from '../../../utils'

let datasource = [
  { label: 'AA', value: 'a' },
  { label: 'AB', value: 'b' },
  { label: 'BC', value: 'c' }
]

describe('components/FilterPanel', () => {
  it('should render `title` props correctly', () => {
    let wrapper = mount(FilterPanel, {
      propsData: {
        title: 'Title'
      }
    })

    expect(wrapper.find('.veui-filter-panel-title').text()).to.equal('Title')

    wrapper.destroy()
  })

  it('should render `head` slots correctly', () => {
    let wrapper = mount(FilterPanel, {
      slots: {
        head: 'Title'
      }
    })

    expect(wrapper.find('.veui-filter-panel-title').text()).to.equal('Title')

    wrapper.destroy()
  })

  it('should render `datasource` props correctly', () => {
    let wrapper = mount(FilterPanel, {
      propsData: {
        datasource
      },
      scopedSlots: {
        default: `
          <div>
            <div 
              v-for="item in props.items" 
              :key="item.value"
              class="test-datasource">{{item.label}}</div>
          </div>
        `
      },
      sync: false
    })

    expect(
      wrapper
        .find('.veui-filter-panel-content-main')
        .findAll('.test-datasource')
        .length
    ).to.equal(3)

    wrapper.destroy()
  })

  it('should render `no data` correctly when datasource was not set', () => {
    let wrapper = mount(FilterPanel, {
      slots: {
        'no-data': 'no data'
      }
    })

    expect(
      wrapper
        .find('.veui-filter-panel-no-data')
        .text()
    ).to.equal('no data')

    wrapper.destroy()
  })

  it('should not render searchbox when `searchable` was set to false', () => {
    let wrapper = mount(FilterPanel, {
      propsData: {
        searchable: false
      }
    })

    expect(wrapper.find('.veui-searchbox').exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should render the filtered datasource correctly when searching keyword', async () => {
    let wrapper = mount(FilterPanel, {
      propsData: {
        datasource
      },
      scopedSlots: {
        default: `
          <div>
            <div 
              v-for="item in props.items"
              v-if="!item.hidden"
              :key="item.value"
              class="test-datasource">{{item.label}}</div>
          </div>
        `
      },
      sync: false
    })
    let items

    wrapper.find('input').setValue('A')
    await wait(300)

    items = wrapper
      .find('.veui-filter-panel-content-main')
      .findAll('.test-datasource')

    expect(items.length).to.equal(2)
    expect(items.at(0).text()).to.equal('AA')
    expect(items.at(1).text()).to.equal('AB')

    wrapper.find('input').setValue('AB')
    await wait(300)

    items = wrapper
      .find('.veui-filter-panel-content-main')
      .findAll('.test-datasource')

    expect(items.length).to.equal(1)
    expect(items.at(0).text()).to.equal('AB')

    wrapper.destroy()
  })
})
