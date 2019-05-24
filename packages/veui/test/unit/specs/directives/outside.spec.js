import { mount } from '@vue/test-utils'
import outside from '@/directives/outside'
import { wait } from '../../../utils'

describe('directives/outside', () => {
  it('should handle `click` correctly', () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside="handler">
              <div id="inner">foo</div>
            </div>
          </div>`,
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

    click(wrapper, 'inner')
    expect(count).to.be.equal(0)

    click(wrapper, 'foo')
    expect(count).to.be.equal(0)

    click(wrapper, 'outer')
    expect(count).to.be.equal(1)

    click()
    expect(count).to.be.equal(2)

    wrapper.destroy()
  })

  it('should handle `hover` correctly', () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside.hover="handler">
              <div id="inner">foo</div>
            </div>
          </div>`,
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

    mouseout(wrapper, 'inner', 'foo')
    expect(count).to.be.equal(0)

    mouseout(wrapper, 'foo', 'outer')
    expect(count).to.be.equal(1)

    mouseout(wrapper, 'outer')
    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it('should handle `hover` with `excludeSelf` correctly', () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside.hover.excludeSelf="handler">
              <div id="inner">foo</div>
            </div>
          </div>`,
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

    mouseout(wrapper, 'inner', 'foo')
    expect(count).to.be.equal(0)

    mouseout(wrapper, 'foo', 'outer')
    expect(count).to.be.equal(0)

    mouseout(wrapper, 'outer')
    expect(count).to.be.equal(0)

    wrapper.destroy()
  })

  it('should handle `refs` and `excludeSelf` correctly', () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside:bar,baz.excludeSelf="handler">
              <div id="inner">foo</div>
            </div>
            <div ref="bar" id="bar">bar</div>
            <div ref="baz" id="baz">baz</div>
          </div>`,
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

    click(wrapper, 'inner')
    expect(count).to.be.equal(1)

    click(wrapper, 'foo')
    expect(count).to.be.equal(2)

    click(wrapper, 'bar')
    expect(count).to.be.equal(2)

    click(wrapper, 'baz')
    expect(count).to.be.equal(2)

    click(wrapper, 'outer')
    expect(count).to.be.equal(3)

    click()
    expect(count).to.be.equal(4)

    wrapper.destroy()
  })

  it('should handle `delay` correctly', async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside.200.hover="handler">
              <div id="inner">foo</div>
            </div>
          </div>`,
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

    mouseout(wrapper, 'foo', 'outer')
    expect(count).to.be.equal(0)

    await wait(150)
    mouseout(wrapper, 'outer', 'foo')
    await wait(150)
    expect(count).to.be.equal(0)

    mouseout(wrapper, 'foo', 'outer')
    await wait(250)
    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it('should handle `delay` with `excludeSelf` correctly', async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside:bar,baz.excludeSelf.200.hover="handler">
              <div id="inner">foo</div>
            </div>
            <div ref="bar" id="bar">bar</div>
            <div ref="baz" id="baz">baz</div>
          </div>`,
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

    mouseout(wrapper, 'bar', 'foo')
    expect(count).to.be.equal(0)

    await wait(150)
    mouseout(wrapper, 'foo', 'baz')
    await wait(150)
    mouseout(wrapper, 'baz', 'bar')
    expect(count).to.be.equal(0)

    mouseout(wrapper, 'bar', 'foo')
    await wait(250)
    expect(count).to.be.equal(1)

    wrapper.destroy()
  })

  it('should handle dynamic options correctly', async () => {
    let count = 0
    let wrapper = mount(
      {
        directives: { outside },
        template: `
          <div id="outer">
            <div id="foo" v-outside="{
              trigger,
              refs,
              handler
            }">
              <div id="inner">{{ text }}</div>
            </div>
            <div ref="bar" id="bar">bar</div>
            <div ref="baz" id="baz">baz</div>
          </div>`,
        data () {
          return {
            text: 'foo',
            trigger: 'click',
            refs: ['bar', 'baz']
          }
        },
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

    let { vm } = wrapper

    click(wrapper, 'foo')
    click(wrapper, 'bar')
    click(wrapper, 'baz')
    expect(count).to.be.equal(0)

    click(wrapper, 'outer')
    expect(count).to.be.equal(1)

    vm.text = 'FOO'
    await vm.$nextTick()

    click(wrapper, 'foo')
    click(wrapper, 'bar')
    click(wrapper, 'baz')
    expect(count).to.be.equal(1)

    click(wrapper, 'outer')
    expect(count).to.be.equal(2)

    vm.refs.pop()
    await vm.$nextTick()

    click(wrapper, 'foo')
    click(wrapper, 'bar')
    expect(count).to.be.equal(2)

    click(wrapper, 'baz')
    expect(count).to.be.equal(3)

    click(wrapper, 'outer')
    expect(count).to.be.equal(4)

    vm.trigger = 'hover'
    await vm.$nextTick()

    click(wrapper, 'foo')
    click(wrapper, 'bar')
    click(wrapper, 'baz')
    click(wrapper, 'outer')
    expect(count).to.be.equal(4)

    mouseout(wrapper, 'foo', 'bar')
    expect(count).to.be.equal(4)
    mouseout(wrapper, 'bar', 'baz')
    expect(count).to.be.equal(5)

    vm.options = { ...vm.options }
    await vm.$nextTick()

    mouseout(wrapper, 'foo', 'bar')
    expect(count).to.be.equal(5)
    mouseout(wrapper, 'bar', 'baz')
    expect(count).to.be.equal(6)

    wrapper.destroy()
  })
})

function click (wrapper, id) {
  if (arguments.length === 0) {
    document.body.dispatchEvent(new MouseEvent('click'))
    return
  }
  wrapper.find(`#${id}`).trigger('click')
}

function mouseout (wrapper, from, to) {
  wrapper.find(`#${from}`).trigger('mouseout', {
    relatedTarget: to ? wrapper.find(`#${to}`).element : document.body
  })
}
