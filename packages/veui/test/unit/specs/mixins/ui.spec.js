import ui from '@/mixins/ui'
import prefix from '@/mixins/prefix'
import uiManager from '@/managers/ui'
import { mount } from '../../../utils'

uiManager.defaults(
  {
    ui: {
      size: {
        values: ['small', 'medium', 'large'],
        default: 'medium',
        inherit: true
      },
      style: {
        values: ['primary']
      }
    }
  },
  'foo'
)

uiManager.defaults(
  {
    ui: {
      size: {
        values: ['small', 'medium', 'large'],
        default: 'medium',
        inherit: true
      },
      style: {
        values: ['primary']
      }
    },
    parts: {
      foo: 'secondary'
    },
    themes: {
      d22: {
        parts: {
          foo: 'primary'
        }
      }
    }
  },
  'bar'
)

uiManager.defaults(
  {
    ui: {
      size: {
        values: ['small', 'medium', 'large'],
        default: 'medium',
        inherit: true
      }
    }
  },
  'baz'
)

const Foo = {
  name: 'veui-foo',
  mixins: [prefix, ui],
  template: `<div :class="$c('foo')" :ui="realUi"><slot>Foo Component</slot></div>`
}

const Bar = {
  name: 'veui-bar',
  mixins: [prefix, ui],
  components: {
    'veui-foo': Foo
  },
  template:
    '<div :ui="realUi"><veui-foo :ui="uiParts.foo">Bar Component</veui-foo></div>'
}

const Baz = {
  name: 'veui-baz',
  mixins: [prefix, ui],
  components: {
    'veui-foo': Foo
  },
  template: `<div :class="$c('baz')" :ui="realUi"><veui-foo>Baz Component</veui-foo></div>`
}

describe('mixins/ui', () => {
  it('should produce correct `ui` dom attribute and class prefix', () => {
    const wrapper = mount(
      {
        components: {
          'veui-foo': Foo,
          'veui-bar': Bar,
          'veui-baz': Baz
        },
        template: `
        <div>
          <veui-foo ref="f1"/>
          <veui-foo ref="f2" ui="large primary" theme="d22"/>
          <veui-bar ref="b1"/>
          <veui-bar ref="b2" ui="large primary" theme="d22"/>
          <veui-baz ref="z1"/>
          <veui-baz ref="z2" ui="large primary" theme="ai"/>
        </div>`
      },
      {
        attachToDocument: true
      }
    )

    const [f1, f2, bf1, bf2, zf1, zf2] = wrapper.findAll(Foo).wrappers
    const [b1, b2] = wrapper.findAll(Bar).wrappers
    const [z1, z2] = wrapper.findAll(Baz).wrappers

    const uiF1 = f1.attributes('ui')
    const uiF2 = f2.attributes('ui')
    const uiB1 = b1.attributes('ui')
    const uiBF1 = bf1.attributes('ui')
    const uiB2 = b2.attributes('ui')
    const uiBF2 = bf2.attributes('ui')
    const uiZ1 = z1.attributes('ui')
    const uiZF1 = zf1.attributes('ui')
    const uiZ2 = z2.attributes('ui')
    const uiZF2 = zf2.attributes('ui')

    expect(uiF1.includes('medium')).to.equal(true)
    expect(uiF1.includes('large')).to.equal(false)
    expect(uiF1.includes('primary')).to.equal(false)
    expect(uiF1.includes('theme:d22')).to.equal(false)

    expect(uiF2.includes('medium')).to.equal(false)
    expect(uiF2.includes('large')).to.equal(true)
    expect(uiF2.includes('primary')).to.equal(true)
    expect(uiF2.includes('theme:d22')).to.equal(true)

    expect(uiB1.includes('medium')).to.equal(true)
    expect(uiB1.includes('large')).to.equal(false)
    expect(uiB1.includes('primary')).to.equal(false)
    expect(uiB1.includes('theme:d22')).to.equal(false)

    expect(uiBF1.includes('medium')).to.equal(true)
    expect(uiBF1.includes('large')).to.equal(false)
    expect(uiBF1.includes('primary')).to.equal(false)
    expect(uiBF1.includes('theme:d22')).to.equal(false)

    expect(uiB2.includes('medium')).to.equal(false)
    expect(uiB2.includes('large')).to.equal(true)
    expect(uiB2.includes('primary')).to.equal(true)
    expect(uiB2.includes('theme:d22')).to.equal(true)

    expect(uiBF2.includes('medium')).to.equal(false)
    expect(uiBF2.includes('large')).to.equal(true)
    expect(uiBF2.includes('primary')).to.equal(true)
    expect(uiBF2.includes('theme:d22')).to.equal(true)

    expect(uiZ1.includes('theme:ai')).to.equal(false)
    expect(uiZF1.includes('theme:ai')).to.equal(false)
    expect(uiZ2.includes('theme:ai')).to.equal(false)
    expect(uiZF2.includes('theme:ai')).to.equal(false)
    expect(uiZ2.includes('theme:d22')).to.equal(true)
    expect(uiZF2.includes('theme:d22')).to.equal(true)

    expect(z1.classes('veui-ai-baz')).to.equal(false)
    expect(zf1.classes('veui-ai-foo')).to.equal(false)
    expect(z2.classes('veui-ai-baz')).to.equal(true)
    expect(zf2.classes('veui-ai-foo')).to.equal(true)

    wrapper.destroy()
  })
})
