import { mount } from '@vue/test-utils'
import Input from '@/components/Input'
import Form from '@/components/Form'
import Field from '@/components/Field'
import { wait } from '../../../utils'

describe('components/Input', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(
      Input,
      {
        propsData: {
          value: null
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('input', val => {
      expect(val).to.equal('')

      wrapper.destroy()
      done()
    })

    wrapper.find('input').trigger('input')
  })

  it('should transparently pass-through attrs to the <input> element.', () => {
    let wrapper = mount(Input, {
      attrs: {
        autofocus: ''
      }
    })

    expect(wrapper.find('input').element.autofocus).to.equal(true)

    wrapper.destroy()
  })

  it('should handle focus event correctly', async () => {
    let wrapper = mount(Input)
    wrapper.find('input').trigger('focus')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(true)
    expect(vm.focused).to.equal(true)

    wrapper.destroy()
  })

  it('should only emit input event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount(
      {
        components: {
          'veui-input': Input
        },
        data () {
          return {
            value: null
          }
        },
        methods: {
          handleChange (checked) {
            changes++
          }
        },
        template: '<veui-input :value="value" @input="handleChange"/>'
      },
      {
        sync: false
      }
    )

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
    let wrapper = mount(Input, {
      propsData: {
        disabled: true
      }
    })

    let { vm } = wrapper
    vm.activate()
    await vm.$nextTick()

    expect(vm.focused).to.equal(false)
    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(false)

    wrapper.destroy()
  })

  it('should clear value when clear button is clicked', done => {
    let wrapper = mount(
      {
        components: {
          'veui-input': Input
        },
        data () {
          return {
            value: 'test'
          }
        },
        methods: {
          handleInput (val) {
            expect(val).to.equal('')
            expect(this.value).to.equal('')
            expect(this.$refs.input.localValue).to.equal('')

            wrapper.destroy()
            done()
          }
        },
        template:
          '<veui-input ref="input" v-model="value" @input="handleInput" clearable/>'
      },
      {
        sync: false
      }
    )

    wrapper.find('button.veui-input-clear').trigger('click')
  })

  it('should render before slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      data () {
        return {
          userName: null
        }
      },
      template: `
        <veui-input v-model="userName">
          <template slot="before">user</template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-before').text()).to.equal('user')
  })

  it('should render after slot correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      data () {
        return {
          userName: null
        }
      },
      template: `
        <veui-input v-model="userName">
          <template slot="after">user</template>
        </veui-input>
      `
    })

    expect(wrapper.find('.veui-input-after').text()).to.equal('user')
  })

  it('should render maxlength limit correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      template: `
        <veui-input value="foo" maxlength="5"/>
      `
    })

    expect(wrapper.find('input').attributes('maxlength')).to.equal(undefined)
    expect(wrapper.find('.veui-input-after').text()).to.equal('3/5')
  })

  it('should render maxlength limit with strict prop correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      template: `
        <veui-input value="foo" maxlength="5" strict/>
      `
    })

    expect(wrapper.find('input').attributes('maxlength')).to.equal('5')
    expect(wrapper.find('.veui-input-after').text()).to.equal('3/5')
  })

  it('should make `value` prop fully controlled', async () => {
    let wrapper = mount(Input, {
      propsData: {
        value: 'foo'
      }
    })

    let input = wrapper.find('input')
    input.element.value = 'bar'
    input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('foo')
  })

  it('should pass event object on input', done => {
    let wrapper = mount(Input, {
      propsData: {
        value: 'foo'
      }
    })
    wrapper.vm.$on('input', (_, e) => {
      expect(!!e).to.equal(true)
      done()
    })

    let input = wrapper.find('input')
    input.element.value = 'bar'
    input.trigger('input')
  })

  it('should handle `getLength` prop correctly', () => {
    let wrapper = mount({
      components: {
        'veui-input': Input
      },
      methods: {
        getLength () {
          return 4
        }
      },
      template: `
        <veui-input value="中文" :get-length="getLength" maxlength="5"/>
      `
    })

    expect(wrapper.find('.veui-input-after').text()).to.equal('4/5')
  })

  it('should handle `trim` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-input': Input
        },
        data () {
          return {
            text: '  123  ',
            trim: null
          }
        },
        template: `
        <veui-input :trim="trim" v-model="text"/>
      `
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find('input')
    let el = input.element
    expect(el.value).to.equal('  123  ')

    el.value += ' '
    input.trigger('input')
    await vm.$nextTick()
    expect(el.value).to.equal('  123   ')
    input.trigger('change')
    await vm.$nextTick()
    expect(el.value).to.equal('  123   ')

    vm.trim = true
    await vm.$nextTick()
    expect(el.value).to.equal('  123   ')

    input.trigger('input')
    await vm.$nextTick()
    expect(el.value).to.equal('  123   ')
    input.trigger('change')
    await vm.$nextTick()
    expect(el.value).to.equal('123')

    el.value = '  123  '
    input.trigger('input')
    await vm.$nextTick()
    expect(el.value).to.equal('  123  ')
    input.trigger('change')
    await vm.$nextTick()
    expect(el.value).to.equal('123')

    vm.trim = 'start'
    await vm.$nextTick()
    expect(el.value).to.equal('123')

    el.value = '  123  '
    input.trigger('input')
    await vm.$nextTick()
    expect(el.value).to.equal('  123  ')
    input.trigger('change')
    await vm.$nextTick()
    expect(el.value).to.equal('123  ')

    vm.trim = 'end'
    await vm.$nextTick()
    expect(el.value).to.equal('123  ')

    el.value = '  123  '
    input.trigger('input')
    await vm.$nextTick()
    expect(el.value).to.equal('  123  ')
    input.trigger('change')
    await vm.$nextTick()
    expect(el.value).to.equal('  123')

    vm.trim = 'both'
    await vm.$nextTick()
    expect(el.value).to.equal('  123')

    el.value = '  123  '
    input.trigger('input')
    await vm.$nextTick()
    expect(el.value).to.equal('  123  ')
    input.trigger('change')
    await vm.$nextTick()
    expect(el.value).to.equal('123')
  })

  it('should apply validations correctly when using input(instance)/blur(native) as triggers.', async () => {
    const ruleErr = 'required'
    const valiErr = 'gender出错啦'
    const validators = [
      {
        fields: ['gender'],
        validate: gender => {
          return !gender
            ? {
              gender: valiErr
            }
            : true
        },
        triggers: 'blur'
      }
    ]

    let wrapper = mount(
      {
        components: {
          'veui-field': Field,
          'veui-input': Input,
          'veui-form': Form
        },
        data () {
          return {
            data: {
              gender: null
            },
            rules: [{ name: 'required', message: ruleErr, triggers: 'blur' }],
            validators
          }
        },
        template: `<veui-form ref="form" :data="data" :validators="validators">
          <veui-field name="gender" :rules="rules" field="gender"><veui-input class="gender-input" v-model="data.gender"/></veui-field>
        </veui-form>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    const { vm } = wrapper
    await vm.$nextTick()
    await blurWithValue(null)
    hasError(valiErr)

    await blurWithValue('1')
    hasError(false)

    vm.validators = null
    await blurWithValue(null)
    hasError(ruleErr)

    await blurWithValue('1')
    hasError(false)

    await changeTrigger('input')

    await inputWithValue(null)
    hasError(valiErr)

    await inputWithValue('1')
    hasError(false)

    vm.validators = null
    await inputWithValue(null)
    hasError(ruleErr)

    await inputWithValue('1')
    hasError(false)

    wrapper.destroy()

    async function blurWithValue (val) {
      vm.data.gender = val
      await vm.$nextTick()
      let input = wrapper.find('.veui-input input')
      input.trigger('blur')
      await wait(0)
    }

    async function inputWithValue (val) {
      await vm.$nextTick()
      let input = wrapper.find('.veui-input input')
      input.element.value = val
      input.trigger('input')
      await wait(0)
    }

    async function changeTrigger (triggers) {
      vm.rules = [{ ...vm.rules[0], triggers }]
      vm.validators = [{ ...validators[0], triggers }]
      await wait(0)
    }

    function hasError (err) {
      if (err) {
        expect(wrapper.find('.veui-field-error').text()).to.contains(err)
      } else {
        expect(wrapper.find('.veui-field-error').exists()).to.eql(false)
      }
    }
  })
})
