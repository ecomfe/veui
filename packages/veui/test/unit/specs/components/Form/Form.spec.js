import Input from '@/components/Input'
import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'
import { wait } from '../../../../utils'

let slot = `
  <veui-field name="gender" field="gender"><veui-input class="gender-input"/></veui-field>
  <veui-field name="age" field="age" disabled><veui-input class="age-input"/></veui-field>
`
function genSimpleForm (propsData = {}, defaultSlot = slot) {
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
      template: `<veui-form ref="form" v-bind="propsData">${defaultSlot}</veui-form>`
    },
    {
      sync: false,
      attachToDocument: true
    }
  )
  let { form } = wrapper.vm.$refs
  return { form, wrapper }
}
describe('components/Form/Form', () => {
  it('should set `disabled` state correctly', () => {
    let { wrapper } = genSimpleForm({ disabled: true })
    let isDisabled = wrapper
      .findAll('input')
      .wrappers.every(item => item.element.disabled)

    expect(isDisabled).to.equal(true)
    expect(wrapper.findAll('.veui-disabled').wrappers.length).to.equal(2)
    wrapper.destroy()
  })

  it('should set `readonly` state correctly', () => {
    let { wrapper } = genSimpleForm({ readonly: true })
    let isReadonly = wrapper
      .findAll('input')
      .wrappers.every(item => item.element.readOnly)

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
          handler: data => {
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
          handler: data => {
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
          handler: data => {
            message = 'validators failed'
            return false
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
          handler: data => {
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

    form.$on('submit', data => {
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
      expect(ageWrapper.vm.validity.valid).to.equal(false)
      expect(ageWrapper.vm.validity.message).to.equal('出错啦')

      wrapper.trigger('submit')
    })
    form.$on('submit', () => {
      expect(ageWrapper.vm.validity.valid).to.equal(true)
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
      expect(genderWrapper.vm.validity.valid).to.equal(false)
      expect(genderWrapper.vm.validity.message).to.equal('gender出错啦')
      expect(ageWrapper.vm.validity.valid).to.equal(false)
      expect(ageWrapper.vm.validity.message).to.equal('age出错啦')
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
    let pro = new Promise(resolve => {
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
      ageWrapper.find('input').trigger('input')
      genderWrapper.find('input').trigger('input')
      expect(counter).to.equal(0)
    })
    let message = await pro.then(val => val)
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
})
