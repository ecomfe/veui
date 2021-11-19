import { wait, mount } from '../../../utils'
import Pagination from '@/components/Pagination'

describe('components/Pagination', () => {
  it('should handle props correctly', async () => {
    let wrapper = mount(Pagination, {
      propsData: {
        page: 1,
        total: 25,
        pageSize: 20,
        pageSizes: [20, 40],
        showTotal: true
      },
      sync: false
    })

    expect(wrapper.find('.veui-pagination-total').text()).to.equal('共 25 条')
    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await wrapper.vm.$nextTick()
    let options = wrapper
      .find('.veui-pagination-select-overlay')
      .findAll('.veui-option')
    expect(options.length).to.equal(2)
    expect(
      options
        .at(0)
        .find('.veui-option')
        .classes('veui-option-selected')
    ).to.equal(true)
    expect(
      options
        .at(0)
        .find('.veui-option-label')
        .text()
    ).to.equal('20条/页')
    expect(
      options
        .at(1)
        .find('.veui-option-label')
        .text()
    ).to.equal('40条/页')

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
    let wrapper = mount(Pagination, {
      propsData: {
        page: 6,
        total: 300
      },
      sync: false
    })

    let { vm } = wrapper
    // pages is: 1, ..., 5, 6, 7, ..., 15
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
    ).to.equal('')
    expect(
      pages
        .at(2)
        .find('.veui-link')
        .text()
    ).to.equal('5')

    expect(
      pages
        .at(4)
        .find('.veui-link')
        .text()
    ).to.equal('7')
    expect(
      pages
        .at(5)
        .find('.veui-link')
        .text()
    ).to.equal('')
    expect(
      pages
        .at(6)
        .find('.veui-link')
        .text()
    ).to.equal('15')

    wrapper.setProps({ page: 12 })
    await vm.$nextTick()

    // pages are: 1，...，11, 12, 13, 14, 15
    pages = wrapper.findAll('.veui-pagination-page')
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
    ).to.equal('')
    expect(
      pages
        .at(2)
        .find('.veui-link')
        .text()
    ).to.equal('11')
    expect(
      pages
        .at(5)
        .find('.veui-link')
        .text()
    ).to.equal('14')

    wrapper.destroy()
  })

  it('should handle redirect event correctly', () => {
    let wrapper = mount(Pagination, {
      propsData: {
        page: 4,
        total: 300
      },
      sync: false
    })

    wrapper.vm.$on('redirect', page => {
      expect(page).to.equal(5)
    })

    wrapper.find('.veui-pagination-next').trigger('click')

    wrapper.destroy()
  })

  it('should support goto feature correctly', () => {
    let wrapper = mount(Pagination, {
      propsData: {
        page: 4,
        total: 300,
        goto: true
      },
      sync: false
    })

    let pages = []
    wrapper.vm.$on('redirect', page => {
      pages.push(page)

      if (pages.length === 2) {
        expect(pages).to.deep.equal([10, 20])
      }
    })

    let input = wrapper.find('.veui-pagination-goto input')

    input.setValue('10')
    input.trigger('keydown.enter')

    input.setValue('20')
    wrapper.find('.veui-pagination-goto input').trigger('click')

    wrapper.destroy()
  })

  it('should handle focus-visible correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-pagination': Pagination
        },
        template:
          '<veui-pagination :page="4" :total="300" to="/pagination/:page"/>'
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    let page = wrapper.findAll('.veui-pagination-page a').at(1)

    page.element.focus()
    page.trigger('keydown.tab')

    await wait(0)
    expect(page.classes('focus-visible')).to.equal(true)

    page.element.blur()

    await wait(0)
    expect(page.classes('focus-visible')).to.equal(false)

    wrapper.destroy()
  })
})
