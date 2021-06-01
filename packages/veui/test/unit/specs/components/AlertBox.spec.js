import { mount, config } from '@vue/test-utils'
import AlertBox from '@/components/AlertBox'
import { wait } from '../../../utils'

config.stubs.transition = false

describe('components/AlertBox', function () {
  it('should render title prop correctly by AlertBox', () => {
    let wrapper = mount(
      {
        components: {
          'veui-alert-box': AlertBox
        },
        template: '<veui-alert-box open title="this is title" />'
      },
      {
        sync: false
      }
    )
    expect(wrapper.find('.veui-alert-box-title').text()).to.equal(
      'this is title'
    )
    wrapper.destroy()
  })

  it('should render slot correctly by AlertBox', () => {
    let wrapper = mount(
      {
        components: {
          'veui-alert-box': AlertBox
        },
        template: `
        <veui-alert-box open>
          <div class="test-title-slot" slot="title">this is title</div>
          <div class="test-default-slot">this is content</div>
        </veui-alert-box>
      `
      },
      {
        sync: false
      }
    )
    expect(wrapper.find('.test-title-slot').exists()).to.equal(true)
    expect(wrapper.find('.test-default-slot').exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should sync `open` status correctly by AlertBox', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-alert-box': AlertBox
        },
        data () {
          return {
            open: true
          }
        },
        template: '<veui-alert-box :open.sync="open" title="title" />'
      },
      {
        sync: false
      }
    )
    let { vm } = wrapper
    wrapper.find('.veui-button').trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.equal(false)
    wrapper.destroy()
  })

  it('should handle close event correctly by AlertBox', async () => {
    let count = 0
    let wrapper = mount(
      {
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
          },
          afterClose () {
            count++
          }
        },
        template: `
          <veui-alert-box
            :open.sync="open"
            title="title"
            :before-close="beforeClose"
            @ok="ok"
            @afterclose="afterClose" />
        `
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    wrapper.find('.veui-button').trigger('click')
    await wait(600)
    expect(count).to.equal(3)
    wrapper.destroy()
  })

  it('should make `open` prop fully controlled', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-alert-box': AlertBox
        },
        data () {
          return {
            open: true
          }
        },
        template: '<veui-alert-box :open="open" title="title" />'
      },
      {
        sync: false
      }
    )
    wrapper.find('.veui-button').trigger('click')
    await wait(600)
    expect(wrapper.find('.veui-alert-box-icon-wrapper').exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should respect `loading` and `disabled` props', async () => {
    let wrapper = mount({
      components: {
        'veui-alert-box': AlertBox
      },
      data () {
        return {
          disabled: false,
          loading: false
        }
      },
      template: '<veui-alert-box open :disabled="disabled" :loading="loading"/>'
    })

    let { vm } = wrapper
    let btn = wrapper.find('.veui-dialog-content-foot button')
    expect(btn.classes('veui-disabled')).to.equal(false)
    expect(btn.classes('veui-button-loading')).to.equal(false)

    vm.disabled = true
    await vm.$nextTick()
    expect(btn.classes('veui-disabled')).to.equal(true)
    expect(btn.classes('veui-button-loading')).to.equal(false)

    vm.disabled = false
    vm.loading = true
    await vm.$nextTick()
    expect(btn.classes('veui-disabled')).to.equal(false)
    expect(btn.classes('veui-button-loading')).to.equal(true)

    wrapper.destroy()
  })

  it('should respect `ok-label` and `cancel-label` props', async () => {
    let wrapper = mount({
      components: {
        'veui-alert-box': AlertBox
      },
      data () {
        return {
          disabled: false,
          loading: false
        }
      },
      template: '<veui-alert-box open ok-label="👍"/>'
    })

    await wrapper.vm.$nextTick()

    let btn = wrapper.find('.veui-dialog-content-foot button')
    expect(btn.text()).to.equal('👍')

    wrapper.destroy()
  })
})
