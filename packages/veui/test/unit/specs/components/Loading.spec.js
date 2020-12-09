import { mount } from '@vue/test-utils'
import Loading from '@/components/Loading'

describe('components/Loading', () => {
  it('should not render loading component if loading prop is false', () => {
    let wrapper = mount(
      {
        components: {
          'veui-loading': Loading
        },
        template: '<veui-loading ui="s vertical">加载中</veui-loading>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    expect(wrapper.find('.veui-loading').exists()).to.equal(false)
    wrapper.destroy()
  })

  it('should handle default slot correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-loading': Loading
        },
        template:
          '<veui-loading ui="s vertical" loading>加载中...</veui-loading>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    expect(wrapper.find('.veui-loading-text').text()).to.equal('加载中...')
    wrapper.destroy()
  })

  it('should handle spinner slot correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-loading': Loading
        },
        template: `
        <veui-loading ui="s vertical" loading>
          加载中...
          <template slot="spinner"><span class="custom-spinner">custom spinner content</span></template>
        </veui-loading>
      `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    expect(wrapper.find('.custom-spinner').text()).to.equal(
      'custom spinner content'
    )
    wrapper.destroy()
  })
})
