import { mount } from '@vue/test-utils'
import Switch from '@/components/Switch'
import Form from '@/components/Form'
import Field from '@/components/Field'
import sinon from 'sinon'
import { expectFieldError } from '../../../utils'

describe('components/Switch', function () {
  this.timeout(10000)

  it('should handle checked prop with `null` value.', (done) => {
    let wrapper = mount(Switch, {
      propsData: {
        checked: null
      }
    })

    wrapper.vm.$on('change', (val) => {
      expect(val).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', (done) => {
    let wrapper = mount({
      components: {
        'veui-switch': Switch
      },
      data () {
        return {
          choice: 'YES'
        }
      },
      methods: {
        handleChange (checked) {
          expect(checked).to.equal(false)
          expect(this.choice).to.equal('NO')

          wrapper.destroy()
          done()
        }
      },
      template:
        '<veui-switch v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
    })

    wrapper.find('input').trigger('change')
  })

  it('should handle disabled prop correctly.', (done) => {
    let wrapper = mount(Switch, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.vm.disabled).to.be.equals(true)

    wrapper.destroy()
    done()
  })

  it('should handle change correctly when disabled', async () => {
    let wrapper = mount(Switch, {
      propsData: {
        disabled: true
      }
    })

    let changeHandler = sinon.spy()
    wrapper.vm.$on('change', changeHandler)
    wrapper.find('input').trigger('change')

    await wrapper.vm.$nextTick()
    expect(changeHandler.callCount).to.equal(0)

    wrapper.destroy()
  })

  it('should support checked + change usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleChange (checked) {
            this.checked = checked
          }
        },
        template: '<veui-switch :checked="checked" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.checked = true

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should support checked.sync usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        template: '<veui-switch :checked.sync="checked"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.checked = true

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should only emit change event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleChange (checked) {
            changes++
          }
        },
        template: '<veui-switch :checked="checked" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    vm.checked = true
    vm.checked = false

    await vm.$nextTick()
    vm.checked = true

    await vm.$nextTick()
    vm.checked = false

    await vm.$nextTick()
    expect(changes).to.equal(0)

    let box = wrapper.find('input')
    box.element.checked = true
    box.trigger('change')

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(changes).to.equal(4)

    wrapper.destroy()
  })

  it('should handle correctly when activated', () => {
    let wrapper = mount(
      Switch,
      {
        propsData: {
          checked: false
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('change', (val) => {
      expect(val).to.equal(true)
    })

    wrapper.vm.activate()
  })

  it('should handle `model` prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            model: false
          }
        },
        template: '<veui-switch :model="model"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find('input')
    expect(input.element.checked).to.equal(false)

    vm.model = true
    await vm.$nextTick()
    expect(input.element.checked).to.equal(true)

    // 从 true -> false 不能受之前 localChecked 的影响
    vm.model = false
    await vm.$nextTick()
    expect(input.element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should make prop `checked` fully controlled', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        template: '<veui-switch :checked="checked"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find('input')
    expect(input.element.checked).to.equal(false)

    input.trigger('change')
    await vm.$nextTick()
    expect(input.element.checked).to.equal(false)
    wrapper.destroy()
  })

  it('should only trigger click once', async () => {
    let count = 0

    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleClick () {
            count++
          }
        },
        template: '<veui-switch :checked="checked" @click="handleClick"/>'
      },
      {
        sync: false
      }
    )

    wrapper.trigger('click')

    await wrapper.vm.$nextTick()

    expect(count).to.equal(1)
  })

  it('should apply validations correctly when using input(instance)/blur(native) as triggers.', async () => {
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
          'veui-switch': Switch,
          'veui-form': Form
        },
        data () {
          return {
            data: {
              gender: null
            },
            rules: [
              {
                name: 'pattern',
                value: /true/,
                message: ruleErr,
                triggers: 'blur'
              }
            ],
            validators
          }
        },
        template: `<veui-form ref="form" :data="data" :validators="validators">
          <veui-field name="gender" :rules="rules" field="gender"><veui-switch v-model="data.gender"/></veui-field>
        </veui-form>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    const { vm } = wrapper
    await vm.$nextTick()
    await blurWithValue(false)
    expectFieldError(wrapper, valiErr)

    await blurWithValue(true)
    expectFieldError(wrapper, false)

    vm.validators = null
    await blurWithValue(false)
    expectFieldError(wrapper, ruleErr)

    await blurWithValue(true)
    expectFieldError(wrapper, false)

    await changeTrigger('input')

    await inputWithValue(false)
    expectFieldError(wrapper, valiErr)

    await inputWithValue(true)
    expectFieldError(wrapper, false)

    vm.validators = null
    await inputWithValue(false)
    expectFieldError(wrapper, ruleErr)

    await inputWithValue(true)
    expectFieldError(wrapper, false)

    wrapper.destroy()

    async function blurWithValue (val) {
      vm.data.gender = val
      await vm.$nextTick()
      let input = wrapper.find('.veui-switch input')
      input.trigger('blur')
      await vm.$nextTick()
    }

    async function inputWithValue (val) {
      await vm.$nextTick()
      let input = wrapper.find('.veui-switch input')
      input.element.checked = val
      input.trigger('change')
      await vm.$nextTick()
    }

    async function changeTrigger (triggers) {
      vm.rules = [{ ...vm.rules[0], triggers }]
      vm.validators = [{ ...validators[0], triggers }]
      await vm.$nextTick()
    }
  })
})
