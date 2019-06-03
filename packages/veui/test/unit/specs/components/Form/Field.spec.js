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

function genWrapper (template, rules, propsData = {}) {
  return mount(Form, {
    name: 'test-field',
    stubs: {
      'veui-field': Field,
      'veui-input': Input
    },
    propsData,
    mocks: {
      rules: rules || 'required'
    },
    slots: {
      default: template
    },
    sync: false,
    attachToDocument: true
  })
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
    let wrapper = genWrapper(template)
    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-readonly')
    expect(inputWrapper.find('.veui-input-input').attributes().readonly).to.be.equal('readonly')
    wrapper.destroy()
  })

  it('should set `disabled` state correctly', () => {
    let template = genTemplate('disabled')
    let wrapper = genWrapper(template)

    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-disabled')
    expect(inputWrapper.find('.veui-input-input').attributes().disabled).to.be.equal('disabled')
    wrapper.destroy()
  })

  it('should set other props correctly', () => {
    let template = genTemplate('disabled')
    let wrapper = genWrapper(template)
    let fieldWrapper = wrapper.find('.veui-field')
    // should set label & tip correctly
    expect(wrapper.find('.veui-label').text()).to.be.equal('测试label')
    expect(wrapper.find('.veui-form-tip').text()).to.be.equal('测试tip')
    // should set ui correctly
    expect(fieldWrapper.attributes().ui).to.be.equal('large')
    // should set name and field correctly
    expect(fieldWrapper.vm.field).to.be.equal('test')
    expect(fieldWrapper.vm.name).to.be.equal('test')
    wrapper.destroy()
  })

  it('should render slots correctly', () => {
    let template = genTemplate('', slot)
    let wrapper = genWrapper(template)
    // label & tip
    expect(wrapper.find('.test-slot-label').text()).to.be.equal('通过slot设置label')
    expect(wrapper.find('.test-slot-tip').text()).to.be.equal('通过slot设置tip')
    // default slot
    expect(wrapper.find('.veui-input').exists()).to.be.equal(true)
    wrapper.destroy()
  })

  it('should handle rules correctly', () => {
    let template = genTemplate()
    let wrapper = genWrapper(template)
    let fieldWrapper = wrapper.find('.veui-field-required')

    expect(fieldWrapper.exists()).to.be.equal(true)
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
    let wrapper = genWrapper(template, rules, {
      data: {
        test: '12345'
      }
    })
    let fieldWrapper = wrapper.find('.veui-field')
    let inputWrapper = wrapper.find('.veui-input-input')

    wrapper.vm.$on('invalid', () => {
      let { message, valid } = fieldWrapper.vm.validity
      expect(valid).to.be.equal(false)
      expect(message).to.be.equal('custom validator failed')

      inputWrapper.setValue('123')
      wrapper.vm.$nextTick()
      expect(inputWrapper.find('input').element.value).to.be.equal('123')

      wrapper.setProps({ data: { test: '123' } })
      wrapper.trigger('submit')
    })
    wrapper.vm.$on('submit', () => {
      let { valid } = fieldWrapper.vm.validity
      expect(valid).to.be.equal(true)
      wrapper.destroy()
    })
    inputWrapper.setValue('123456')
    wrapper.vm.$nextTick()
    expect(inputWrapper.find('input').element.value).to.be.equal('123456')

    wrapper.setProps({ data: { test: '123456' } })
    wrapper.trigger('submit')
  })
})
