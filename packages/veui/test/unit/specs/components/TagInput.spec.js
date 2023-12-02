import { mount, wait } from '../../../utils'
import TagInput from '@/components/TagInput'
import Tag from '@/components/Tag'

describe('components/TagInput', function () {
  this.timeout(10000)

  it('should handle value prop with `null` value', (done) => {
    let wrapper = mount(TagInput, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('input', (val) => {
      expect(val).to.equal('foo')

      wrapper.destroy()
      done()
    })

    const input = wrapper.find('input')
    input.element.value = 'foo'
    input.trigger('input')
  })

  it('should transparently pass-through attrs to the <input> element', () => {
    let wrapper = mount(TagInput, {
      attrs: {
        'data-foo': 'bar'
      }
    })

    expect(wrapper.find('input').element.dataset.foo).to.equal('bar')

    wrapper.destroy()
  })

  it('should handle focus event correctly', async () => {
    let wrapper = mount(TagInput)
    wrapper.find('input').trigger('focus')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(wrapper.find('.veui-tag-input').classes('veui-focus')).to.equal(true)

    wrapper.destroy()
  })

  it('should only emit input event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      data () {
        return {
          value: null
        }
      },
      methods: {
        handleInput () {
          changes++
        }
      },
      template: '<veui-tag-input :input-value="value" @input="handleInput"/>'
    })

    let { vm } = wrapper

    vm.value = 'foo'

    await vm.$nextTick()
    expect(changes).to.equal(0)

    let box = wrapper.find('input')
    box.element.value = 'bar'
    box.trigger('input')

    box.element.value = 'baz'
    box.trigger('input')

    await vm.$nextTick()
    expect(changes).to.equal(2)

    wrapper.destroy()
  })

  it('should handle focus and activate correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-tag-input': TagInput
        },
        data () {
          return {
            value: null,
            readonly: false,
            disabled: false
          }
        },
        template:
          '<veui-tag-input ref="input" :readonly="readonly" :disabled="disabled"/>'
      },
      {
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    const { input } = vm.$refs

    input.activate()
    await wait(0)
    expect(wrapper.find('.veui-tag-input').classes('veui-focus')).to.equal(true)
    document.body.focus()
    vm.readonly = true
    await vm.$nextTick()

    input.focus()
    await wait(0)
    expect(wrapper.find('.veui-tag-input').classes('veui-focus')).to.equal(true)
    document.body.focus()
    vm.readonly = false
    vm.disabled = true
    await vm.$nextTick()

    input.activate()
    await wait(0)
    expect(wrapper.find('.veui-tag-input').classes('veui-focus')).to.equal(
      false
    )

    wrapper.destroy()
  })

  it('should support controlled `value` and `input-value`', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      data () {
        return {
          value: ['foo'],
          inputValue: 'bar'
        }
      },
      template:
        '<veui-tag-input ref="input" :value="value" :input-value="inputValue"/>'
    })

    let { vm } = wrapper
    let input = wrapper.find('input')
    let tags = wrapper.findAll('.veui-tag')

    expect(tags.length).to.equal(1)
    expect(tags.at(0).text()).to.equal('foo')
    expect(input.element.value).to.equal('bar')

    vm.value = ['foo', 'bar']
    vm.inputValue = 'baz'

    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(2)
    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(input.element.value).to.equal('baz')

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(2)
    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(input.element.value).to.equal('baz')

    wrapper.destroy()
  })

  it('should support two-way `value` and `input-value`', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      data () {
        return {
          value: ['foo'],
          inputValue: 'bar'
        }
      },
      template:
        '<veui-tag-input ref="input" v-model="value" :input-value.sync="inputValue"/>'
    })

    let { vm } = wrapper
    let input = wrapper.find('input')
    let tags = wrapper.findAll('.veui-tag')

    expect(tags.length).to.equal(1)
    expect(tags.at(0).text()).to.equal('foo')
    expect(input.element.value).to.equal('bar')

    vm.value = ['foo', 'bar']
    vm.inputValue = 'baz'

    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(2)
    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(input.element.value).to.equal('baz')

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(3)
    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(tags.at(2).text()).to.equal('baz')
    expect(input.element.value).to.equal('')
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz'])
    expect(vm.inputValue).to.equal('')

    wrapper.destroy()
  })

  it('should append tags correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      data () {
        return {
          value: ['foo'],
          inputValue: ' ',
          readonly: false
        }
      },
      template:
        '<veui-tag-input ref="input" v-model="value" :input-value.sync="inputValue" :readonly="readonly"/>'
    })

    let { vm } = wrapper
    let input = wrapper.find('input')

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    let tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(1)
    expect(input.element.value).to.equal(' ')

    vm.inputValue = '  bar  '
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(2)
    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(input.element.value).to.equal('')

    await vm.$nextTick()
    input.trigger('keydown', { key: 'Esc' })

    await vm.$nextTick()
    expect(tags.length).to.equal(2)
    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(input.element.value).to.equal('')

    vm.inputValue = `w'x'y'y`
    await vm.$nextTick()
    input.trigger('compositionstart', { data: `w'x'y'y` })
    input.trigger('compositionupdate', { data: `w'x'y'y` })
    input.trigger('input')

    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })

    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(2)

    vm.inputValue = '文心一言'
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    input.trigger('compositionupdate', { data: '文心一言' })
    input.trigger('input')
    input.trigger('compositionend', { data: '文心一言' })

    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })

    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(3)

    vm.readonly = true
    vm.inputValue = 'baz'
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.length).to.equal(3)
    expect(input.element.value).to.equal('baz')

    wrapper.destroy()
  })

  it('should support uncontrolled `value` and `input-value`', async () => {
    let val
    let inputVal

    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template:
        '<veui-tag-input ref="input" @input="handleInput" @change="handleChange"/>',
      methods: {
        handleInput (value) {
          inputVal = value
        },
        handleChange (value) {
          val = value
        }
      }
    })

    let { vm } = wrapper
    let input = wrapper.find('input')
    let tags = wrapper.findAll('.veui-tag')

    expect(tags.length).to.equal(0)
    expect(input.element.value).to.equal('')

    input.element.value = 'foo'
    input.trigger('input')

    await vm.$nextTick()
    expect(val).to.deep.equal(undefined)
    expect(inputVal).to.equal('foo')
    expect(tags.length).to.equal(0)

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(val).to.deep.equal(['foo'])
    expect(inputVal).to.equal('')

    wrapper.destroy()
  })

  it('should clear `value` and `input-value` when clear button is clicked', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      data () {
        return {
          value: ['foo'],
          inputValue: 'test'
        }
      },
      template:
        '<veui-tag-input ref="input" v-model="value" :input-value.sync="inputValue" clearable/>'
    })

    const { vm } = wrapper

    wrapper.find('.veui-tag-input-clear').trigger('click')

    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])
    expect(vm.inputValue).to.equal('')

    wrapper.destroy()
  })

  it('should render max limit correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: '<veui-tag-input :value="value" :max="5"/>',
      data () {
        return {
          value: ['foo', 'bar', 'baz']
        }
      }
    })

    const { vm } = wrapper
    const me = wrapper.find(TagInput)
    const count = wrapper.find('.veui-tag-input-tag-count')
    expect(count.exists()).to.equal(true)
    expect(count.text()).to.equal('3/5')
    expect(count.classes('veui-tag-input-tag-count-overflow')).to.equal(false)
    expect(me.classes('veui-invalid')).to.equal(false)

    vm.value = null
    await vm.$nextTick()
    expect(count.text()).to.equal('0/5')

    vm.value = ['foo', 'bar', 'baz', 'qux', 'quux', 'corge']
    await vm.$nextTick()
    expect(count.text()).to.equal('6/5')
    expect(count.classes('veui-tag-input-tag-count-overflow')).to.equal(true)
    expect(me.classes('veui-invalid')).to.equal(true)

    wrapper.destroy()
  })

  it('should render maxlength limit correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `
        <veui-tag-input :value="value" :maxlength="5"/>
      `,
      data () {
        return {
          value: ['foo', 'bar', 'baz']
        }
      }
    })

    const { vm } = wrapper
    const me = wrapper.find(TagInput)
    let tags = wrapper.findAll('.veui-tag')

    expect(tags.at(0).classes('veui-tag-error')).to.equal(false)
    expect(tags.at(1).classes('veui-tag-error')).to.equal(false)
    expect(tags.at(2).classes('veui-tag-error')).to.equal(false)
    expect(me.classes('veui-invalid')).to.equal(false)

    vm.value = ['fooooo', 'bar', 'bazzzz']
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    expect(tags.at(0).classes('veui-tag-error')).to.equal(true)
    expect(tags.at(1).classes('veui-tag-error')).to.equal(false)
    expect(tags.at(2).classes('veui-tag-error')).to.equal(true)
    expect(me.classes('veui-invalid')).to.equal(true)

    wrapper.destroy()
  })

  it('should handle `strict` prop correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `
        <veui-tag-input v-model="value" :input-value.sync="inputValue" :strict="strict" :max="3" :maxlength="5"/>
      `,
      data () {
        return {
          value: ['foo', 'bar', 'baz'],
          inputValue: 'qux',
          strict: true
        }
      }
    })

    const { vm } = wrapper
    const input = wrapper.find('input')

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(input.attributes('maxlength')).to.equal('5')
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz'])

    vm.strict = false
    vm.inputValue = 'qux'
    await vm.$nextTick()
    expect(input.attributes('maxlength')).to.equal(undefined)
    input.trigger('keydown', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz', 'qux'])

    vm.strict = { max: true }
    vm.inputValue = 'quux'
    await vm.$nextTick()
    expect(input.attributes('maxlength')).to.equal(undefined)
    input.trigger('keydown', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz', 'qux'])

    vm.strict = { maxlength: true }
    vm.inputValue = 'quux'
    await vm.$nextTick()
    expect(input.attributes('maxlength')).to.equal('5')
    input.trigger('keydown', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz', 'qux', 'quux'])

    vm.strict = { max: true, maxlength: true }
    vm.inputValue = 'corge'
    await vm.$nextTick()
    expect(input.attributes('maxlength')).to.equal('5')
    input.trigger('keydown', { key: 'Enter' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz', 'qux', 'quux'])

    wrapper.destroy()
  })

  it('should handle `getLength` prop correctly', () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `
        <veui-tag-input :value="value" :get-length="getLength" :maxlength="5"/>
      `,
      data () {
        return {
          value: ['f', 'ba', 'baz']
        }
      },
      methods: {
        getLength (value) {
          return value.length * 2
        }
      }
    })

    const me = wrapper.find(TagInput)
    const tags = wrapper.findAll('.veui-tag')

    expect(tags.at(0).classes('veui-tag-error')).to.equal(false)
    expect(tags.at(1).classes('veui-tag-error')).to.equal(false)
    expect(tags.at(2).classes('veui-tag-error')).to.equal(true)
    expect(me.classes('veui-invalid')).to.equal(true)

    wrapper.destroy()
  })

  it('should handle tag removal correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `<veui-tag-input ref="input" v-model="value" :input-value.sync="inputValue"
          :readonly="readonly" :disabled="disabled" allow-duplicate clearable/>`,
      data () {
        return {
          value: ['foo', 'bar', 'bar'],
          inputValue: 'qux',
          readonly: false,
          disabled: false
        }
      }
    })

    const { vm } = wrapper
    let tags = wrapper.findAll('.veui-tag')

    tags.at(1).find('.veui-tag-remove').trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar'])

    const input = wrapper.find('input')
    input.trigger('keydown', { key: 'Backspace' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar'])

    vm.inputValue = ''
    await vm.$nextTick()
    input.trigger('compositionstart', { data: `w'x'y'y` })
    input.trigger('compositionupdate', { data: `w'x'y'y` })
    input.trigger('input')

    await vm.$nextTick()
    input.trigger('keydown', { key: 'Backspace' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar'])

    vm.inputValue = '文心一言'
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    input.trigger('compositionupdate', { data: '文心一言' })
    input.trigger('input')
    input.trigger('compositionend', { data: '文心一言' })

    await vm.$nextTick()
    input.trigger('keydown', { key: 'Backspace' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo'])

    vm.inputValue = ''
    await vm.$nextTick()
    input.trigger('input')
    input.trigger('keydown', { key: 'Backspace' })

    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])

    vm.value = ['foo', 'bar', 'baz']
    vm.readonly = true
    await vm.$nextTick()

    tags = wrapper.findAll('.veui-tag')
    expect(tags.at(0).find('.veui-tag-remove').exists()).to.equal(false)
    expect(tags.at(1).find('.veui-tag-remove').exists()).to.equal(false)
    expect(tags.at(2).find('.veui-tag-remove').exists()).to.equal(false)

    vm.readonly = false
    vm.disabled = true
    await vm.$nextTick()

    tags = wrapper.findAll('.veui-tag')
    expect(tags.at(0).find('.veui-tag-remove').exists()).to.equal(false)
    expect(tags.at(1).find('.veui-tag-remove').exists()).to.equal(false)
    expect(tags.at(2).find('.veui-tag-remove').exists()).to.equal(false)

    wrapper.destroy()
  })

  it('should handle `allow-duplicate` correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `
        <veui-tag-input v-model="value" :input-value.sync="inputValue" :allow-duplicate="allowDuplicate"/>
      `,
      data () {
        return {
          value: ['foo', 'bar', 'baz'],
          inputValue: 'foo',
          allowDuplicate: false
        }
      }
    })

    const { vm } = wrapper
    const input = wrapper.find('input')

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz'])

    vm.allowDuplicate = true
    vm.inputValue = 'foo'
    await vm.$nextTick()

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz', 'foo'])

    wrapper.destroy()
  })

  it('should handle tag edit correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `
        <veui-tag-input v-model="value" :input-value.sync="inputValue" :readonly="readonly" :disabled="disabled"/>
      `,
      data () {
        return {
          value: ['foo', 'bar', 'baz'],
          inputValue: 'qux',
          readonly: false,
          disabled: false
        }
      }
    })

    const { vm } = wrapper

    let tags = wrapper.findAll('.veui-tag')
    tags.at(0).find('.veui-tag').trigger('dblclick')
    await vm.$nextTick()
    expect(vm.inputValue).to.equal('foo')
    expect(vm.value).to.deep.equal(['bar', 'baz'])

    tags = wrapper.findAll('.veui-tag')
    tags.at(0).find('.veui-tag').trigger('dblclick')
    await vm.$nextTick()
    expect(vm.inputValue).to.equal('bar')
    expect(vm.value).to.deep.equal(['baz'])

    vm.readonly = true
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    tags.at(0).find('.veui-tag').trigger('dblclick')
    await vm.$nextTick()
    expect(vm.inputValue).to.equal('bar')
    expect(vm.value).to.deep.equal(['baz'])

    vm.readonly = false
    vm.disabled = true
    await vm.$nextTick()
    tags = wrapper.findAll('.veui-tag')
    tags.at(0).find('.veui-tag').trigger('dblclick')
    await vm.$nextTick()
    expect(vm.inputValue).to.equal('bar')
    expect(vm.value).to.deep.equal(['baz'])

    wrapper.destroy()
  })

  it('should append tag upon blur if input value is not empty', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `<veui-tag-input v-model="value" :input-value.sync="inputValue"/>`,
      data () {
        return {
          value: ['foo', 'bar', 'baz'],
          inputValue: 'qux'
        }
      }
    })

    const { vm } = wrapper
    const input = wrapper.find('input')

    input.trigger('blur')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['foo', 'bar', 'baz', 'qux'])

    wrapper.destroy()
  })

  it('should sync input width with input value', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `<veui-tag-input :input-value.sync="inputValue"/>`,
      data () {
        return {
          inputValue: 'foo'
        }
      }
    })

    const { vm } = wrapper
    const input = wrapper.find('input')
    const { element } = input
    element.value = 'quxquxqux'
    input.trigger('input')
    await vm.$nextTick()
    expect(element.style.width).to.equal(`${element.scrollWidth + 1}px`)

    wrapper.destroy()
  })

  it('should support `tag` slot with VEUI Tag', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput,
        'veui-tag': Tag
      },
      template: `
        <veui-tag-input v-model="value" :input-value.sync="inputValue">
          <template #tag="{ tag, attrs, listeners, index }">
            <veui-tag v-bind="attrs" v-on="listeners" :color="colors[index]">{{ tag }}</veui-tag>
          </template>
        </veui-tag-input>
      `,
      data () {
        return {
          value: ['foo', 'bar', 'baz'],
          inputValue: ''
        }
      },
      computed: {
        colors () {
          return this.value.map(
            (_, i) => ['turquoise', 'violet', 'green'][i % 3]
          )
        }
      }
    })

    const { vm } = wrapper
    let tags = wrapper.findAll('.veui-tag')

    expect(tags.at(0).classes('veui-tag-turquoise')).to.equal(true)
    expect(tags.at(1).classes('veui-tag-violet')).to.equal(true)
    expect(tags.at(2).classes('veui-tag-green')).to.equal(true)

    tags.at(0).find('.veui-tag-remove').trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['bar', 'baz'])

    tags = wrapper.findAll('.veui-tag')
    tags.at(0).trigger('dblclick')

    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['baz'])
    expect(vm.inputValue).to.equal('bar')

    wrapper.destroy()
  })

  it('should support `tag` slot with custom tag', async () => {
    let wrapper = mount({
      components: {
        'veui-tag-input': TagInput
      },
      template: `
        <veui-tag-input v-model="value" :input-value.sync="inputValue" :disabled="disabled">
          <template #tag="{ tag, key, edit, index, remove, disabled }">
            <span
              class="custom-tag"
              :key="key"
              :data-disabled="String(disabled)"
              @click="edit"
              @dblclick="remove"
            >{{ tag }}</span>
          </template>
        </veui-tag-input>
      `,
      data () {
        return {
          value: ['foo', 'bar', 'baz'],
          inputValue: '',
          disabled: false
        }
      }
    })

    const { vm } = wrapper
    let tags = wrapper.findAll('.custom-tag')

    expect(tags.at(0).text()).to.equal('foo')
    expect(tags.at(1).text()).to.equal('bar')
    expect(tags.at(2).text()).to.equal('baz')

    tags.at(0).trigger('dblclick')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['bar', 'baz'])

    tags = wrapper.findAll('.custom-tag')
    tags.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['baz'])
    expect(vm.inputValue).to.equal('bar')

    vm.disabled = true
    vm.inputValue = ''

    await vm.$nextTick()
    tags = wrapper.findAll('.custom-tag')
    tags.at(0).trigger('dblclick')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['baz'])
    expect(tags.at(0).attributes('data-disabled')).equal('true')

    wrapper.destroy()
  })
})
