import Stack from '@/components/Stack'
import { mount } from '../../../utils'

describe('components/Stack', function () {
  this.timeout(10000)

  it('should align items correctly', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-stack': Stack
        },
        template: `
          <veui-stack :align="align" :direction="dir" style="width: 400px; height: 400px">
            <div class="a" style="background: red; min-width: 40px; min-height: 40px"/>
            <div class="b" style="background: red; min-width: 60px; min-height: 60px"/>
            <div class="c" style="background: red; min-width: 80px; min-height: 80px"/>
          </veui-stack>
        `,
        data () {
          return {
            align: null,
            dir: 'row'
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    const { vm } = wrapper

    const a = wrapper.find('.a').element
    const b = wrapper.find('.b').element
    const c = wrapper.find('.c').element

    // default to center for row stack
    expectRectProp(a, 'top', 180)
    expectRectProp(b, 'top', 170)
    expectRectProp(c, 'top', 160)

    vm.align = 'start'
    await vm.$nextTick()
    expectRectProp(a, 'top', 0)
    expectRectProp(b, 'top', 0)
    expectRectProp(c, 'top', 0)

    vm.align = 'end'
    await vm.$nextTick()
    expectRectProp(a, 'top', 360)
    expectRectProp(b, 'top', 340)
    expectRectProp(c, 'top', 320)

    vm.align = 'center'
    await vm.$nextTick()
    expectRectProp(a, 'top', 180)
    expectRectProp(b, 'top', 170)
    expectRectProp(c, 'top', 160)

    vm.align = 'stretch'
    await vm.$nextTick()
    expectRectProp(a, 'top', 0)
    expectRectProp(b, 'top', 0)
    expectRectProp(c, 'top', 0)
    expectRectProp(a, 'height', 400)
    expectRectProp(b, 'height', 400)
    expectRectProp(c, 'height', 400)

    vm.align = null
    vm.dir = 'column'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 0)
    expectRectProp(c, 'left', 0)
    expectRectProp(a, 'width', 400)
    expectRectProp(b, 'width', 400)
    expectRectProp(c, 'width', 400)

    vm.align = 'start'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 0)
    expectRectProp(c, 'left', 0)
    expectRectProp(a, 'width', 40)
    expectRectProp(b, 'width', 60)
    expectRectProp(c, 'width', 80)

    vm.align = 'end'
    await vm.$nextTick()
    expectRectProp(a, 'left', 360)
    expectRectProp(b, 'left', 340)
    expectRectProp(c, 'left', 320)

    vm.align = 'center'
    await vm.$nextTick()
    expectRectProp(a, 'left', 180)
    expectRectProp(b, 'left', 170)
    expectRectProp(c, 'left', 160)

    vm.align = 'stretch'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 0)
    expectRectProp(c, 'left', 0)
    expectRectProp(a, 'width', 400)
    expectRectProp(b, 'width', 400)
    expectRectProp(c, 'width', 400)

    wrapper.destroy()
  })

  it('should justify items correctly', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-stack': Stack
        },
        template: `
          <veui-stack :justify="justify" :direction="dir" style="width: 400px; height: 400px">
            <div class="a" style="background: red; min-width: 40px; min-height: 40px"/>
            <div class="b" style="background: red; min-width: 60px; min-height: 60px"/>
            <div class="c" style="background: red; min-width: 80px; min-height: 80px"/>
          </veui-stack>
        `,
        data () {
          return {
            justify: null,
            dir: 'row'
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    const { vm } = wrapper

    const a = wrapper.find('.a').element
    const b = wrapper.find('.b').element
    const c = wrapper.find('.c').element

    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 40)
    expectRectProp(c, 'left', 100)

    vm.justify = 'start'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 40)
    expectRectProp(c, 'left', 100)

    vm.justify = 'end'
    await vm.$nextTick()
    expectRectProp(a, 'left', 220)
    expectRectProp(b, 'left', 260)
    expectRectProp(c, 'left', 320)

    vm.justify = 'center'
    await vm.$nextTick()
    expectRectProp(a, 'left', 110)
    expectRectProp(b, 'left', 150)
    expectRectProp(c, 'left', 210)

    vm.justify = 'space-between'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 150)
    expectRectProp(c, 'left', 320)

    vm.justify = null
    vm.dir = 'column'
    await vm.$nextTick()
    expectRectProp(a, 'top', 0)
    expectRectProp(b, 'top', 40)
    expectRectProp(c, 'top', 100)
    expectRectProp(a, 'width', 400)
    expectRectProp(b, 'width', 400)
    expectRectProp(c, 'width', 400)

    vm.justify = 'start'
    await vm.$nextTick()
    expectRectProp(a, 'top', 0)
    expectRectProp(b, 'top', 40)
    expectRectProp(c, 'top', 100)

    vm.justify = 'end'
    await vm.$nextTick()
    expectRectProp(a, 'top', 220)
    expectRectProp(b, 'top', 260)
    expectRectProp(c, 'top', 320)

    vm.justify = 'center'
    await vm.$nextTick()
    expectRectProp(a, 'top', 110)
    expectRectProp(b, 'top', 150)
    expectRectProp(c, 'top', 210)

    vm.justify = 'space-between'
    await vm.$nextTick()
    expectRectProp(a, 'top', 0)
    expectRectProp(b, 'top', 150)
    expectRectProp(c, 'top', 320)

    wrapper.destroy()
  })

  it('should handle `gap` prop correctly', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-stack': Stack
        },
        template: `
          <veui-stack :gap="gap" :direction="dir" :wrap="wrap" :style="style">
            <div class="a" style="background: red; min-width: 40px; min-height: 40px"/>
            <div class="b" style="background: red; min-width: 60px; min-height: 60px"/>
            <div class="c" style="background: red; min-width: 80px; min-height: 80px"/>
          </veui-stack>
        `,
        data () {
          return {
            gap: null,
            dir: 'row',
            wrap: false,
            height: null
          }
        },
        computed: {
          style () {
            return {
              width: '120px',
              height: this.height ? `${this.height}px` : ''
            }
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    const { vm } = wrapper

    const a = wrapper.find('.a').element
    const b = wrapper.find('.b').element
    const c = wrapper.find('.c').element

    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 40)
    expectRectProp(c, 'left', 100)

    vm.gap = -10
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 40)
    expectRectProp(c, 'left', 100)

    vm.gap = 'm'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 56)
    expectRectProp(c, 'left', 132)

    vm.gap = 20
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 60)
    expectRectProp(c, 'left', 140)

    vm.wrap = true
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 60)
    expectRectProp(c, 'left', 0)
    expectRectProp(c, 'top', 80)

    vm.dir = 'column'
    vm.wrap = false
    await vm.$nextTick()
    expectRectProp(a, 'top', 0)
    expectRectProp(b, 'top', 60)
    expectRectProp(c, 'top', 140)

    vm.wrap = true
    vm.height = 100
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 60)
    expectRectProp(c, 'left', 140)

    wrapper.destroy()
  })

  it('should handle multi-level stack `gap` prop correctly', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-stack': Stack
        },
        template: `
          <div>
            <veui-stack :gap="outerGap">
              <veui-stack :gap="innerGap">
                <div class="a" style="background: red; min-width: 60px; min-height: 60px"/>
                <div class="b" style="background: red; min-width: 60px; min-height: 60px"/>
              </veui-stack>
              <veui-stack :gap="innerGap">
                <div class="c" style="background: red; min-width: 60px; min-height: 60px"/>
                <div class="d" style="background: red; min-width: 60px; min-height: 60px"/>
              </veui-stack>
            </veui-stack>
          </div>
        `,
        data () {
          return {
            outerGap: null,
            innerGap: null
          }
        }
      },
      {
        attachToDocument: true
      }
    )

    const { vm } = wrapper

    const a = wrapper.find('.a').element
    const b = wrapper.find('.b').element
    const c = wrapper.find('.c').element
    const d = wrapper.find('.d').element

    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 60)
    expectRectProp(c, 'left', 120)
    expectRectProp(d, 'left', 180)

    vm.outerGap = 20
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 60)
    expectRectProp(c, 'left', 140)
    expectRectProp(d, 'left', 200)

    vm.innerGap = 10
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 70)
    expectRectProp(c, 'left', 150)
    expectRectProp(d, 'left', 220)

    vm.outerGap = 0
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 70)
    expectRectProp(c, 'left', 130)
    expectRectProp(d, 'left', 200)

    vm.outerGap = null
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 70)
    expectRectProp(c, 'left', 130)
    expectRectProp(d, 'left', 200)

    vm.innerGap = 'xxs'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 64)
    expectRectProp(c, 'left', 124)
    expectRectProp(d, 'left', 188)

    vm.outerGap = 'm'
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 64)
    expectRectProp(c, 'left', 140)
    expectRectProp(d, 'left', 204)

    vm.innerGap = 0
    await vm.$nextTick()
    expectRectProp(a, 'left', 0)
    expectRectProp(b, 'left', 60)
    expectRectProp(c, 'left', 136)
    expectRectProp(d, 'left', 196)

    wrapper.destroy()
  })

  it('should respect `inline` prop', async () => {
    const wrapper = mount(Stack, {
      propsData: {
        inline: true
      },
      attachToDocument: true
    })

    expect(getComputedStyle(wrapper.vm.$el).display).to.equal('inline-flex')

    wrapper.setProps({ inline: false })
    await wrapper.vm.$nextTick()
    expect(getComputedStyle(wrapper.vm.$el).display).to.equal('flex')

    wrapper.destroy()
  })

  it('should not obscure elements before it', async () => {
    const wrapper = mount(
      {
        components: {
          'veui-stack': Stack
        },
        template: `
          <div style="display: flex">
            <div id="foo" style="background: red; width: 60px; height: 60px"/>
            <veui-stack gap="m">
              <div style="background: pink; min-width: 60px; min-height: 60px"/>
              <div style="background: pink; min-width: 60px; min-height: 60px"/>
            </veui-stack>
          </div>
        `
      },
      {
        attachToDocument: true
      }
    )

    const { element } = wrapper.find(Stack)
    const { top, left } = element.getBoundingClientRect()

    expect(
      element.contains(document.elementFromPoint(left - 1, top + 1))
    ).to.equal(false)

    wrapper.destroy()
  })
})

function expectRectProp (el, prop, value) {
  expect(el.getBoundingClientRect()[prop]).to.equal(value)
}
