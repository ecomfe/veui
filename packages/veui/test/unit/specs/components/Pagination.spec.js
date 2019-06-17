import { mount } from '@vue/test-utils'
import Pagination from '@/components/Pagination'

describe('components/Pagination', () => {
  it('should handle props correctly', async () => {
    let wrapper = mount(
      Pagination,
      {
        propsData: {
          page: 1,
          total: 25,
          pageSize: 20,
          pageSizes: [20, 40]
        }
      },
      {
        sync: false
      }
    )

    let { realTotal, realPageSize, pageCount, realPageSizes } = wrapper.vm

    expect(realTotal).to.equal(25)
    expect(realPageSize).to.equal(20)
    expect(pageCount).to.equal(2)

    expect(realPageSizes.length).to.equal(2)
    expect(realPageSizes[0].value).to.equal(20)
    expect(realPageSizes[1].value).to.equal(40)

    // pages is: 1, 2
    let pages = wrapper.findAll('.veui-pagination-page')
    expect(pages.length).to.equal(2)
    expect(pages.at(0).classes('veui-active')).to.equal(true)
    expect(
      wrapper.find('.veui-pagination-prev').classes('veui-disabled')
    ).to.equal(true)
    expect(
      wrapper.find('.veui-pagination-next').classes('veui-disabled')
    ).to.equal(false)

    wrapper.destroy()
  })

  it('should render page indicator series correctly', async () => {
    let wrapper = mount(
      Pagination,
      {
        propsData: {
          page: 6,
          total: 300
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    // pages is: 1, ... , 4, 5, 6, 7, 8, ... , 10
    let pages = wrapper.findAll('.veui-pagination-page')
    expect(
      pages
        .at(0)
        .find('.veui-link')
        .text()
    ).to.equal('1')
    expect(
      pages
        .at(1)
        .find('.veui-link')
        .text()
    ).to.equal('...')
    expect(
      pages
        .at(2)
        .find('.veui-link')
        .text()
    ).to.equal('4')

    expect(
      pages
        .at(6)
        .find('.veui-link')
        .text()
    ).to.equal('8')
    expect(
      pages
        .at(7)
        .find('.veui-link')
        .text()
    ).to.equal('...')
    expect(
      pages
        .at(8)
        .find('.veui-link')
        .text()
    ).to.equal('10')

    wrapper.setProps({ page: 7 })
    await vm.$nextTick()

    // pages is: 1, 2，... , 5，6, 7, 8, 9, 10
    pages = wrapper.findAll('.veui-pagination-page')
    expect(
      pages
        .at(1)
        .find('.veui-link')
        .text()
    ).to.equal('2')
    expect(
      pages
        .at(2)
        .find('.veui-link')
        .text()
    ).to.equal('...')
    expect(
      pages
        .at(3)
        .find('.veui-link')
        .text()
    ).to.equal('5')

    wrapper.destroy()
  })

  it('should handle redirect event correctly', () => {
    let wrapper = mount(
      Pagination,
      {
        propsData: {
          page: 4,
          total: 300
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('redirect', page => {
      expect(page).to.equal(5)
    })

    wrapper.find('.veui-pagination-next').trigger('click')

    wrapper.destroy()
  })
})
