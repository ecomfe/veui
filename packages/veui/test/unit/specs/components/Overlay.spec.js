import { mount, config as testConfig } from '@vue/test-utils'
import Overlay from '@/components/Overlay'
import Button from '@/components/Button'
import overlay, { OverlayManager } from '@/managers/overlay'
import config from '@/managers/config'
import { wait } from '../../../utils'

testConfig.stubs.transition = false

describe('components/Overlay', () => {
  it('should put the layer root node directly below the body.', async () => {
    let wrapper = mount(Overlay, { sync: false })

    await wait(0)

    expect(wrapper.find('.veui-overlay-box').element.parentNode).to.equal(
      document.body
    )

    wrapper.destroy()
  })

  it('should provide default slot.', async () => {
    let wrapper = mount(
      {
        render () {
          return <Overlay open>content</Overlay>
        }
      },
      {
        sync: false
      }
    )

    await wait(0)

    expect(wrapper.find(Overlay).vm.$refs.box.textContent).to.equal('content')

    wrapper.destroy()
  })

  it('should generate proper zIndex when the two overlays have parent-child relationship.', async () => {
    let wrapper = mount(
      {
        render () {
          return (
            <Overlay class="parent-overlay" ref="parent" open>
              <Overlay class="child-overlay" ref="child" open />
            </Overlay>
          )
        }
      },
      {
        sync: false
      }
    )

    await wait(0)

    expect(+wrapper.vm.$refs.parent.$refs.box.style.zIndex).to.equal(200)
    expect(+wrapper.vm.$refs.child.$refs.box.style.zIndex).to.equal(201)

    wrapper.destroy()
  })

  it('should use injected overlay manager.', async () => {
    config.set(
      'managers.overlay',
      new OverlayManager({
        baseOrder: 300
      })
    )
    let wrapper = mount(
      {
        render () {
          return (
            <Overlay class="parent-overlay" ref="parent" open>
              <Overlay class="child-overlay" ref="child" open />
            </Overlay>
          )
        }
      },
      {
        sync: false
      }
    )

    await wait(0)

    expect(+wrapper.vm.$refs.parent.$refs.box.style.zIndex).to.equal(300)
    expect(+wrapper.vm.$refs.child.$refs.box.style.zIndex).to.equal(301)

    config.set('managers.overlay', overlay)
    wrapper.destroy()
  })

  it("should cover the previous overlay's child overlay.", async () => {
    let wrapper = mount(
      {
        data () {
          return {
            parentVisible: false,
            childVisible: false,
            nextVisible: false
          }
        },
        render () {
          return (
            <div>
              <Overlay ref="parent" open={this.parentVisible}>
                <Overlay ref="child" open={this.childVisible} />
              </Overlay>
              <Overlay ref="next" open={this.nextVisible} />
            </div>
          )
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    await wait(0)
    vm.parentVisible = true

    await wait(0)
    vm.nextVisible = true

    await wait(0)
    vm.childVisible = true

    await wait(0)
    expect(vm.$refs.parent.zIndex).to.equal(200)
    expect(vm.$refs.child.zIndex).to.equal(201)
    expect(vm.$refs.next.zIndex).to.equal(202)

    wrapper.destroy()
  })

  it('should handle the `inline` prop correctly', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            inline: true
          }
        },
        render () {
          return (
            <div>
              <Button ref="btn">toggle inline</Button>
              <Overlay target="btn" open inline={this.inline}>
                content
              </Overlay>
            </div>
          )
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    await wait(0)
    let overlayVm = wrapper.find(Overlay).vm
    expect(overlayVm.$refs.box === overlayVm.$el).to.equal(true)

    vm.inline = false
    await wait(0)
    expect(overlayVm.$refs.box.parentNode === document.body).to.equal(true)

    vm.inline = true
    await wait(0)
    expect(overlayVm.$refs.box === overlayVm.$el).to.equal(true)
    wrapper.destroy()
  })

  it('should handle the `local` prop correctly', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            local: true
          }
        },
        render () {
          return (
            <div>
              <Button ref="btn">toggle inline</Button>
              <Overlay target="btn" open local={this.local}>
                content
              </Overlay>
            </div>
          )
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    await wait(0)
    let overlayVm = wrapper.find(Overlay).vm
    expect(overlayVm.$refs.box.parentNode === overlayVm.$el, '#1').to.equal(
      true
    )

    vm.local = false
    await wait(0)
    expect(overlayVm.$refs.box.parentNode === document.body, '#2').to.equal(
      true
    )

    vm.local = true
    await wait(0)
    expect(overlayVm.$refs.box.parentNode === overlayVm.$el, '#3').to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should destroy dom correctly when overlay is closed', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            open: false
          }
        },
        render () {
          return (
            <div>
              <Button ref="btn">toggle inline</Button>
              <Overlay target="btn" open={this.open}>
                <div>content</div>
              </Overlay>
            </div>
          )
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    await wait(0)
    let box = wrapper.find('.veui-overlay-box')
    expect(box.element.children.length, '#1').to.equal(0)

    vm.open = true
    await wait(0)
    expect(box.element.children.length, '#2').to.equal(1)

    vm.open = false
    await wait(0)
    expect(box.element.children.length, '#3').to.equal(1)
    // 过渡后消失
    await wait(300)
    expect(box.element.children.length, '#4').to.equal(0)
    wrapper.destroy()
  })
})
