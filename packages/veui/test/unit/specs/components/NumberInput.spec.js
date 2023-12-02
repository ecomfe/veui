import { mount } from '@vue/test-utils'
import sinon from 'sinon'
import NumberInput from '@/components/NumberInput'
import Form from '@/components/Form'
import Field from '@/components/Field'
import { expectFieldError } from '../../../utils'

describe('components/NumberInput', function () {
  this.timeout(10000)

  it('should handle value prop with `null` value', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        value: null
      },
      sync: false
    })

    let changeHandler = sinon.spy()
    wrapper.vm.$on('change', changeHandler)
    wrapper.find('input').trigger('change')

    await wrapper.vm.$nextTick()
    expect(changeHandler.callCount).to.equal(0)
  })

  it('should transparently pass-through attrs to the <input> element', () => {
    let wrapper = mount(NumberInput, {
      attrs: {
        'data-foo': 'bar'
      },
      sync: false
    })

    expect(wrapper.find('input').element.dataset.foo).to.equal('bar')
  })

  it('should handle focus event correctly', async () => {
    let wrapper = mount(NumberInput)
    wrapper.find('input').trigger('focus')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(true)

    wrapper.destroy()
  })

  it('disabled input should not be focused when activated', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        disabled: true
      },
      sync: false
    })

    let { vm } = wrapper
    vm.activate()
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(false)

    wrapper.destroy()
  })

  it('should not exceed max or min value', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-number-input': NumberInput
        },
        template: '<veui-number-input :min="1" :max="3" v-model="val"/>',
        data () {
          return {
            val: 2
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let up = wrapper.find('.veui-number-input-step-up')
    let down = wrapper.find('.veui-number-input-step-down')
    let input = wrapper.find('input').element

    up.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('3')
    up.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('3')

    down.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('2')
    down.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('1')
    down.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('1')

    wrapper.destroy()
  })

  it('should handle readonly correctly', () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        readonly: true
      },
      sync: false
    })

    let input = wrapper.find('input.veui-input-input')
    input.setValue(2)
    expect(input.attributes('readonly')).to.equal('readonly')

    expect(input.element.value).to.equal('2')
  })

  it('should handle step prop correctly', async () => {
    let wrapper = mount(
      NumberInput,
      {
        propsData: {
          step: 3
        }
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input.veui-input-input')
    wrapper.find('.veui-number-input-step-up').trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('3')
  })

  it('should handle `decimal-place` prop  correctly', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        decimalPlace: 2
      },
      sync: false
    })

    let input = wrapper.find('input.veui-input-input')
    input.setValue('2')
    wrapper.find('input').trigger('change')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('2.00')

    input.setValue('2.333')
    wrapper.find('input').trigger('change')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('2.33')
  })

  it('should handle change event', async () => {
    let wrapper = mount(NumberInput, {
      sync: false
    })

    let value = null
    wrapper.vm.$on('change', (val) => {
      value = val
    })

    wrapper.find('.veui-number-input-step-up').trigger('click')
    await wrapper.vm.$nextTick()
    expect(value).equal(1)
    wrapper.destroy()
  })

  it('should make prop `value` fully controlled and violate `decimal-place` for respecting prop `value`', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        value: 2.123,
        decimalPlace: 2
      },
      sync: false
    })

    let input = wrapper.find('input.veui-input-input')
    expect(input.element.value).to.equal('2.123')

    input.setValue('2')
    wrapper.find('input').trigger('change')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('2.123')
    wrapper.destroy()
  })

  it('should step value from a invalid value correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-number-input': NumberInput
        },
        data () {
          return {
            val: 'aaa'
          }
        },
        template: `<veui-number-input v-model="val"/>`
      },
      {
        sync: false
      }
    )

    wrapper.find('.veui-number-input-step-up').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.val).to.equal(1)
    wrapper.destroy()
  })

  it('should clear value correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'v-number-input': NumberInput
        },
        data () {
          return {
            val: 123
          }
        },
        template: `<v-number-input v-model="val"/>`
      },
      {
        sync: false
      }
    )

    let nativeInput = wrapper.find('.veui-number-input .veui-input-input')
    nativeInput.element.value = ''
    nativeInput.trigger('change')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.val).to.equal(null)
    wrapper.destroy()
  })

  it('should apply validations correctly when using input(instance)/blur(native) as triggers', async () => {
    const ruleErr = 'required'
    const valiErr = 'gender出错啦'
    const validators = [
      {
        fields: ['gender'],
        validate: (gender) => {
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
          'veui-number-input': NumberInput,
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
          <veui-field name="gender" :rules="rules" field="gender"><veui-number-input v-model="data.gender"/></veui-field>
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
    expectFieldError(wrapper, valiErr)

    await blurWithValue(1)
    expectFieldError(wrapper, false)

    vm.validators = null
    await blurWithValue(null)
    expectFieldError(wrapper, ruleErr)

    await blurWithValue(1)
    expectFieldError(wrapper, false)

    await changeTrigger('input')

    await inputWithValue(null)
    expectFieldError(wrapper, valiErr)

    await inputWithValue(1)
    expectFieldError(wrapper, false)

    vm.validators = null
    await inputWithValue(null)
    expectFieldError(wrapper, ruleErr)

    await inputWithValue(1)
    expectFieldError(wrapper, false)

    wrapper.destroy()

    async function blurWithValue (val) {
      vm.data.gender = val
      await vm.$nextTick()
      let input = wrapper.find('.veui-number-input input')
      input.trigger('blur')
      await vm.$nextTick()
    }

    async function inputWithValue (val) {
      await vm.$nextTick()
      let input = wrapper.find('.veui-number-input input')
      input.element.value = val
      input.trigger('change')
      await vm.$nextTick()
    }

    async function changeTrigger (triggers) {
      vm.rules = [{ ...vm.rules[0], triggers }]
      vm.validators = [{ ...validators[0], triggers }]
      await vm.$nextTick()
    }
  })

  it('should mask input correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-number-input': NumberInput
        },
        data () {
          return {
            decimalPlace: 0,
            max: undefined,
            min: undefined
          }
        },
        template: `<veui-number-input :decimal-place="decimalPlace" :max="max" :min="min"/>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let input = wrapper.find(NumberInput).vm
    expect(input.mask).to.equal('-?#*')

    vm.decimalPlace = 2
    vm.max = -10
    await vm.$nextTick()
    expect(input.mask).to.equal('-#*.##')

    vm.decimalPlace = 4
    vm.max = 10
    vm.min = -10
    await vm.$nextTick()
    expect(input.mask).to.equal('-?#*.####')

    vm.decimalPlace = -1
    vm.max = undefined
    vm.min = 10
    await vm.$nextTick()
    expect(input.mask).to.equal('#*.#*')

    wrapper.destroy()
  })
})
