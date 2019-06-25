import { mount } from '@vue/test-utils'
import Tag from '@/components/Tag'

describe('components/Tag', () => {
  it('should render slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          content: 'test tag slot'
        }
      },
      template: `<veui-tag>{{ content }}</veui-tag>`
    })
    expect(wrapper.text()).to.equal('test tag slot')
    wrapper.destroy()
  })

  it('should render type prop correctly', () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      template: '<veui-tag type="success">success tag</veui-tag>'
    })
    expect(wrapper.contains('.veui-tag-success')).to.equal(true)
    wrapper.destroy()
  })

  it('should render ui correctly', () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      template: '<veui-tag ui="small">small tag</veui-tag>'
    })
    expect(wrapper.attributes('ui')).to.equal('small')
    wrapper.destroy()
  })

  it('should close the tag correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag': Tag
      },
      data () {
        return {
          close: false
        }
      },
      methods: {
        handleClose () {
          this.close = true
        }
      },
      template: `
        <veui-tag
          closable
          @close="handleClose"
        >
          closable tag
        </veui-tag>`
    })
    let closeBtn = wrapper.find('button.veui-tag-close')
    expect(closeBtn.exists()).to.equal(true)

    closeBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.veui-tag').exists()).to.equal(false)
    expect(wrapper.vm.close).to.equal(true)
    wrapper.destroy()
  })
})
