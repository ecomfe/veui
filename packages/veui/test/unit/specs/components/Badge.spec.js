import { mount } from '@vue/test-utils'
import Badge from '@/components/Badge'

describe('components/Badge', () => {
  it('should render corner badge without content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge>News</veui-badge>'
    })
    const label = wrapper.find('.veui-badge-label')
    const dot = wrapper.find('.veui-badge-dot')
    expect(label.exists()).to.equal(false)
    expect(dot.exists()).to.equal(true)
  })

  it('should render corner badge with content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge value="hot">News</veui-badge>'
    })
    const label = wrapper.find('.veui-badge-label')
    const dot = wrapper.find('.veui-badge-dot')
    expect(label.exists()).to.equal(true)
    expect(dot.exists()).to.equal(false)
  })

  it('should handle `max` prop correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge :value="100" :max="99">News</veui-badge>'
    })
    const label = wrapper.find('.veui-badge-label')
    expect(label.text()).to.equal('99+')
  })

  it('should render standalone badge without content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge/>'
    })
    const dot = wrapper.find('.veui-badge-dot')
    expect(dot.exists()).to.equal(true)
    expect(wrapper.text()).to.equal('')
  })

  it('should render standalone badge with content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge value="hot"/>'
    })
    const dot = wrapper.find('.veui-badge-dot')
    expect(dot.exists()).to.equal(true)
    expect(wrapper.text()).to.equal('hot')
  })
})
