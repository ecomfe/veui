import { mount } from '@vue/test-utils'
import resize from '@/directives/resize'
import { wait } from '../../../utils'

describe('directives/resize', () => {
  it(`should callback upon size changes`, async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize="handler">foo</div>`,
        methods: {
          handler () {
            count++
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.element.style.cssText = 'width: 20px; height: 20px;'

    await wait(50)

    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it(`should honor throttle modifier correctly`, async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize.throttle.200="handler"></div>`,
        methods: {
          handler () {
            count++
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.element.style.cssText = 'width: 20px; height: 20px;'
    await wait(50)
    expect(count).to.be.equal(0)
    wrapper.element.style.cssText = 'width: 30px; height: 30px;'
    await wait(50)
    expect(count).to.be.equal(0)
    wrapper.element.style.cssText = 'width: 40px; height: 40px;'
    await wait(150)
    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it(`should honor throttle modifier correctly with leading option`, async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize.throttle.leading.200="handler"></div>`,
        methods: {
          handler () {
            count++
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.element.style.cssText = 'width: 20px; height: 20px;'
    await wait(50)
    expect(count).to.be.equal(1)
    wrapper.element.style.cssText = 'width: 30px; height: 30px;'
    await wait(50)
    expect(count).to.be.equal(1)
    wrapper.element.style.cssText = 'width: 40px; height: 40px;'
    await wait(150)
    expect(count).to.be.equal(2)

    wrapper.destroy()
  })

  it(`should honor debounce modifier correctly`, async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize.debounce.200="handle"></div>`,
        methods: {
          handle () {
            count++
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.element.style.cssText = 'width: 20px; height: 20px;'
    await wait(50)
    expect(count).to.be.equal(0)
    wrapper.element.style.cssText = 'width: 30px; height: 30px;'
    await wait(50)
    expect(count).to.be.equal(0)
    wrapper.element.style.cssText = 'width: 40px; height: 40px;'
    await wait(150)
    expect(count).to.be.equal(0)
    await wait(100)
    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it(`should honor debounce modifier correctly with leading option`, async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize.debounce.leading.200="handler"></div>`,
        methods: {
          handler () {
            count++
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.element.style.cssText = 'width: 20px; height: 20px;'
    await wait(50)
    expect(count).to.be.equal(1)
    wrapper.element.style.cssText = 'width: 30px; height: 30px;'
    await wait(50)
    expect(count).to.be.equal(1)
    wrapper.element.style.cssText = 'width: 40px; height: 40px;'
    await wait(150)
    expect(count).to.be.equal(1)
    await wait(100)
    expect(count).to.be.equal(2)

    wrapper.destroy()
  })

  it(`should accept dynamic options`, async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize="{
        handler: positive ? inc : dec
      }">{{ content }}</div>`,
        data () {
          return {
            content: 'foo',
            positive: true
          }
        },
        methods: {
          inc () {
            count++
          },
          dec () {
            count--
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.element.style.cssText = 'width: 10px; height: 10px;'
    await wait(50)
    expect(count).to.be.equal(1)
    wrapper.vm.content = 'bar'
    await wait(0)
    wrapper.element.style.cssText = 'width: 20px; height: 20px;'
    await wait(50)
    expect(count).to.be.equal(2)
    wrapper.vm.positive = false
    await wait(0)
    wrapper.element.style.cssText = 'width: 30px; height: 30px;'
    await wait(50)
    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it('should clear up correctly', () => {
    let wrapper = mount(
      {
        directives: { resize },
        template: `<div v-resize="handler">foo</div>`,
        methods: {
          handler () {}
        }
      },
      {
        attachToDocument: true
      }
    )

    wrapper.destroy()
    expect(wrapper.element.__resizeData__).to.be.equal(null)
  })
})
