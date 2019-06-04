import Input from '@/components/Input'
import { mount } from '@vue/test-utils'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'
import ruleManager from '@/managers/rule'

ruleManager.addRule('custom-validator', {
  validate (value, ruleValue) {
    return value === ruleValue
  },
  message: 'custom validator failed',
  priority: 100
})

function genTemplate (state = '', slots = '') {
  return `
    <veui-field ui="large" field="test" name="test" label="测试label" tip="测试tip" ${state} :rules="rules">
      <veui-input class="test-field"/>
      ${slots}
    </veui-field>
  `
}

function genWrapper (template, rules = 'required', propsData = {}) {
  let wrapper = mount(
    {
      components: {
        'veui-field': Field,
        'veui-input': Input,
        'veui-form': Form
      },
      data () {
        return {
          formData: propsData,
          rules
        }
      },
      template: `<veui-form ref="form" :data="formData">${template}</veui-form>`
    },
    {
      sync: false,
      attachToDocument: true
    }
  )
  let { form } = wrapper.vm.$refs
  return { form, wrapper }
}

let slot =
`
  <template slot="label">
    <div class="test-slot-label">通过slot设置label</div>
  </template>
  <template slot="tip">
    <div class="test-slot-tip">通过slot设置tip</div>
  </template>
`

describe('components/Form/Field', () => {
  it('should set `readonly` state correctly', () => {
    let template = genTemplate('readonly')
    let { wrapper } = genWrapper(template)
    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-readonly')
    expect(inputWrapper.find('.veui-input-input').element.readOnly).to.equal(true)
    wrapper.destroy()
  })

  it('should set `disabled` state correctly', () => {
    let template = genTemplate('disabled')
    let { wrapper } = genWrapper(template)

    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-disabled')
    expect(inputWrapper.find('.veui-input-input').element.disabled).to.equal(true)
    wrapper.destroy()
  })

  it('should set other props correctly', () => {
    let template = genTemplate('disabled')
    let { wrapper } = genWrapper(template)
    let fieldWrapper = wrapper.find('.veui-field')
    // should set label & tip correctly
    expect(wrapper.find('.veui-label').text()).to.equal('测试label')
    expect(wrapper.find('.veui-form-tip').text()).to.equal('测试tip')
    // should set ui correctly
    expect(fieldWrapper.attributes().ui).to.equal('large')
    // should set name and field correctly
    expect(fieldWrapper.vm.field).to.equal('test')
    expect(fieldWrapper.vm.name).to.equal('test')
    wrapper.destroy()
  })

  it('should render slots correctly', () => {
    let template = genTemplate('', slot)
    let { wrapper } = genWrapper(template)
    // label & tip
    expect(wrapper.find('.test-slot-label').text()).to.equal('通过slot设置label')
    expect(wrapper.find('.test-slot-tip').text()).to.equal('通过slot设置tip')
    // default slot
    expect(wrapper.find('.veui-input').exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should handle rules correctly', () => {
    let template = genTemplate()
    let { wrapper } = genWrapper(template)
    let fieldWrapper = wrapper.find('.veui-field-required')

    expect(fieldWrapper.exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should handle custom validators correctly', () => {
    let template = genTemplate()
    let rules = [
      {
        name: 'custom-validator',
        value: '123',
        triggers: 'input'
      }
    ]
    let formData = { test: '12345' }
    let { wrapper, form } = genWrapper(template, rules, formData)
    let fieldWrapper = wrapper.find('.veui-field')
    let inputWrapper = wrapper.find('.veui-input-input')
    form.$on('invalid', () => {
      let { message, valid } = fieldWrapper.vm.validity
      expect(valid).to.equal(false)
      expect(message).to.equal('custom validator failed')

      inputWrapper.setValue('123')
      wrapper.vm.$nextTick()
      expect(inputWrapper.find('input').element.value).to.equal('123')

      formData.test = '123'
      wrapper.trigger('submit')
    })
    form.$on('submit', () => {
      expect(fieldWrapper.vm.validity.valid).to.equal(true)
      wrapper.destroy()
    })
    inputWrapper.setValue('123456')
    wrapper.vm.$nextTick()
    expect(inputWrapper.find('input').element.value).to.equal('123456')
    formData.test = '123456'

    wrapper.trigger('submit')
  })
})
