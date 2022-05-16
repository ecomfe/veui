import Input from '@/components/Input'
import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'
import { wait, expectFieldError } from '../../../../utils'

let slot = `
  <veui-field name="gender" field="gender"><veui-input ref="gender" class="gender-input"/></veui-field>
  <veui-field name="age" field="age" disabled><veui-input ref="age" class="age-input"/></veui-field>
`
function genSimpleForm (propsData = {}, defaultSlot = slot, actions = false) {
  actions = actions
    ? '<template #actions="{ validating }"><span class="test-actions">{{String(validating)}}</span></template>'
    : ''
  let wrapper = mount(
    {
      components: {
        'veui-field': Field,
        'veui-input': Input,
        'veui-button': Button,
        'veui-form': Form
      },
      data () {
        return { propsData }
      },
      template: `<veui-form ref="form" v-bind="propsData">${defaultSlot}${actions}</veui-form>`
    },
    {
      sync: false,
      attachToDocument: true
    }
  )
  let { form, gender, age } = wrapper.vm.$refs
  return { form, wrapper, gender, age }
}

describe('components/Form/Form', function () {
  this.timeout(10000)

  it('should set `disabled` state correctly', () => {
    let { wrapper } = genSimpleForm({ disabled: true })
    let isDisabled = wrapper
      .findAll('input')
      .wrappers.every((item) => item.element.disabled)

    expect(isDisabled).to.equal(true)
    expect(wrapper.findAll('.veui-disabled').wrappers.length).to.equal(2)
    wrapper.destroy()
  })

  it('should set `readonly` state correctly', () => {
    let { wrapper } = genSimpleForm({ readonly: true })
    let isReadonly = wrapper
      .findAll('input')
      .wrappers.every((item) => item.element.readOnly)

    expect(isReadonly).to.equal(true)
    expect(wrapper.findAll('.veui-readonly').wrappers.length).to.equal(2)
    wrapper.destroy()
  })

  it('should render default slot correctly', () => {
    let { wrapper } = genSimpleForm()
    expect(wrapper.findAll('.veui-field').wrappers.length).not.to.equal(0)
    wrapper.destroy()
  })

  it('should set data and ui props correctly', () => {
    let { wrapper } = genSimpleForm({ ui: 'inline' })
    expect(wrapper.attributes().ui).to.equal('inline')
    wrapper.destroy()
  })

  it('should call validators and hooks in a correct order and emit submit event', () => {
    let arr = []
    let { wrapper, form } = genSimpleForm({
      beforeValidate () {
        arr.push(1)
        return true
      },
      afterValidate () {
        arr.push(3)
        return true
      },
      validators: [
        {
          fields: ['age', 'gender'],
          handler: (data) => {
            arr.push(2)
            return undefined
          }
        }
      ]
    })
    form.$on('submit', () => {
      expect(arr.join('')).to.equal('123')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should emit invalid event if before-validate do not return true or undefined', () => {
    let message
    let { wrapper, form } = genSimpleForm({
      beforeValidate () {
        message = 'beforeValidate failed'
        return message
      },
      afterValidate () {
        message = "afterValidate won't be called"
        return true
      },
      validators: [
        {
          fields: ['age', 'gender'],
          handler: (data) => {
            message = "validators won't be called"
            return true
          }
        }
      ]
    })
    form.$on('invalid', () => {
      expect(message).to.equal('beforeValidate failed')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should emit invalid event if validate do not return true or undefined', () => {
    let message
    let { wrapper, form } = genSimpleForm({
      beforeValidate () {
        message = 'beforeValidate successed'
        return true
      },
      afterValidate () {
        message = "afterValidate won't be called"
        return true
      },
      validators: [
        {
          fields: ['age', 'gender'],
          handler: (data) => {
            message = 'validators failed'
            return { age: 'validators failed' }
          }
        }
      ]
    })
    form.$on('invalid', () => {
      expect(message).to.equal('validators failed')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should emit invalid event if after-validate do not return true or undefined', () => {
    let message
    let { wrapper, form } = genSimpleForm({
      beforeValidate () {
        message = 'beforeValidate successed'
        return true
      },
      afterValidate () {
        message = 'afterValidate failed'
        return message
      },
      validators: [
        {
          fields: ['age', 'gender'],
          handler: (data) => {
            message = 'validators successed'
            return undefined
          }
        }
      ]
    })
    form.$on('invalid', () => {
      expect(message).to.equal('afterValidate failed')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should igore those fields whose disabled state is true when submit the form', () => {
    let { wrapper, form } = genSimpleForm({
      data: {
        age: '18',
        gender: 'male'
      },
      beforeValidate (data) {
        expect(data).include({ gender: 'male' })
        expect(data).not.include({ age: '18' })
      },
      afterValidate (data) {
        expect(data).include({ gender: 'male' })
        expect(data).not.include({ age: '18' })
      }
    })

    form.$on('submit', (data) => {
      expect(data).include({ gender: 'male' })
      expect(data).not.include({ age: '18' })
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('validated message should be removed if the validate passed', () => {
    let counter = 0
    let { wrapper, form } = genSimpleForm({
      validators: [
        {
          fields: ['age'],
          validate () {
            if (counter === 0) {
              counter++
              return { age: '出错啦' }
            }
          },
          triggers: ['submit']
        }
      ]
    })
    wrapper.trigger('submit')
    let ageWrapper = wrapper.findAll('.veui-field').wrappers[1]
    form.$on('invalid', () => {
      expectFieldError(ageWrapper, '出错啦')
      wrapper.trigger('submit')
    })
    form.$on('submit', () => {
      expectFieldError(ageWrapper, false)
      wrapper.destroy()
    })
  })

  it("validators's result should have higher priority than field's rule property", () => {
    let slot = `
      <veui-field name="gender" rules="required" field="gender"><veui-input class="gender-input"/></veui-field>
      <veui-field name="age" rules="required" field="age" disabled><veui-input class="age-input"/></veui-field>
    `
    let { wrapper, form } = genSimpleForm(
      {
        validators: [
          {
            fields: ['age', 'gender'],
            validate: (age, gender) => {
              return {
                age: 'age出错啦',
                gender: 'gender出错啦'
              }
            },
            triggers: 'input, submit'
          }
        ]
      },
      slot
    )
    let [genderWrapper, ageWrapper] = wrapper.findAll('.veui-field').wrappers
    form.$on('invalid', () => {
      expectFieldError(genderWrapper, 'gender出错啦')
      expectFieldError(ageWrapper, 'age出错啦')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('validators should support asynchronous validating logic', () => {
    let counter = 1
    let { wrapper, form } = genSimpleForm({
      data: {
        gender: 'male',
        age: '18'
      },
      validators: [
        {
          fields: ['age', 'gender'],
          async validate (age, gender) {
            await wait(0)
            expect(counter).to.equal(1)
            counter = 2
            return true
          },
          triggers: ['submit']
        }
      ]
    })
    form.$on('submit', () => {
      expect(counter).to.equal(2)
      wrapper.destroy()
    })

    wrapper.trigger('submit')
  })

  it("validators's `triggers` property should work correctly", async () => {
    let wrapper
    let counter = 0
    let slot = `
      <veui-field name="gender" field="gender"><veui-input class="gender-input"/></veui-field>
      <veui-field name="age" field="age"><veui-input class="age-input"/></veui-field>
    `
    let pro = new Promise((resolve) => {
      wrapper = genSimpleForm(
        {
          validators: [
            {
              fields: ['age'],
              validate () {
                counter++
                resolve('age validator had been fired')
              },
              // `change` is in order to increase coverage
              triggers: ['submit', 'change']
            },
            {
              fields: ['gender'],
              handler () {
                counter++
                resolve('gender validator had been fired')
              },
              // `change` is in order to increase coverage
              triggers: ['input', 'change']
            },
            // for coverage
            {
              fields: null,
              validator: null,
              triggers: null
            }
          ]
        },
        slot
      ).wrapper
      let [genderWrapper, ageWrapper] = wrapper.findAll('.veui-input').wrappers
      // veui-input 值要变化才会 trigger input
      ageWrapper.find('input').element.value = 'foo'
      ageWrapper.find('input').trigger('input')
      genderWrapper.find('input').element.value = 'foo'
      genderWrapper.find('input').trigger('input')
      expect(counter).to.equal(0)
    })
    let message = await pro.then((val) => val)
    expect(counter).to.equal(1)
    expect(message).to.equal('gender validator had been fired')
    wrapper.destroy()
  })

  it('form reset should reset all the fields to initial state', async () => {
    let { wrapper } = genSimpleForm({
      data: {
        gender: 'male',
        age: '18'
      }
    })

    const { data } = wrapper.vm.propsData
    data.gender = 'female'
    data.age = '16'
    expect(data.gender).to.equal('female')
    expect(data.age).to.equal('16')
    wrapper.trigger('reset')
    expect(data.gender).to.equal('male')
    expect(data.age).to.equal('18')
    wrapper.destroy()
  })

  it('should handle `validating` state correctly', async () => {
    let finishValidation = null
    let { wrapper } = genSimpleForm(
      {
        data: {
          gender: 'male',
          age: '18'
        },
        validators: [
          {
            fields: ['age', 'gender'],
            handler: (data) => {
              return new Promise((resolve) => {
                finishValidation = resolve
              })
            }
          }
        ]
      },
      undefined,
      true
    )

    const { vm } = wrapper
    await vm.$nextTick()
    let testValidating = wrapper.find('.test-actions')
    expect(testValidating.text().trim()).to.equal('false')
    wrapper.trigger('submit')
    await vm.$nextTick()
    testValidating = wrapper.find('.test-actions')
    expect(testValidating.text().trim()).to.equal('true')

    finishValidation()
    await wait(0)
    testValidating = wrapper.find('.test-actions')
    expect(testValidating.text().trim()).to.equal('false')
    wrapper.destroy()
  })

  it('should clear validities correctly', async () => {
    let { wrapper, form } = genSimpleForm({
      validators: [
        {
          fields: ['age', 'gender'],
          handler: () => {
            return {
              age: 'error',
              gender: 'error'
            }
          }
        }
      ]
    })

    await wrapper.vm.$nextTick()
    form.validate()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.veui-field.veui-invalid').length).to.equal(2)

    form.clearValidities(['age'])
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.veui-field.veui-invalid').length).to.equal(1)

    form.clearValidities()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.veui-field.veui-invalid').length).to.equal(0)
    wrapper.destroy()
  })

  it('should clear validities correctly when the value changes', async () => {
    let { wrapper, form, gender, age } = genSimpleForm()

    await wrapper.vm.$nextTick()
    form.setValidities({
      age: 'error',
      gender: 'error'
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.veui-field.veui-invalid').length).to.equal(2)

    gender.$emit('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.veui-field.veui-invalid').length).to.equal(1)

    age.$emit('input')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.veui-field.veui-invalid').length).to.equal(0)
    wrapper.destroy()
  })
})
