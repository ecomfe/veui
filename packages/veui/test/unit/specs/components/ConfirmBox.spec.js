import { mount, config } from '@vue/test-utils'
import sinon from 'sinon'
import ConfirmBox from '@/components/ConfirmBox'
import { wait } from '../../../utils'

config.stubs.transition = false

describe('components/ConfirmBox', function () {
  it('should handle props correctly', async () => {
    let closeHandler = sinon.spy()
    let wrapper = mount({
      components: {
        'veui-confirm-box': ConfirmBox
      },
      data () {
        return {
          open: true,
          closeHandler
        }
      },
      template:
        '<veui-confirm-box title="title" :open.sync="open" :before-close="closeHandler" />'
    })
    let { vm } = wrapper
    expect(wrapper.find('.veui-dialog-content-head-title').text()).to.equal(
      'title'
    )
    let buttons = wrapper.findAll('.veui-button')
    buttons.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.equal(false)
    vm.open = true
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.equal(false)
    expect(closeHandler.callCount).to.equal(2)
    wrapper.destroy()
  })

  it('should render slot correctly', () => {
    let wrapper = mount(ConfirmBox, {
      slots: {
        title: '<div class="title-slot" slot="title">title</div>',
        default: '<div class="content-slot">content</div>',
        foot: '<div class="foot-slot" slot="foot">foot</div>'
      }
    })
    expect(wrapper.find('.title-slot').text()).to.equal('title')
    expect(wrapper.find('.content-slot').text()).to.equal('content')
    expect(wrapper.find('.foot-slot').text()).to.equal('foot')
    wrapper.destroy()
  })

  it('should handle event correctly when click ok/cancel button', async () => {
    let okHandler = sinon.spy()
    let cancelHandler = sinon.spy()
    let afterCloseHandler = sinon.spy()
    let wrapper = mount(
      {
        components: {
          'veui-confirm-box': ConfirmBox
        },
        data () {
          return {
            open: true
          }
        },
        methods: {
          okHandler,
          cancelHandler,
          afterCloseHandler
        },
        template: `
          <veui-confirm-box
            :open.sync="open"
            title="Confirm"
            @ok="okHandler"
            @cancel="cancelHandler"
            @afterclose="afterCloseHandler">
            Are you sure you wan to continue?
          </veui-confirm-box>
        `
      },
      {
        attachToDocument: true
      }
    )
    let buttons = wrapper.findAll('.veui-button')
    buttons.at(0).trigger('click')
    await wait(600)
    expect(okHandler.calledOnce).to.equal(true)
    wrapper.vm.open = true
    buttons.at(1).trigger('click')
    await wait(600)
    expect(cancelHandler.calledOnce).to.equal(true)
    expect(afterCloseHandler.callCount).to.equal(2)
    wrapper.destroy()
  })

  it('should make prop `open` fully controlled', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-confirm-box': ConfirmBox
        },
        data () {
          return {
            open: true
          }
        },
        template: `
          <veui-confirm-box
            :open="open"
            title="Confirm">
            Are you sure you wan to continue?
          </veui-confirm-box>
        `
      },
      {
        attachToDocument: true
      }
    )
    let buttons = wrapper.findAll('.veui-button')
    buttons.at(0).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-confirm-box').isVisible()).to.equal(true)
    buttons.at(1).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-confirm-box').isVisible()).to.equal(true)
    wrapper.destroy()
  })
})
