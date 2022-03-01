import { mount } from '@vue/test-utils'
import Checkbox from '@/components/Checkbox'
import Form from '@/components/Form'
import Field from '@/components/Field'
import { expectFieldError } from '../../../utils'

describe('components/Checkbox', () => {
  it('should handle checked prop with `null` value.', (done) => {
    let wrapper = mount(Checkbox, {
      propsData: {
        checked: null
      },
      sync: false
    })

    wrapper.vm.$on('change', (val) => {
      expect(val).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', (done) => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
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
          '<veui-checkbox v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    wrapper.find('input').trigger('change')
  })

  it('should support v-model array', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            group: ['A']
          }
        },
        template: `<div>
            <veui-checkbox v-model="group" value="A"> A </veui-checkbox>
            <veui-checkbox v-model="group" value="B"> B </veui-checkbox>
            <veui-checkbox v-model="group" value="C"> C </veui-checkbox>
          </div>`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    await vm.$nextTick()

    let boxes = wrapper.findAll('input')
    expect(boxes.at(0).element.checked).to.equal(true)
    expect(boxes.at(2).element.checked).to.equal(false)

    boxes.at(0).element.checked = false
    boxes.at(0).trigger('change')

    await vm.$nextTick()
    boxes.at(2).element.checked = true
    boxes.at(2).trigger('change')

    await vm.$nextTick()
    expect(vm.group).to.deep.equal(['C'])

    vm.group = ['B']

    await vm.$nextTick()
    expect(boxes.at(0).element.checked).to.equal(false)
    expect(boxes.at(1).element.checked).to.equal(true)
    expect(boxes.at(2).element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should support checked + change usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            checked: false,
            indeterminate: false
          }
        },
        methods: {
          handleChange (checked) {
            this.checked = checked
          }
        },
        template:
          '<veui-checkbox :checked="checked" :indeterminate="indeterminate" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.indeterminate = true
    vm.checked = true

    await vm.$nextTick()
    expect(vm.indeterminate).to.equal(true)
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(true)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false
    vm.indeterminate = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(false)

    wrapper.destroy()
  })

  it('should support checked.sync usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
        },
        data () {
          return {
            checked: false,
            indeterminate: false
          }
        },
        template:
          '<veui-checkbox :checked.sync="checked" :indeterminate="indeterminate"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.indeterminate = true
    vm.checked = true

    await vm.$nextTick()
    expect(vm.indeterminate).to.equal(true)
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(true)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false
    vm.indeterminate = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)
    expect(box.element.indeterminate).to.equal(false)

    wrapper.destroy()
  })

  it('should only emit change event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
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
        template: '<veui-checkbox :checked="checked" @change="handleChange"/>'
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
    let wrapper = mount(Checkbox, {
      propsData: {
        checked: false
      },
      sync: false
    })

    wrapper.vm.$on('change', (val) => {
      expect(val).to.equal(true)
    })

    wrapper.vm.activate()
  })

  it('should only trigger click once', async () => {
    let count = 0

    let wrapper = mount(
      {
        components: {
          'veui-checkbox': Checkbox
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
        template: '<veui-checkbox :checked="checked" @click="handleClick"/>'
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
          'veui-checkbox': Checkbox,
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
          <veui-field name="gender" :rules="rules" field="gender"><veui-checkbox v-model="data.gender"/></veui-field>
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
      let input = wrapper.find('.veui-checkbox input')
      input.trigger('blur')
      await vm.$nextTick()
    }

    async function inputWithValue (val) {
      await vm.$nextTick()
      let input = wrapper.find('.veui-checkbox input')
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
