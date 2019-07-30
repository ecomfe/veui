import { mount } from '@vue/test-utils'
import Loading from '@/components/Loading'

describe('components/Loading', () => {
  it('should handle ui prop correctly', () => {
    let wrapper = mount(
      {
        components: {
          'veui-loading': Loading
        },
        template:
          '<veui-loading ui="s vertical reverse" loading>加载中</veui-loading>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let textWrapperUI = wrapper.find('.veui-loading-text').attributes().ui
    let spinnerWrapperUI = wrapper.find('.veui-loading-spinner').attributes()
      .ui
    expect(textWrapperUI).to.include('s')
    expect(textWrapperUI).to.include('reverse')
    expect(textWrapperUI).to.include('vertical')
    expect(spinnerWrapperUI).to.include('s')
    expect(spinnerWrapperUI).to.include('reverse')
    expect(spinnerWrapperUI).to.include('vertical')
    wrapper.destroy()
  })

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
