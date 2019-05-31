import { mount, config } from '@vue/test-utils'
import sinon from 'sinon'
import ConfirmBox from '@/components/ConfirmBox'
import { wait } from '../../../utils'

config.stubs.transition = false

describe('components/ConfirmBox', function () {
  it('shoule handle props correctly', async () => {
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
      template: '<veui-confirm-box title="title" :open.sync="open" :before-close="closeHandler" />'
    })
    let { vm } = wrapper
    expect(wrapper.find('.veui-dialog-content-head-title').text()).to.be.equal('title')
    let buttons = wrapper.findAll('.veui-button')
    buttons.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.be.equal(false)
    vm.open = true
    buttons.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.open).to.be.equal(false)
    expect(closeHandler.callCount).to.be.equal(2)
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
    expect(wrapper.find('.title-slot').text()).to.be.equal('title')
    expect(wrapper.find('.content-slot').text()).to.be.equal('content')
    expect(wrapper.find('.foot-slot').text()).to.be.equal('foot')
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
    expect(okHandler.calledOnce).to.be.equal(true)
    wrapper.vm.open = true
    buttons.at(1).trigger('click')
    await wait(600)
    expect(cancelHandler.calledOnce).to.be.equal(true)
    expect(afterCloseHandler.callCount).to.be.equal(2)
    wrapper.destroy()
  })
})
