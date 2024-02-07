import Input from '@/components/Input'
import { mount } from '@vue/test-utils'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'
import ruleManager from '@/managers/rule'
import { expectFieldError, expectTokenList, wait } from '../../../../utils'

const MSG = 'custom validator failed'
ruleManager.addRule('equal', {
  validate (value, ruleValue) {
    return value === ruleValue
  },
  message: MSG,
  priority: 100
})

function genTemplate (state = '', slots = '') {
  return `
    <veui-field field="test" name="test" label="测试label" tip="测试tip" ${state} :rules="rules">
      <veui-input class="test-field" v-model="formData.test"/>
      ${slots}
    </veui-field>
  `
}

function genWrapper (template, rules = 'required', propsData = { test: '' }) {
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

let slot = `
  <template slot="label">
    <div class="test-slot-label">通过slot设置label</div>
  </template>
  <template slot="tip">
    <div class="test-slot-tip">通过slot设置tip</div>
  </template>
`

describe('components/Form/Field', function () {
  this.timeout(10000)

  it('should set `readonly` state correctly', () => {
    let template = genTemplate('readonly')
    let { wrapper } = genWrapper(template)
    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-readonly')
    expect(inputWrapper.find('.veui-input-input').element.readOnly).to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should set `disabled` state correctly', () => {
    let template = genTemplate('disabled')
    let { wrapper } = genWrapper(template)

    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-disabled')
    expect(inputWrapper.find('.veui-input-input').element.disabled).to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should respect `name` from input props', () => {
    let wrapper = mount({
      components: {
        'veui-form': Form,
        'veui-field': Field,
        'veui-input': Input
      },
      template: `
        <veui-form>
          <veui-field field="foo" name="foo">
            <veui-input/>
            <veui-input name="bar"/>
          </veui-field>
        </veui-form>`
    })

    let inputs = wrapper.findAll('input')
    expect(inputs.at(0).attributes().name).to.equal('foo')
    expect(inputs.at(1).attributes().name).to.equal('bar')

    wrapper.destroy()
  })

  it('should set other props correctly', async () => {
    let template = genTemplate('disabled')
    let { wrapper } = genWrapper(template)
    let fieldWrapper = wrapper.find('.veui-field')
    // should set label & tip correctly
    expect(wrapper.find('.veui-label').text()).to.equal('测试label')
    await wrapper.vm.$nextTick()
    wrapper.find('.veui-field-tip .veui-icon').trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.veui-tooltip').text()).to.equal('测试tip')
    // should set ui correctly
    expectTokenList(fieldWrapper.attributes().ui).has('m')
    // should set name and field correctly
    expect(fieldWrapper.vm.field).to.equal('test')
    expect(fieldWrapper.vm.name).to.equal('test')
    wrapper.destroy()
  })

  it('should render slots correctly', async () => {
    let template = genTemplate('', slot)
    let { wrapper } = genWrapper(template)
    // label & tip
    expect(wrapper.find('.test-slot-label').text()).to.equal(
      '通过slot设置label'
    )
    await wrapper.vm.$nextTick()
    wrapper.find('.veui-field-tip .veui-icon').trigger('mouseenter')
    await wrapper.vm.$nextTick()
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
        name: 'equal',
        value: '123',
        triggers: 'input'
      }
    ]
    let formData = { test: '12345' }
    let { wrapper, form } = genWrapper(template, rules, formData)
    let fieldWrapper = wrapper.find('.veui-field')
    let inputWrapper = wrapper.find('.veui-input-input')
    form.$on('invalid', () => {
      expectFieldError(fieldWrapper, MSG)

      inputWrapper.setValue('123')
      formData.test = '123'
      wrapper.find('form').trigger('submit')
    })
    form.$on('submit', () => {
      expectFieldError(fieldWrapper, false)
      wrapper.destroy()
    })
    inputWrapper.setValue('123456')
    wrapper.vm.$nextTick()
    expect(inputWrapper.find('input').element.value).to.equal('123456')
    formData.test = '123456'

    form.submit()
  })

  it('should filter validity messages correctly', async () => {
    let template = genTemplate()
    let rules = [
      {
        name: 'required',
        message: MSG
      },
      {
        name: 'equal',
        value: '123',
        message: MSG
      }
    ]
    let { wrapper, form } = genWrapper(template, rules)
    await wrapper.vm.$nextTick()
    form.submit()
    await wait(0)
    let error = wrapper.findAll('.veui-message')
    expect(error.length).to.equal(1)
    wrapper.destroy()
  })

  it('should support inline validate correctly', async () => {
    let template = genTemplate()
    let rules = [
      {
        name: 'prefix',
        value: '123',
        validate (value, ruleValue) {
          return ruleValue.indexOf(value || '') === 0
        },
        triggers: 'input',
        message: 'prefix'
      },
      {
        name: 'same',
        value: '123',
        validate (value, ruleValue) {
          return !value || ruleValue === value
        },
        triggers: 'input',
        message: 'same'
      }
    ]
    let { wrapper } = genWrapper(template, rules)
    await wrapper.vm.$nextTick()
    let input = wrapper.find('.veui-input-input')
    input.element.value = '2'
    input.trigger('input')
    await wait(0)
    let error = wrapper.findAll('.veui-message')
    expect(error.length).to.equal(2)
    wrapper.destroy()
  })
})
