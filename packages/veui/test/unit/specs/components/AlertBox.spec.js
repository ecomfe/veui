import { mount } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox'

describe('components/AlertBox', function () {
  it('should render title prop correctly by AlertBox', () => {
    let wrapper = mount({
      components: {
        'veui-alert-box': AlertBox
      },
      template: '<veui-alert-box title="this is title" />'
    })
    expect(wrapper.find('.veui-alert-box-title').text()).to.be.equal('this is title')
    wrapper.destroy()
  })

  it('should render slot correctly by AlertBox', () => {
    let wrapper = mount({
      components: {
        'veui-alert-box': AlertBox
      },
      template: `
        <veui-alert-box>
          <div class="test-title-slot" slot="title">this is title</div>
          <div class="test-default-slot">this is content</div>
        </veui-alert-box>
      `
    })
    expect(wrapper.find('.test-title-slot').exists()).to.be.equal(true)
    expect(wrapper.find('.test-default-slot').exists()).to.be.equal(true)
    wrapper.destroy()
  })

  it('should sync `open` status correctly by AlertBox', async () => {
    let wrapper = mount({
      components: {
        'veui-alert-box': AlertBox
      },
      data () {
        return {
          open: true
        }
      },
      template: '<veui-alert-box :open.sync="open" title="title" />'
    })
    let { vm } = wrapper
    wrapper.find('.veui-button').trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.be.equal(false)
    wrapper.destroy()
  })

  it('should handle close event correctly by AlertBox', async () => {
    let count = 0
    let wrapper = mount({
      components: {
        'veui-alert-box': AlertBox
      },
      data () {
        return {
          open: true,
          beforeClose (type) {
            count++
            return true
          }
        }
      },
      methods: {
        ok () {
          count++
        }
      },
      template: `
        <veui-alert-box 
          :open.sync="open" 
          title="title" 
          :before-close="beforeClose"
          @ok="ok" />
      `
    })
    wrapper.find('.veui-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(count).to.be.equal(2)
    wrapper.destroy()
  })
})
