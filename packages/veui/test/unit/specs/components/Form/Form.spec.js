import Input from '@/components/Input'
import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'

let slot = `
  <veui-field name="gender" field="gender"><veui-input class="gender-input"/></veui-field>
  <veui-field name="age" field="age" disabled><veui-input class="age-input"/></veui-field>
`
function genSimpleForm (propsData, defaultSlot = slot) {
  return mount(Form, {
    propsData,
    stubs: {
      'veui-field': Field,
      'veui-input': Input,
      'veui-button': Button
    },
    slots: {
      default: defaultSlot
    }
  })
}
describe('components/Form/Form', () => {
  it('should set `disabled` state correctly', () => {
    let wrapper = genSimpleForm({ disabled: true })

    let inputWrappers = wrapper.findAll('.veui-disabled')
    let rawInputs = wrapper.findAll('input')
    let isDisabled = rawInputs.wrappers.every(item => item.attributes().disabled === 'disabled')

    expect(inputWrappers.wrappers.length).to.be.equal(2)
    expect(isDisabled).to.be.equal(true)
    wrapper.destroy()
  })

  it('should set `readonly` state correctly', () => {
    let wrapper = genSimpleForm({ readonly: true })

    let inputWrappers = wrapper.findAll('.veui-readonly')
    let rawInputs = wrapper.findAll('input')
    let isReadonly = rawInputs.wrappers.every(item => item.attributes().readonly === 'readonly')

    expect(inputWrappers.wrappers.length).to.be.equal(2)
    expect(isReadonly).to.be.equal(true)
    wrapper.destroy()
  })

  it('should render default slot correctly', () => {
    let wrapper = genSimpleForm({})
    expect(wrapper.findAll('.veui-field').wrappers.length).not.to.be.equal(0)
    wrapper.destroy()
  })

  it('should set data and ui props correctly', () => {
    let wrapper = genSimpleForm({ ui: 'inline' })
    expect(wrapper.attributes().ui).to.be.equal('inline')
    wrapper.destroy()
  })

  it('should call validators and hooks in a correct order and emit submit event', () => {
    let arr = []
    let wrapper = genSimpleForm({
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
    wrapper.vm.$on('submit', () => {
      expect(arr.join('')).to.be.equal('123')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should emit invalid event if before-validate do not return true or undefined', () => {
    let message
    let wrapper = genSimpleForm({
      beforeValidate () {
        message = 'beforeValidate failed'
        return message
      },
      afterValidate () {
        message = 'afterValidate won\'t be called'
        return true
      },
      validators: [
        {
          fields: ['age', 'gender'],
          handler: data => {
            message = 'validators won\'t be called'
            return true
          }
        }
      ]
    })
    wrapper.vm.$on('invalid', () => {
      expect(message).to.be.equal('beforeValidate failed')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should emit invalid event if validate do not return true or undefined', () => {
    let message
    let wrapper = genSimpleForm({
      beforeValidate () {
        message = 'beforeValidate successed'
        return true
      },
      afterValidate () {
        message = 'afterValidate won\'t be called'
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
    wrapper.vm.$on('invalid', () => {
      expect(message).to.be.equal('validators failed')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should emit invalid event if after-validate do not return true or undefined', () => {
    let message
    let wrapper = genSimpleForm({
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
    wrapper.vm.$on('invalid', () => {
      expect(message).to.be.equal('afterValidate failed')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('should igore those fields whose disabled state is true when submit the form', () => {
    let wrapper = genSimpleForm({
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

    wrapper.vm.$on('submit', (data) => {
      expect(data).include({ gender: 'male' })
      expect(data).not.include({ age: '18' })
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('validated message should be removed if the validate passed', () => {
    let counter = 0
    let wrapper = genSimpleForm({
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
    wrapper.vm.$on('invalid', () => {
      expect(ageWrapper.vm.validity.valid).to.be.equal(false)
      expect(ageWrapper.vm.validity.message).to.be.equal('出错啦')

      wrapper.trigger('submit')
    })
    wrapper.vm.$on('submit', () => {
      expect(ageWrapper.vm.validity.valid).to.be.equal(true)
      wrapper.destroy()
    })
  })

  it('validators\'s result should have higher priority than field\'s rule property', () => {
    let slot = `
      <veui-field name="gender" rules="required" field="gender"><veui-input class="gender-input"/></veui-field>
      <veui-field name="age" rules="required" field="age" disabled><veui-input class="age-input"/></veui-field>
    `
    let wrapper = genSimpleForm({
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
    }, slot)
    let [genderWrapper, ageWrapper] = wrapper.findAll('.veui-field').wrappers
    wrapper.vm.$on('invalid', () => {
      expect(genderWrapper.vm.validity.valid).to.be.equal(false)
      expect(genderWrapper.vm.validity.message).to.be.equal('gender出错啦')
      expect(ageWrapper.vm.validity.valid).to.be.equal(false)
      expect(ageWrapper.vm.validity.message).to.be.equal('age出错啦')
      wrapper.destroy()
    })
    wrapper.trigger('submit')
  })

  it('validators should support asynchronous validating logic', () => {
    let counter = 1
    let wrapper = genSimpleForm({
      data: {
        gender: 'male',
        age: '18'
      },
      validators: [{
        fields: ['age', 'gender'],
        validate (age, gender) {
          let pro = new Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
              expect(counter).to.be.equal(1)
              counter = 2
            }, 1000)
          })
          return pro
        },
        triggers: ['submit']
      }]
    })

    wrapper.vm.$on('submit', () => {
      expect(counter).to.be.equal(2)
      wrapper.destroy()
    })

    wrapper.trigger('submit')
  })

  it('validators\'s `triggers` property should work correctly', async () => {
    let counter = 0
    let slot = `
      <veui-field name="gender" field="gender"><veui-input class="gender-input"/></veui-field>
      <veui-field name="age" field="age"><veui-input class="age-input"/></veui-field>
    `
    let pro = new Promise((resolve) => {
      let wrapper = genSimpleForm({
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
      }, slot)
      let [genderWrapper, ageWrapper] = wrapper.findAll('.veui-input').wrappers
      ageWrapper.find('input').trigger('input')
      genderWrapper.find('input').trigger('input')
      expect(counter).to.be.equal(0)
    })
    let message = await pro.then(val => val)
    expect(counter).to.be.equal(1)
    expect(message).to.be.equal('gender validator had been fired')
  })

  it('form reset should reset all the fields to initial state', async () => {
    let wrapper = genSimpleForm({
      data: {
        gender: 'male',
        age: '18'
      }
    })

    wrapper.vm.data.gender = 'female'
    wrapper.vm.data.age = '16'
    expect(wrapper.vm.data.gender).to.be.equal('female')
    expect(wrapper.vm.data.age).to.be.equal('16')
    wrapper.vm.reset()
    expect(wrapper.vm.data.gender).to.be.equal('male')
    expect(wrapper.vm.data.age).to.be.equal('18')
    wrapper.destroy()
  })
})
