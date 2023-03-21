import { mount } from '../../../utils'
import TagInput from '@/components/TagInput'

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
        autofocus: ''
      }
    })

    expect(wrapper.find('input').element.autofocus).to.equal(true)

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

  it('disabled input should not be focused when activated', async () => {
    let wrapper = mount(TagInput, {
      propsData: {
        disabled: true
      }
    })

    let { vm } = wrapper
    vm.activate()
    await vm.$nextTick()

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

    input.trigger('keydown.enter', { key: 'Enter' })
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

    input.trigger('keydown.enter', { key: 'Enter' })
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

    input.trigger('keydown.enter', { key: 'Enter' })
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
    let wrapper = mount(
      {
        components: {
          'veui-tag-input': TagInput
        },
        template: '<veui-tag-input :value="value" :max="5"/>',
        data () {
          return {
            value: ['foo', 'bar', 'baz']
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    const me = wrapper.find(TagInput)
    const count = wrapper.find('.veui-tag-input-tag-count')
    expect(count.exists()).to.equal(true)
    expect(count.text()).to.equal('3/5')
    expect(count.classes('veui-tag-input-tag-count-overflow')).to.equal(false)
    expect(me.classes('veui-invalid')).to.equal(false)

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
        <veui-tag-input :value="value" maxlength="5"/>
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
})
