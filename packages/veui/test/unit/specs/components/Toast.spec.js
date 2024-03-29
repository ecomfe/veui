import Toast from '@/components/Toast'
import { mount, wait } from '../../../utils'

describe('components/Toast', function () {
  it('shoule render right `status` for Toast', () => {
    let wrapper = mount({
      components: {
        'veui-toast': Toast
      },
      template: `
        <div>
          <veui-toast status="success" message="content" open/>
          <veui-toast type="error" message="content" open/>
        </div>`
    })

    const toasts = wrapper.findAll(Toast)
    expect(toasts.at(0).contains('.veui-toast-success')).to.equal(true)
    expect(toasts.at(1).contains('.veui-toast-error')).to.equal(true)
    wrapper.destroy()
  })

  it('should render slot correctly for Toast', () => {
    let wrapper = mount({
      components: {
        'veui-toast': Toast
      },
      data () {
        return {
          message: 'default slot content'
        }
      },
      template: `
        <veui-toast status="warning" open>
          <div>{{ message }}</div>
        </veui-toast>
      `
    })
    expect(wrapper.text()).to.equal('default slot content')
    wrapper.destroy()
  })

  it('should close the message correctly for Toast', async () => {
    let wrapper = mount({
      components: {
        'veui-toast': Toast
      },
      data () {
        return {
          open: true,
          duration: 1000,
          closed: false
        }
      },
      methods: {
        close () {
          this.closed = true
        }
      },
      template: `
        <veui-toast
          status="info"
          message="content"
          @close="close"
          :duration="duration"
          :open.sync="open"
        />`
    })
    await wait(1000)
    expect(wrapper.find('.veui-toast').exists()).to.equal(false)
    expect(wrapper.vm.open).to.equal(false)
    expect(wrapper.vm.closed).to.equal(true)
    wrapper.destroy()
  })

  it('should Toast disappears normally', async () => {
    let wrapper = mount({
      components: {
        'veui-toast': Toast
      },
      data () {
        return {
          open: true,
          duration: 1000
        }
      },
      template: `
        <veui-toast
          status="info"
          message="content"
          :duration="duration"
          :open.sync="open"
        />`
    })
    await wait(500)
    expect(wrapper.find('.veui-toast').exists()).to.equal(true)
    await wait(500)
    expect(wrapper.find('.veui-toast').exists()).to.equal(false)
    wrapper.destroy()
  })

  it('should make prop `open` fully controlled', async () => {
    let wrapper = mount({
      components: {
        'veui-toast': Toast
      },
      template: `
        <veui-toast
          status="info"
          message="content"
          closable
          :open="true"
        />`
    })

    wrapper.find('.veui-button').trigger('click')
    await wait(500)
    expect(wrapper.find('.veui-toast').exists()).to.equal(true)
    wrapper.destroy()
  })
})
