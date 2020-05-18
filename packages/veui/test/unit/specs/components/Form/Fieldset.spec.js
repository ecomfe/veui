import Input from '@/components/Input'
import { mount } from '@vue/test-utils'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'
import Fieldset from '@/components/Form/Fieldset'

function genTemplate (state = '', slots = '') {
  return `
    <veui-form>
      <veui-fieldset label="测试label" tip="测试tip" ui="tiny" name="test" required >
        <veui-field field="test" ${state}>
          <veui-input class="test-field"/>
        </veui-field>
        ${slots}
      </veui-fieldset>
    </veui-form>
  `
}

function genWrapper (template) {
  return mount(
    {
      name: 'test-field',
      components: {
        'veui-field': Field,
        'veui-input': Input,
        'veui-form': Form,
        'veui-fieldset': Fieldset
      },
      template
    },
    {
      sync: false,
      attachToDocument: true
    }
  )
}

let slot = `
  <template slot="label">
    <div class="test-slot-label">通过slot设置label</div>
  </template>
  <template slot="tip">
    <div class="test-slot-tip">通过slot设置tip</div>
  </template>
`

describe('components/Form/Fieldset', () => {
  it('should set `readonly` state correctly', () => {
    let template = genTemplate('readonly')
    let wrapper = genWrapper(template)
    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-readonly')
    expect(inputWrapper.find('.veui-input-input').element.readOnly).to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should set `disabled` state correctly', () => {
    let template = genTemplate('disabled')
    let wrapper = genWrapper(template)

    let inputWrapper = wrapper.find('.test-field')
    expect(inputWrapper.attributes().class).to.include('veui-disabled')
    expect(inputWrapper.find('.veui-input-input').element.disabled).to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should handle `required` prop correctly', () => {
    let template = genTemplate()
    let wrapper = genWrapper(template)
    let fieldsetWrapper = wrapper.find('.veui-fieldset-required')
    expect(fieldsetWrapper.exists()).to.equal(true)
    wrapper.destroy()
  })

  it('should set other props correctly', () => {
    let template = genTemplate('disabled')
    let wrapper = genWrapper(template)
    let fieldsetWrapper = wrapper.find('.veui-fieldset')
    // should set label & tip correctly
    expect(fieldsetWrapper.find('.veui-form-label').text()).to.equal(
      '测试label'
    )
    expect(fieldsetWrapper.find('.veui-tooltip').text()).to.equal('测试tip')
    // should set ui correctly
    expect(fieldsetWrapper.attributes().ui).to.equal('tiny')
    // should set name correctly
    expect(fieldsetWrapper.vm.name).to.equal('test')
    wrapper.destroy()
  })

  it('should render slots correctly', () => {
    let template = genTemplate('', slot)
    let wrapper = genWrapper(template)
    // label & tip
    expect(wrapper.find('.test-slot-label').text()).to.equal(
      '通过slot设置label'
    )
    expect(wrapper.find('.test-slot-tip').text()).to.equal('通过slot设置tip')
    // default slot
    expect(wrapper.find('.veui-input').exists()).to.equal(true)
    wrapper.destroy()
  })
})
