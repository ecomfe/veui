import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import { resolveOverlayPosition, hasClass } from '@/utils/helper'

describe('utils/helper', () => {
  it('should resolve Popper-style overlay position to Tether-style correctly', () => {
    expect(resolveOverlayPosition('top-end')).to.deep.equal({
      targetAttachment: 'top right',
      attachment: 'bottom right'
    })

    expect(resolveOverlayPosition('right-start')).to.deep.equal({
      targetAttachment: 'top right',
      attachment: 'top left'
    })

    expect(resolveOverlayPosition('bottom')).to.deep.equal({
      targetAttachment: 'bottom center',
      attachment: 'top center'
    })

    expect(resolveOverlayPosition('auto-right')).to.deep.equal({
      targetAttachment: 'bottom right',
      attachment: 'top right'
    })

    expect(resolveOverlayPosition('right')).to.deep.equal({
      targetAttachment: 'middle right',
      attachment: 'middle left'
    })
  })

  it('should support checking class existence on vnodes', () => {
    let wrapper = mount({
      components: {
        'veui-button': Button
      },
      template: `
        <div :class="{ foo, bar }">
          <veui-button class="baz">OK</veui-button>
          <veui-button :class="{ baz }">OK</veui-button>
          <veui-button :class="{ foo, bar }" class="baz">OK</veui-button>
        </div>
      `,
      data () {
        return {
          foo: true,
          bar: false,
          baz: true
        }
      },
      mounted () {
        let root = this._vnode
        let buttons = this._vnode.children.filter(({ tag }) => tag)

        expect(hasClass(root, 'foo')).to.equal(true)
        expect(hasClass(root, 'bar')).to.equal(false)
        expect(hasClass(root, 'baz')).to.equal(false)

        expect(hasClass(buttons[0], 'foo')).to.equal(false)
        expect(hasClass(buttons[0], 'bar')).to.equal(false)
        expect(hasClass(buttons[0], 'baz')).to.equal(true)

        expect(hasClass(buttons[1], 'foo')).to.equal(false)
        expect(hasClass(buttons[1], 'bar')).to.equal(false)
        expect(hasClass(buttons[1], 'baz')).to.equal(true)

        expect(hasClass(buttons[2], 'foo')).to.equal(true)
        expect(hasClass(buttons[2], 'bar')).to.equal(false)
        expect(hasClass(buttons[2], 'baz')).to.equal(true)
      }
    })
    wrapper.destroy()
  })
})
