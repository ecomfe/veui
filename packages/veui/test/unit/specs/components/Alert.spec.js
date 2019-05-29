import { mount } from '@vue/test-utils'
import Alert from '@/components/Alert'
import { wait } from '../../../utils'

describe('components/Alert', function () {
  it('shoule render right type for Alert', () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      template: '<veui-alert type="success" message="content" closable />'
    })
    expect(wrapper.contains('.veui-alert-success')).to.be.equal(true)
    wrapper.destroy()
  })

  it('should render slot successfully for Alert', () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      data () {
        return {
          message: 'default slot content'
        }
      },
      template: `
        <veui-alert type="warning" :message="message" closable>
          <div slot-scope="{message}">{{ message }}</div>
        </veui-alert>
      `
    })
    expect(wrapper.text()).to.be.equal('default slot content')
    wrapper.destroy()
  })

  it('should close the message successfully for Alert', async () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      data () {
        return {
          open: true,
          closed: false
        }
      },
      methods: {
        close () {
          this.closed = true
        }
      },
      template: `
        <veui-alert 
          type="info" 
          message="content" 
          closable 
          close-label="close"
          @update:open="val => open = val"
          @close="close"
          :open="open"
          />
      `
    })
    wrapper.find('.veui-alert-close-text').trigger('click')
    await wait(500)
    expect(wrapper.find('.veui-alert').exists()).to.be.equal(false)
    expect(wrapper.vm.open).to.be.equal(false)
    expect(wrapper.vm.closed).to.be.equal(true)
    wrapper.destroy()
  })

  it('should render multiple message successfully for Alert', () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      data () {
        return {
          message: ['message one', 'message two', 'message three']
        }
      },
      template: '<veui-alert type="error" :message="message" closable />'
    })
    expect(wrapper.find('.veui-alert-nav').exists()).to.be.equal(true)
    wrapper.destroy()
  })

  it('should switch message correctly for Alert', () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      data () {
        return {
          message: ['message one', 'message two', 'message three']
        }
      },
      template: '<veui-alert type="error" :message="message" closable :index="1" />'
    })
    let nav = wrapper.find('.veui-alert-nav')
    let prev = nav.findAll('.veui-button').at(0)
    let next = nav.findAll('.veui-button').at(1)
    prev.trigger('click')
    expect(wrapper.text()).to.be.equal('message one  1/3')
    prev.trigger('click')
    expect(wrapper.text()).to.be.equal('message one  1/3')
    next.trigger('click')
    expect(wrapper.text()).to.be.equal('message two  2/3')
    next.trigger('click')
    expect(wrapper.text()).to.be.equal('message three  3/3')
    next.trigger('click')
    expect(wrapper.text()).to.be.equal('message three  3/3')
    wrapper.destroy()
  })
})
