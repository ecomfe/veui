import { mount } from '@vue/test-utils'
import Pagination from '@/components/Pagination'

describe('components/Pagination', () => {
  it('should handle props correctly', async () => {
    let wrapper = mount(Pagination, {
      propsData: {
        page: 1,
        total: 25,
        pageSize: 20
      }
    },
    {
      sync: false
    })

    // pages is: 1, 2
    let pages = wrapper.findAll('li.veui-pagination-page')

    expect(pages.length).to.be.equal(2)
    expect(pages.at(0).classes('veui-active')).to.be.equal(true)
    expect(wrapper.find('.veui-pagination-prev').classes('veui-disabled')).to.be.equal(true)
    expect(wrapper.find('.veui-pagination-next').classes('veui-disabled')).to.be.equal(false)

    wrapper.destroy()
  })

  it('should render page indicator series correctly', async () => {
    let wrapper = mount(Pagination, {
      propsData: {
        page: 6,
        total: 300
      }
    },
    {
      sync: false
    })

    let { vm } = wrapper
    // pages is: 1, ... , 4, 5, 6, 7, 8, ... , 10
    let pages = wrapper.findAll('li.veui-pagination-page')
    expect(pages.at(0).find('.veui-link').text()).to.be.equal('1')
    expect(pages.at(1).find('.veui-link').text()).to.be.equal('...')
    expect(pages.at(2).find('.veui-link').text()).to.be.equal('4')

    expect(pages.at(6).find('.veui-link').text()).to.be.equal('8')
    expect(pages.at(7).find('.veui-link').text()).to.be.equal('...')
    expect(pages.at(8).find('.veui-link').text()).to.be.equal('10')

    wrapper.setProps({ page: 7 })
    await vm.$nextTick()

    // pages is: 1, 2，... , 5，6, 7, 8, 9, 10
    pages = wrapper.findAll('li.veui-pagination-page')
    expect(pages.at(1).find('.veui-link').text()).to.be.equal('2')
    expect(pages.at(2).find('.veui-link').text()).to.be.equal('...')
    expect(pages.at(3).find('.veui-link').text()).to.be.equal('5')

    wrapper.destroy()
  })

  it('should handle redirect event correctly', () => {
    let wrapper = mount(Pagination, {
      propsData: {
        page: 4,
        total: 300
      }
    },
    {
      sync: false
    })

    wrapper.vm.$on('redirect', page => {
      expect(page).to.be.equal(5)
    })

    wrapper.find('.veui-pagination-next').trigger('click')

    wrapper.destroy()
  })
})
