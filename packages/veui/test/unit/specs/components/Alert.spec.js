import { mount } from '../../../utils'
import Alert from '@/components/Alert'

describe('components/Alert', function () {
  it('should render right `status` for Alert', () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      template: `
          <div>
            <veui-alert status="success" message="content" closable />
            <veui-alert type="error" message="content" closable />
          </div>`
    })

    const alerts = wrapper.findAll(Alert)
    expect(alerts.at(0).contains('.veui-alert-success')).to.equal(true)
    expect(alerts.at(1).contains('.veui-alert-error')).to.equal(true)
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
        <veui-alert status="warning" :message="message" closable>
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
          status="info"
          message="content"
          closable
          @close="close"
          :open.sync="open"
          />
      `
    })
    wrapper.find('.veui-alert-close .veui-button').trigger('click')
    await wrapper.vm.$nextTick()
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
      template: '<veui-alert status="error" :message="message" closable />'
    })
    expect(wrapper.find('.veui-alert-content-multiple').exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should switch message correctly for Alert', async () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      data () {
        return {
          index: 1,
          message: ['message one', 'message two', 'message three']
        }
      },
      template:
        '<veui-alert status="error" :message="message" closable :index.sync="index" />'
    })
    let nav = wrapper.find('.veui-alert-nav')
    let prev = nav.findAll('.veui-button').at(0)
    let next = nav.findAll('.veui-button').at(1)
    let msg = wrapper.find('.veui-alert-content')
    let { vm } = wrapper
    prev.trigger('click')
    await vm.$nextTick()
    expect(msg.text()).to.equal('message one')
    prev.trigger('click')
    await vm.$nextTick()
    expect(msg.text()).to.equal('message one')
    next.trigger('click')
    await vm.$nextTick()
    expect(msg.text()).to.equal('message two')
    next.trigger('click')
    await vm.$nextTick()
    expect(msg.text()).to.equal('message three')
    next.trigger('click')
    await vm.$nextTick()
    expect(msg.text()).to.equal('message three')
    wrapper.destroy()
  })

  it('should switch to valid message if current one is removed for multiple messages', async () => {
    let wrapper = mount({
      components: {
        'veui-alert': Alert
      },
      data () {
        return {
          current: 2,
          message: ['message one', 'message two', 'message three']
        }
      },
      template: '<veui-alert :index.sync="current" :message="message" />'
    })

    let msg = wrapper.find('.veui-alert-content')
    expect(msg.text()).to.equal('message three')
    wrapper.vm.message.pop()

    await wrapper.vm.$nextTick()
    expect(msg.text()).to.equal('message two')
    wrapper.destroy()
  })

  it('should make `index` and `open` fully controlled', async () => {
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
        '<veui-alert :index="0" :open="true" :message="message" closable/>'
    })

    let nav = wrapper.find('.veui-alert-nav')
    let next = nav.findAll('.veui-button').at(1)
    let msg = wrapper.find('.veui-alert-content')
    next.trigger('click')
    await wrapper.vm.$nextTick()
    expect(msg.text()).to.equal('message one')

    wrapper.find('.veui-alert-close .veui-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-alert').exists()).to.equal(true)
    wrapper.destroy()
  })
})
