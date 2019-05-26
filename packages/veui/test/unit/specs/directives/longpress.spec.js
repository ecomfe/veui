import { mount } from '@vue/test-utils'
import longpress from '@/directives/longpress'
import { wait } from '../../../utils'
import config from '@/managers/config'

let DEFAULT_TIMEOUT = config.get('longpress.timeout')
let DEFAULT_REPEAT_INTERVAL = config.get('longpress.repeatInterval')

function isAbout (val, base, error = 120) {
  return val >= base && val < base + error
}

function assertTimeout (received, expected) {
  expect(isAbout(received, expected)).to.be.equal(true)
}

describe('directives/longpress', function () {
  this.timeout(10000)

  it(`should trigger the handler after ${DEFAULT_TIMEOUT}ms by default`, async () => {
    let time = Date.now()
    let wrapper = mount({
      directives: { longpress },
      template: `<div v-longpress="{
          handler
        }">foo</div>`,
      methods: {
        handler () {
          time = Date.now() - time
        }
      }
    })
    wrapper.trigger('mousedown')
    await wait(DEFAULT_TIMEOUT + 500)
    window.dispatchEvent(new MouseEvent('mouseup'))

    assertTimeout(time, DEFAULT_TIMEOUT)

    wrapper.destroy()
  })

  it('should trigger the handler after specified timeout', async () => {
    let time = Date.now()
    let wrapper = mount({
      directives: { longpress },
      template: `<div v-longpress="{
          handler,
          timeout: 2000
        }">foo</div>`,
      methods: {
        handler () {
          time = Date.now() - time
        }
      }
    })
    wrapper.trigger('mousedown')
    await wait(2000 + 500)
    window.dispatchEvent(new MouseEvent('mouseup'))

    assertTimeout(time, 2000)

    wrapper.destroy()
  })

  it(`should trigger the handler repeatedly with repeat option after each ${DEFAULT_REPEAT_INTERVAL}ms by default`, async () => {
    let delays = []
    let repeat = 3
    let time = Date.now()
    let wrapper = mount({
      directives: { longpress },
      template: `<div v-longpress.repeat="{
          handler
        }">foo</div>`,
      methods: {
        handler () {
          delays.push(Date.now() - time)
        }
      }
    })
    wrapper.trigger('mousedown')
    await wait(DEFAULT_TIMEOUT + DEFAULT_REPEAT_INTERVAL * repeat + 50)
    window.dispatchEvent(new MouseEvent('mouseup'))

    assertTimeout(delays[0], DEFAULT_TIMEOUT)
    assertTimeout(delays[1], DEFAULT_TIMEOUT + DEFAULT_REPEAT_INTERVAL)
    assertTimeout(delays[2], DEFAULT_TIMEOUT + DEFAULT_REPEAT_INTERVAL * 2)
    assertTimeout(delays[3], DEFAULT_TIMEOUT + DEFAULT_REPEAT_INTERVAL * 3)

    wrapper.destroy()
  })

  it(`should trigger the handler repeatedly with repeat option after each specified interval`, async () => {
    let delays = []
    let repeat = 3
    let time = Date.now()
    let wrapper = mount({
      directives: { longpress },
      template: `<div v-longpress.repeat="{
          handler,
          repeatInterval: 300
        }">foo</div>`,
      methods: {
        handler () {
          delays.push(Date.now() - time)
        }
      }
    })
    wrapper.trigger('mousedown')
    await wait(DEFAULT_TIMEOUT + 300 * repeat + 50)
    window.dispatchEvent(new MouseEvent('mouseup'))

    assertTimeout(delays[0], DEFAULT_TIMEOUT)
    assertTimeout(delays[1], DEFAULT_TIMEOUT + 300)
    assertTimeout(delays[2], DEFAULT_TIMEOUT + 300 * 2)
    assertTimeout(delays[3], DEFAULT_TIMEOUT + 300 * 3)

    wrapper.destroy()
  })

  it('should handle dynamic options correctly', async () => {
    let time = Date.now()
    let wrapper = mount({
      directives: { longpress },
      template: `<div v-longpress="{
          handler,
          timeout
        }">foo</div>`,
      data () {
        return {
          timeout: 300
        }
      },
      methods: {
        handler () {
          time = Date.now() - time
        }
      }
    })

    let { vm } = wrapper
    vm.timeout = DEFAULT_TIMEOUT
    await vm.$nextTick()

    wrapper.trigger('mousedown')
    await wait(DEFAULT_TIMEOUT + 500)
    window.dispatchEvent(new MouseEvent('mouseup'))

    assertTimeout(time, DEFAULT_TIMEOUT)

    wrapper.destroy()
  })

  it('should clear up correctly', () => {
    let wrapper = mount({
      directives: { longpress },
      template: `<div v-longpress="handler">foo</div>`,
      methods: {
        handler () {}
      }
    })

    wrapper.destroy()
    expect(wrapper.element.__longpressData__).to.be.equal(null)

    wrapper.destroy()
  })
})
