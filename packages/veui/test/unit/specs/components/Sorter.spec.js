import { mount } from '@vue/test-utils'
import Sorter from '@/components/Sorter'

describe('components/Sorter', () => {
  it('should render `order` prop with `null` value correctly', async () => {
    let currentSort
    let wrapper = mount(Sorter, {
      listeners: {
        sort (value) {
          currentSort = value
        }
      },
      sync: false
    })
    let ascWrapper = wrapper.find('.veui-sorter-icon-asc')
    let descWrapper = wrapper.find('.veui-sorter-icon-desc')

    hasClass(wrapper, 'veui-sorter-unordered', true)
    isActive(ascWrapper, false)
    isActive(descWrapper, false)
    isInactive(ascWrapper, false)
    isInactive(descWrapper, false)

    wrapper.find('.veui-sorter').trigger('click')
    await wrapper.vm.$nextTick()

    expect(currentSort).to.equal('asc')

    wrapper.destroy()
  })

  it('should render `order` prop with `false` value correctly', async () => {
    let currentSort
    let wrapper = mount(Sorter, {
      propsData: {
        order: false
      },
      listeners: {
        sort (value) {
          currentSort = value
        }
      },
      sync: false
    })
    let ascWrapper = wrapper.find('.veui-sorter-icon-asc')
    let descWrapper = wrapper.find('.veui-sorter-icon-desc')

    hasClass(wrapper, 'veui-sorter-unordered', true)
    isActive(ascWrapper, false)
    isActive(descWrapper, false)
    isInactive(ascWrapper, false)
    isInactive(descWrapper, false)

    wrapper.find('.veui-sorter').trigger('click')
    await wrapper.vm.$nextTick()

    expect(currentSort).to.equal('asc')

    wrapper.destroy()
  })

  it('should render `order` prop with `true` value correctly', async () => {
    let currentSort
    let wrapper = mount(Sorter, {
      propsData: {
        order: true
      },
      listeners: {
        sort (value) {
          currentSort = value
        }
      },
      sync: false
    })
    let ascWrapper = wrapper.find('.veui-sorter-icon-asc')
    let descWrapper = wrapper.find('.veui-sorter-icon-desc')

    hasClass(wrapper, 'veui-sorter-unordered', false)
    hasClass(wrapper, 'veui-sorter-true', true)
    isActive(ascWrapper, false)
    isActive(descWrapper, false)
    isInactive(ascWrapper, false)
    isInactive(descWrapper, false)

    wrapper.find('.veui-sorter').trigger('click')
    await wrapper.vm.$nextTick()

    expect(currentSort).to.equal('asc')

    wrapper.destroy()
  })

  it('should render `order` prop with `asc` value correctly', async () => {
    let currentSort
    let wrapper = mount(Sorter, {
      propsData: {
        order: 'asc'
      },
      listeners: {
        sort (value) {
          currentSort = value
        }
      },
      sync: false
    })
    let ascWrapper = wrapper.find('.veui-sorter-icon-asc')
    let descWrapper = wrapper.find('.veui-sorter-icon-desc')

    hasClass(wrapper, 'veui-sorter-unordered', false)
    hasClass(wrapper, 'veui-sorter-asc', true)
    isActive(ascWrapper, true)
    isActive(descWrapper, false)
    isInactive(ascWrapper, false)
    isInactive(descWrapper, true)

    wrapper.find('.veui-sorter').trigger('click')
    await wrapper.vm.$nextTick()

    expect(currentSort).to.equal('desc')

    wrapper.destroy()
  })

  it('should render `order` prop with `desc` value correctly', async () => {
    let currentSort
    let wrapper = mount(Sorter, {
      propsData: {
        order: 'desc'
      },
      listeners: {
        sort (value) {
          currentSort = value
        }
      },
      sync: false
    })
    let ascWrapper = wrapper.find('.veui-sorter-icon-asc')
    let descWrapper = wrapper.find('.veui-sorter-icon-desc')

    hasClass(wrapper, 'veui-sorter-unordered', false)
    hasClass(wrapper, 'veui-sorter-desc', true)
    isActive(ascWrapper, false)
    isActive(descWrapper, true)
    isInactive(ascWrapper, true)
    isInactive(descWrapper, false)

    wrapper.find('.veui-sorter').trigger('click')
    await wrapper.vm.$nextTick()

    expect(currentSort).to.equal('asc')

    wrapper.destroy()
  })
})

function isActive (wrapper, status) {
  hasClass(wrapper, 'veui-sorter-active', status)
}

function isInactive (wrapper, status) {
  hasClass(wrapper, 'veui-sorter-inactive', status)
}

function hasClass (wrapper, className, status = true) {
  expect(wrapper.classes(className)).to.equal(status)
}
