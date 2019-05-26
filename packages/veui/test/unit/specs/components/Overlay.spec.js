import { mount } from '@vue/test-utils'
import Overlay from '@/components/Overlay'
import { wait } from '../../../utils'

describe('components/Overlay', () => {
  it('should put the layer root node directly below the body.', async () => {
    let wrapper = mount(Overlay)

    await wait(0)

    expect(wrapper.find('.veui-overlay-box').element.parentNode).to.be.equal(
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

    expect(wrapper.find(Overlay).vm.$refs.box.textContent).to.be.equal(
      'content'
    )

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

    expect(+wrapper.vm.$refs.parent.overlayBox.style.zIndex).to.be.equal(200)
    expect(+wrapper.vm.$refs.child.overlayBox.style.zIndex).to.be.equal(201)

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
    expect(vm.$refs.parent.zIndex).to.be.equal(200)
    expect(vm.$refs.child.zIndex).to.be.equal(201)
    expect(vm.$refs.next.zIndex).to.be.equal(202)

    wrapper.destroy()
  })
})
