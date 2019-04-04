import Overlay from '@/components/Overlay'
import Vue from 'vue'

describe('components/Overlay', () => {
  it('should put the layer root node directly below the body.', done => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new Vue({
      el: div,
      render () {
        return <Overlay />
      }
    })

    setTimeout(() => {
      const overlay = vm.$children[0].$vnode.componentInstance
      expect(overlay.$refs.box).toBe(
        document.body.querySelector('.veui-overlay-box')
      )

      vm.$destroy()
      done()
    })
  })

  it('should provide default slot.', done => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const vm = new Vue({
      el: div,
      render () {
        return <Overlay>content</Overlay>
      }
    })

    setTimeout(() => {
      const overlay = vm.$children[0].$vnode.componentInstance
      expect(overlay.$refs.box.innerHTML).toBe('content')
      vm.$destroy()
      done()
    })
  })

  it('should generate proper zIndex when the two overlays have parent-child relationship.', done => {
    const vm = new Vue({
      mounted () {
        expect(+this.$refs.parent.overlayBox.style.zIndex).toBe(200)
        expect(+this.$refs.child.overlayBox.style.zIndex).toBe(201)
        vm.$destroy()
        done()
      },
      render () {
        return (
          <Overlay class="parent-overlay" ref="parent">
            <Overlay class="child-overlay" ref="child" />
          </Overlay>
        )
      }
    })

    vm.$mount()
  })

  it("should cover the previous's overlay's child overlay.", done => {
    const vm = new Vue({
      data () {
        return {
          parentVisible: false,
          childVisible: false,
          nextVisible: false
        }
      },
      mounted () {
        setTimeout(() => {
          this.parentVisible = true

          setTimeout(() => {
            this.nextVisible = true

            setTimeout(() => {
              this.childVisible = true

              setTimeout(() => {
                expect(this.$refs.parent.zIndex).toBe(200)
                expect(this.$refs.child.zIndex).toBe(201)
                expect(this.$refs.next.zIndex).toBe(202)
                vm.$destroy()
                done()
              })
            })
          })
        })
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
    }).$mount()
  })
})
