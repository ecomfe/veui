import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import {
  getTypedAncestor,
  getTypedAncestorTracker,
  findAncestor,
  isVueComponent,
  isType,
  isTransparent,
  isTopMostOfType,
  getModelProp,
  getModelEvent,
  isEmpty,
  normalizeClass,
  getConfigKey,
  deepSet,
  normalizeLength,
  normalizeInt,
  resolveOffset,
  hasClass,
  ignoreElements,
  inheritScopeAttrs,
  createPortal,
  renderSlot,
  Void,
  forwardSlots,
  safeSlice
} from '@/utils/helper'

describe('utils/helper', function () {
  this.timeout(10000)

  it('should find typed ancestor', () => {
    let Foo = {
      template: '<div>Foo</div>'
    }

    let Bar = {
      uiTypes: ['bar'],
      components: {
        Foo
      },
      template: '<div>Bar <Foo/></div>'
    }

    let Baz = {
      uiTypes: ['baz'],
      components: {
        Bar
      },
      template: '<div>Baz <Bar/></div>'
    }

    let wrapper = mount({
      components: {
        Baz
      },
      template: '<Baz/>'
    })

    let foo = wrapper.find(Foo).vm
    let bar = wrapper.find(Bar).vm
    let baz = wrapper.find(Baz).vm

    expect(getTypedAncestor(foo, 'bar')).to.equal(bar)
    expect(getTypedAncestor(foo, 'bar', true)).to.equal(bar)
    expect(getTypedAncestor(foo, 'baz', true)).to.equal(null)
    expect(getTypedAncestor(foo, 'qux')).to.equal(null)
    expect(getTypedAncestor(foo, 'qux', true)).to.equal(null)
    expect(getTypedAncestor(bar, 'baz')).to.equal(baz)
    expect(getTypedAncestor(bar, 'baz', true)).to.equal(baz)
  })

  it('should create ancestor tracker', () => {
    let Foo = {
      mixins: [
        getTypedAncestorTracker('bar'),
        getTypedAncestorTracker('baz', true)
      ],
      template: '<div>Foo</div>'
    }

    let Bar = {
      uiTypes: ['bar'],
      mixins: [getTypedAncestorTracker('baz', true)],
      components: {
        Foo
      },
      template: '<div>Bar <Foo/></div>'
    }

    let Baz = {
      uiTypes: ['baz'],
      components: {
        Bar
      },
      template: '<div>Baz <Bar/></div>'
    }

    let wrapper = mount({
      components: {
        Baz
      },
      template: '<Baz/>'
    })

    let foo = wrapper.find(Foo).vm
    let bar = wrapper.find(Bar).vm
    let baz = wrapper.find(Baz).vm

    expect(foo.bar).to.equal(bar)
    expect(foo.baz).to.equal(null)
    expect(bar.baz).to.equal(baz)
  })

  it('should find ancestor by predicate', () => {
    let Foo = {
      template: '<div>Foo</div>',
      data () {
        return {
          value: 'foo'
        }
      }
    }

    let Bar = {
      components: {
        Foo
      },
      template: '<div>Bar <Foo/></div>',
      data () {
        return {
          value: 'bar'
        }
      }
    }

    let Baz = {
      components: {
        Bar
      },
      template: '<div>Baz <Bar/></div>',
      data () {
        return {
          value: 'baz'
        }
      }
    }

    let wrapper = mount({
      components: {
        Baz
      },
      template: '<Baz/>'
    })

    let foo = wrapper.find(Foo).vm
    let bar = wrapper.find(Bar).vm
    let baz = wrapper.find(Baz).vm

    expect(findAncestor(foo, (vm) => vm.value === 'bar')).to.equal(bar)
    expect(findAncestor(foo, (vm) => vm.value === 'baz')).to.equal(baz)
    expect(findAncestor(foo, (vm) => vm.value === 'qux')).to.equal(null)
    expect(findAncestor(bar, (vm) => vm.value === 'baz')).to.equal(baz)
    expect(findAncestor(bar, (vm) => vm.value === 'qux')).to.equal(null)
  })

  it('should detect Vue components', () => {
    let wrapper = mount({
      template: '<div>Foo</div>'
    })

    let specs = [
      [wrapper.vm, true],
      [wrapper.vm.$el, false],
      [1, false],
      [null, false],
      [undefined, false],
      [{}, false],
      [[], false],
      [() => {}, false]
    ]

    specs.forEach(([value, expected]) => {
      expect(isVueComponent(value)).to.equal(expected)
    })
  })

  it('should check uiTypes', () => {
    let Component = {
      uiTypes: ['foo', 'bar', 'baz'],
      template: '<div>Foo</div>'
    }

    let wrapper = mount(Component)
    let component = wrapper.find(Component).vm

    expect(isType(component, 'foo')).to.equal(true)
    expect(isType(component, 'bar')).to.equal(true)
    expect(isType(component, 'baz')).to.equal(true)
    expect(isType(component, 'qux')).to.equal(false)
  })

  it('should check transparent components', () => {
    let Foo = {
      uiTypes: ['transparent'],
      template: '<div class="foo">Foo</div>'
    }

    let Bar = {
      abstract: true,
      components: {
        Foo
      },
      template: '<div class="bar"><Foo/></div>'
    }

    let wrapper = mount({
      components: {
        Bar
      },
      template:
        '<transition-group ref="group" name="foo"><Bar/></transition-group>'
    })

    let { vm } = wrapper
    let foo = wrapper.find(Foo).vm
    let bar = wrapper.find(Bar).vm
    let { group } = vm.$refs

    expect(isTransparent(foo)).to.equal(true)
    expect(isTransparent(bar)).to.equal(true)
    expect(isTransparent(group)).to.equal(true)
    expect(isTransparent(vm)).to.equal(false)
    expect(isTransparent({})).to.equal(false)
  })

  it('should check if a component is the top-most of a given type', () => {
    let Foo = {
      uiTypes: ['item'],
      template: '<div class="foo">Foo</div>'
    }

    let Bar = {
      uiTypes: ['group'],
      components: {
        Foo
      },
      template: '<div class="bar"><Foo/></div>'
    }

    let Baz = {
      uiTypes: ['item'],
      components: {
        Bar
      },
      template: '<div class="baz"><Bar/></div>'
    }

    let wrapper = mount({
      components: {
        Foo,
        Baz
      },
      template: '<div><Foo/><Baz/></div>'
    })

    let [foo1, foo2] = wrapper.findAll(Foo).wrappers.map((w) => w.vm)
    let bar = wrapper.find(Bar).vm
    let baz = wrapper.find(Baz).vm
    let { vm } = wrapper

    expect(isTopMostOfType(foo1, 'item')).to.equal(true)
    expect(isTopMostOfType(foo2, 'item')).to.equal(false)
    expect(isTopMostOfType(foo1, 'group')).to.equal(false)
    expect(isTopMostOfType(foo2, 'group')).to.equal(false)
    expect(isTopMostOfType(bar, 'item')).to.equal(false)
    expect(isTopMostOfType(bar, 'group')).to.equal(true)
    expect(isTopMostOfType(baz, 'item')).to.equal(true)
    expect(isTopMostOfType(baz, 'group')).to.equal(false)
    expect(isTopMostOfType(vm, 'item')).to.equal(false)

    expect(isTopMostOfType(foo1, 'item', 'group')).to.equal(true)
    expect(isTopMostOfType(foo2, 'item', 'group')).to.equal(true)
    expect(isTopMostOfType(foo1, 'group', 'group')).to.equal(false)
    expect(isTopMostOfType(foo2, 'group', 'group')).to.equal(false)
    expect(isTopMostOfType(bar, 'item', 'group')).to.equal(false)
    expect(isTopMostOfType(bar, 'group', 'group')).to.equal(true)
    expect(isTopMostOfType(baz, 'item', 'group')).to.equal(true)
    expect(isTopMostOfType(baz, 'group', 'group')).to.equal(false)
  })

  it('should get model option', () => {
    let Foo = {
      model: {
        prop: 'v',
        event: 'i'
      },
      template: '<div>Foo</div>'
    }

    let Bar = {
      template: '<div>Bar</div>'
    }

    let wrapper = mount({
      components: {
        Foo,
        Bar
      },
      template: '<div><Foo/><Bar/></div>'
    })

    let foo = wrapper.find(Foo).vm
    let bar = wrapper.find(Bar).vm

    expect(getModelProp(foo)).to.equal('v')
    expect(getModelEvent(foo)).to.equal('i')
    expect(getModelProp(bar)).to.equal('value')
    expect(getModelEvent(bar)).to.equal('input')
  })

  it('should check empty values', () => {
    let specs = [
      [null, true],
      [undefined, true],
      [0, false],
      [1, false],
      ['', true],
      ['foo', false],
      [[], true],
      [[1], false],
      [{}, false],
      [{ foo: 'bar' }, false],
      [() => {}, false]
    ]

    specs.forEach(([value, expected]) => {
      expect(isEmpty(value)).to.equal(expected)
    })
  })

  it('should normalize class expressions', () => {
    let specs = [
      ['foo', { foo: true }],
      ['foo bar', { foo: true, bar: true }],
      [['foo'], { foo: true }],
      [['foo', 'bar'], { foo: true, bar: true }],
      [['foo', { bar: true }], { foo: true, bar: true }],
      [['foo', ['bar'], { baz: true }], { foo: true, bar: true, baz: true }],
      [
        [['foo'], ['bar'], ['baz'], { qux: false }],
        { foo: true, bar: true, baz: true, qux: false }
      ],
      [['foo bar', { baz: true }, 0], { foo: true, bar: true, baz: true }]
    ]

    specs.forEach(([value, expected], i) => {
      expect(normalizeClass(value), i).to.deep.equal(expected)
    })
  })

  it('should get config key by component name', () => {
    expect(getConfigKey('foo')).to.equal('foo')
    expect(getConfigKey('FoO')).to.equal('foo')
    expect(getConfigKey('bar-baz')).to.equal('barbaz')
    expect(getConfigKey('BarBaz')).to.equal('barbaz')
    expect(getConfigKey('veui-foo')).to.equal('foo')
    expect(getConfigKey('VEUIButton')).to.equal('button')
    expect(getConfigKey('veui-bar-baz')).to.equal('barbaz')
    expect(getConfigKey('VEUIBarBaz')).to.equal('barbaz')
  })

  it('should deeply set Vue reactive data', async () => {
    let wrapper = mount({
      data () {
        return {
          foo: {
            bar: {
              baz: 'a',
              qux: []
            }
          }
        }
      },
      template:
        '<div>{{ foo.bar.baz }},{{ foo.bar.qux[0] }},{{ foo.bar.quux && foo.bar.quux[0] }}</div>'
    })

    expect(wrapper.text()).to.equal('a,,')

    deepSet(wrapper.vm, 'foo.bar.baz', 'b')
    deepSet(wrapper.vm, 'foo.bar.qux[0]', 'c')
    deepSet(wrapper.vm, 'foo.bar.quux[0]', 'd')

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).to.equal('b,c,d')
  })

  it('should normalize length', () => {
    let specs = [
      [0, null],
      ['0', null],
      [1, '1px'],
      [-1.5, '-1.5px'],
      ['.5', '.5px'],
      ['10px', '10px']
    ]

    specs.forEach(([value, expected], i) => {
      expect(normalizeLength(value), i).to.equal(expected)
    })
  })

  it('should normalize int', () => {
    let specs = [
      [0, 0],
      ['0', 0],
      [1, 1],
      [-1.5, -1],
      ['.5', null],
      ['0.5', 0],
      ['10px', 10]
    ]

    specs.forEach(([value, expected], i) => {
      expect(normalizeInt(value), i).to.equal(expected)
    })
  })

  it('should resolve offset', () => {
    let specs = [
      [null, 200, 0],
      [0, 200, 0],
      [10, 200, 10],
      ['0', 200, 0],
      ['10', 200, 10],
      ['10px', 200, 10],
      ['0%', 200, 0],
      ['10%', 200, 20],
      ['oops', 200, 0],
      [10, null, 0]
    ]

    specs.forEach(([value, base, expected]) => {
      expect(resolveOffset(value, base)).to.equal(expected)
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

        expect(hasClass({}, 'foo')).to.equal(false)

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

  it('should set ignored elements', () => {
    let error = console.error
    let count = 0
    console.error = () => {
      count++
    }

    mount({
      template: '<x-foo><x-bar>baz</x-bar></x-foo>'
    })

    expect(count).to.equal(2)

    ignoreElements(['x-foo', 'x-bar', 'x-foo'])

    mount({
      template: '<x-foo><x-bar>baz</x-bar></x-foo>'
    })

    expect(count).to.equal(2)

    console.error = error
  })

  it('should help inherit scope attributes', () => {
    let parent = document.createElement('div')
    parent.setAttribute('data-v-foo', '')
    parent.setAttribute('data-v-bar', '')
    parent.setAttribute('data-v-baz', '')

    let child = document.createElement('div')
    child.setAttribute('data-v-baz', '')

    let restore = inheritScopeAttrs(child, parent)

    expect(child.getAttribute('data-v-foo')).to.equal('')
    expect(child.getAttribute('data-v-bar')).to.equal('')
    expect(child.getAttribute('data-v-baz')).to.equal('')

    restore()

    expect(child.getAttribute('data-v-foo')).to.equal(null)
    expect(child.getAttribute('data-v-bar')).to.equal(null)
    expect(child.getAttribute('data-v-baz')).to.equal('')
  })

  it('should simulate portal feature', () => {
    let parent = document.createElement('div')
    parent.setAttribute('data-v-foo', '')
    parent.setAttribute('data-v-bar', '')
    parent.setAttribute('data-v-baz', '')

    let child = document.createElement('div')
    child.setAttribute('data-v-baz', '')
    parent.appendChild(child)

    let restore = createPortal(child, document.body)

    expect(child.getAttribute('data-v-foo')).to.equal('')
    expect(child.getAttribute('data-v-bar')).to.equal('')
    expect(child.getAttribute('data-v-baz')).to.equal('')
    expect(child.__portal__).to.equal(parent)
    expect(child.parentNode).to.equal(document.body)

    restore()

    expect(child.getAttribute('data-v-foo')).to.equal(null)
    expect(child.getAttribute('data-v-bar')).to.equal(null)
    expect(child.getAttribute('data-v-baz')).to.equal('')
    expect(child.__portal__).to.equal(undefined)
    expect(child.parentNode).to.equal(parent)
  })

  it('should render slot', () => {
    let Foo = {
      render (h) {
        return h('div', [
          h(
            'div',
            {
              class: 'default'
            },
            renderSlot(this, 'default')
          ),
          h(
            'div',
            {
              class: 'foo'
            },
            renderSlot(this, 'foo', {
              value: 'bar'
            })
          ),
          h(
            'div',
            {
              class: 'baz'
            },
            renderSlot(this, 'baz', {
              value: 'qux'
            })
          )
        ])
      }
    }

    let wrapper = mount({
      components: { Foo },
      template: `
        <div>
          <Foo>
            <span>foo</span>
            <template #foo="{ value }">
              <span>{{ value }}</span>
            </template>
          </Foo>
        </div>`
    })

    expect(wrapper.find('.default').text()).to.equal('foo')
    expect(wrapper.find('.foo').text()).to.equal('bar')
    expect(wrapper.find('.baz').text()).to.equal('')

    wrapper.destroy()
  })

  it('should render Void component', () => {
    let Foo = {
      template: '<div><slot>foo</slot></div>'
    }

    let wrapper = mount({
      components: { Foo, Void },
      template: `
        <div>
          <Foo></Foo>
          <Foo><Void/></Foo>
        </div>`
    })

    let [foo1, foo2] = wrapper.findAll(Foo).wrappers

    expect(foo1.text()).to.equal('foo')
    expect(foo2.text()).to.equal('')
  })

  it('should forward slots', () => {
    let Foo = {
      template: `
        <div>
          <div class="default">
            <slot>default</slot>
          </div>
          <div class="foo">
            <slot name="foo" value="foo">foo</slot>
          </div>
        </div>`
    }

    let Bar = {
      components: { Foo },
      render (h) {
        let slots = forwardSlots(
          {
            bar: 'default',
            'bar-foo': 'foo',
            foo: 'baz'
          },
          this
        )

        return h(
          Foo,
          {
            scopedSlots: slots.scopedSlots
          },
          slots.slots
        )
      }
    }

    let wrapper = mount({
      components: { Bar },
      template: `
        <div>
          <Bar>
            <template #bar>
              <span>bar</span>
            </template>
            <template #bar-foo="{ value }">
              <span>bar-{{ value }}</span>
            </template>
          </Bar>
        </div>`
    })

    expect(wrapper.find('.default').text()).to.equal('bar')
    expect(wrapper.find('.foo').text()).to.equal('bar-foo')
  })

  it('should slice string safely, considering surrogate pair.', () => {
    const str = '👩‍👩‍👧‍👧'
    expect(safeSlice(str, 1), '#1').to.equal('')
    expect(safeSlice(str, 2), '#2').to.equal(str.slice(0, 2))
    expect(safeSlice(str, 3), '#3').to.equal(str.slice(0, 3))
    expect(safeSlice(str, 4), '#4').to.equal(str.slice(0, 3))
    expect(safeSlice(str, 5), '#5').to.equal(str.slice(0, 5))
    expect(safeSlice(str, str.length + 1), '#6').to.equal(str)
  })
})
