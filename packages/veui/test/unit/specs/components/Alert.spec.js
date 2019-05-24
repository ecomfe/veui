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
    expect(wrapper.contains('.veui-alert-success')).to.equal(true)
    wrapper.destroy()
  })

  it('should render slot correctly for Alert', () => {
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
    expect(wrapper.text()).to.equal('default slot content')
    wrapper.destroy()
  })

  it('should close the message correctly for Alert', async () => {
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
          @close="close"
          :open.sync="open"
          />
      `
    })
    wrapper.find('.veui-alert-close-text').trigger('click')
    await wait(500)
    expect(wrapper.find('.veui-alert').exists()).to.equal(false)
    expect(wrapper.vm.open).to.equal(false)
    expect(wrapper.vm.closed).to.equal(true)
    wrapper.destroy()
  })

  it('should render multiple message correctly for Alert', () => {
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
    expect(wrapper.find('.veui-alert-message-multiple').exists()).to.equal(true)
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
      template:
        '<veui-alert type="error" :message="message" closable :index="1" />'
    })
    let nav = wrapper.find('.veui-alert-nav')
    let prev = nav.findAll('.veui-button').at(0)
    let next = nav.findAll('.veui-button').at(1)
    let msg = wrapper.find('.veui-alert-message')
    prev.trigger('click')
    expect(msg.text()).to.equal('message one')
    prev.trigger('click')
    expect(msg.text()).to.equal('message one')
    next.trigger('click')
    expect(msg.text()).to.equal('message two')
    next.trigger('click')
    expect(msg.text()).to.equal('message three')
    next.trigger('click')
    expect(msg.text()).to.equal('message three')
    wrapper.destroy()
  })
})
