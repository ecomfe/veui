import { mount } from '@vue/test-utils'
import Overlay from '@/components/Overlay'
import Button from '@/components/Button'
import overlay, { OverlayManager } from '@/managers/overlay'
import config from '@/managers/config'
import { wait } from '../../../utils'

describe('components/Overlay', () => {
  it('should put the layer root node directly below the body.', async () => {
    let wrapper = mount(Overlay)

    await wait(0)

    expect(wrapper.find('.veui-overlay-box').element.parentNode).to.equal(
      document.body
    )

    wrapper.destroy()
  })

  it('should provide default slot.', async () => {
    let wrapper = mount({
      render () {
        return <Overlay>content</Overlay>
      }
    })

    await wait(0)

    expect(wrapper.find(Overlay).vm.$refs.box.textContent).to.equal('content')

    wrapper.destroy()
  })

  it('should generate proper zIndex when the two overlays have parent-child relationship.', async () => {
    let wrapper = mount({
      render () {
        return (
          <Overlay class="parent-overlay" ref="parent">
            <Overlay class="child-overlay" ref="child" />
          </Overlay>
        )
      }
    })

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
    let wrapper = mount({
      render () {
        return (
          <Overlay class="parent-overlay" ref="parent">
            <Overlay class="child-overlay" ref="child" />
          </Overlay>
        )
      }
    })

    await wait(0)

    expect(+wrapper.vm.$refs.parent.$refs.box.style.zIndex).to.equal(300)
    expect(+wrapper.vm.$refs.child.$refs.box.style.zIndex).to.equal(301)

    config.set('managers.overlay', overlay)
    wrapper.destroy()
  })

  it("should cover the previous overlay's child overlay.", async () => {
    let wrapper = mount({
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
    })

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
    let wrapper = mount({
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
    })

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
    let wrapper = mount({
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
    })

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
})
