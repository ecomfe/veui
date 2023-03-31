import { mount } from '@vue/test-utils'
import Autocomplete from '@/components/Autocomplete/Autocomplete'
import Form from '@/components/Form/Form'
import Field from '@/components/Form/Field'
import { expectFieldError } from '../../../utils'

const INPUT = '.veui-input'
const NATIVE_INPUT = '.veui-input input'
const INPUT_PLACEHOLDER = '.veui-input .veui-input-placeholder'
const SUGGESTIONS = '.veui-autocomplete-suggestions'
const SUGGESTION_ITEM = '.veui-autocomplete-suggestions .veui-option'
const FOUR = '👩‍👩‍👧‍👧'
const TWO = '👩‍👩‍👧‍👧'.slice(0, 5)

let componentOptions = {
  components: {
    'veui-autocomplete': Autocomplete
  },
  data () {
    return {
      value: null,
      datasource: [
        {
          value: 'male'
        },
        {
          value: 'female'
        }
      ],
      stringDatasource: ['male', 'female'],
      groupedDatasource: [
        {
          label: '组1',
          options: ['1', '11']
        },
        {
          label: '组2',
          options: [
            {
              label: '2',
              options: [
                {
                  label: '22',
                  value: '22'
                }
              ]
            }
          ]
        },
        {
          label: TWO,
          value: TWO
        },
        {
          label: FOUR, // 放在最后
          value: FOUR
        }
      ],
      readonly: false,
      disabled: false,
      filter: null,
      match: null,
      strict: true
    }
  }
}

const debugInBrowser = {
  attachToDocument: true,
  sync: false
}

describe('components/Autocomplete', function () {
  this.timeout(10000)

  it('should render datasource correctly & open dropdown on focus', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template:
          '<veui-autocomplete suggest-trigger="focus" :datasource="stringDatasource"/>'
      },
      debugInBrowser
    )

    let { vm } = wrapper
    wrapper.find(NATIVE_INPUT).trigger('focus')
    await vm.$nextTick()
    let options = wrapper.findAll(SUGGESTION_ITEM)
    expect(options.isVisible()).to.equal(true)
    expect(options.at(0).text() === 'male').to.equal(true)
    expect(options.at(1).text() === 'female').to.equal(true)
    wrapper.destroy()
  })

  it('should only open dropdown on correct suggest-trigger', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template:
          '<veui-autocomplete suggest-trigger="input" :datasource="datasource"/>'
      },
      debugInBrowser
    )

    let { vm } = wrapper
    wrapper.find(INPUT).trigger('focus')
    await vm.$nextTick()
    expect(wrapper.find(SUGGESTIONS).isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should handle select correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template:
          '<veui-autocomplete v-model="value" suggest-trigger="focus" :datasource="groupedDatasource"/>'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    wrapper.find(NATIVE_INPUT).trigger('focus')
    await vm.$nextTick()
    let options = wrapper.findAll(SUGGESTION_ITEM)
    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.value === '22').to.equal(true)
    wrapper.destroy()
  })

  it('should handle input event & strict prop correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template:
          '<veui-autocomplete v-model="value" :strict="strict" :maxlength="7" suggest-trigger="focus" :datasource="groupedDatasource"/>'
      },
      debugInBrowser
    )
    let { vm } = wrapper

    await input('2')
    let options = wrapper.findAll(SUGGESTION_ITEM)
    expect(options.length).to.equal(1)
    document.body.click()
    await vm.$nextTick()
    expect(vm.value).to.equal('2')

    await input(TWO)
    options = wrapper.findAll(SUGGESTION_ITEM)
    expect(options.length).to.equal(1)
    options.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(TWO)

    await input('')
    options = wrapper.findAll(SUGGESTION_ITEM)
    options.at(options.length - 1).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(FOUR.slice(0, 6))

    wrapper.find(NATIVE_INPUT).trigger('blur')
    await vm.$nextTick()

    expect(vm.value === '')

    await input('Just a random input...', true)
    expect(vm.value).to.equal('')

    vm.strict = { select: true }

    await input('Just a random input...', true)
    expect(vm.value).to.equal('')

    vm.strict = { maxlength: false }

    await input('')
    options = wrapper.findAll(SUGGESTION_ITEM)
    options.at(options.length - 1).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(FOUR)

    vm.strict = { maxlength: true }

    await input('')
    options = wrapper.findAll(SUGGESTION_ITEM)
    options.at(options.length - 1).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(FOUR.slice(0, 6))

    wrapper.destroy()

    async function input (val, change = false) {
      let nativeInput = wrapper.find(NATIVE_INPUT)
      nativeInput.trigger('focus')
      nativeInput.element.value = val
      nativeInput.trigger('input')
      await vm.$nextTick()
      if (change) {
        nativeInput.trigger('change')
      }
      await vm.$nextTick()
    }
  })

  it('should render placeholder correctly', () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-autocomplete placeholder="placeholder"/>'
      },
      debugInBrowser
    )
    expect(wrapper.find(INPUT_PLACEHOLDER).text() === 'placeholder').to.equal(
      true
    )
    wrapper.destroy()
  })

  it('should handle focus correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: '<veui-autocomplete ref="autocomplete" />'
      },
      debugInBrowser
    )
    let { vm } = wrapper
    vm.$refs.autocomplete.focus()
    await vm.$nextTick()
    expect(
      wrapper.find(NATIVE_INPUT).element === document.activeElement
    ).to.equal(true)
    wrapper.destroy()
  })

  it('should handle keydown correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template:
          '<veui-autocomplete v-model="value" suggest-trigger="focus" :datasource="datasource"/>'
      },
      debugInBrowser
    )

    let { vm } = wrapper
    let input = wrapper.find(NATIVE_INPUT)
    input.trigger('focus')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Down' })
    input.trigger('keydown', { key: 'Up' })
    input.trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    let options = wrapper.findAll(SUGGESTION_ITEM)
    expect(options.at(0).attributes('data-focus-visible-added')).to.equal('')

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value === 'male').to.equal(true)

    input.trigger('focus')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Left' })
    input.trigger('keydown', { key: 'Esc' })
    await vm.$nextTick()
    expect(wrapper.find(SUGGESTIONS).isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should render correctly on `disabled` or `readonly` state', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-autocomplete
          overlay-class="test-autocomplete-overlay-class"
          :suggest-trigger="['focus', 'input']"
          :datasource="datasource"
          :readonly="readonly"
          :disabled="disabled"
        />`
      },
      debugInBrowser
    )

    let { vm } = wrapper
    let input = wrapper.find(NATIVE_INPUT)
    let suggestions = wrapper.find(SUGGESTIONS)
    input.element.value = 'male'

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(true)

    input.trigger('input')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(true)

    document.body.click()
    await vm.$nextTick()

    vm.disabled = true
    await vm.$nextTick()

    input.trigger('input')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(false)

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(false)

    vm.disabled = false
    vm.readonly = true
    await vm.$nextTick()

    input.trigger('input')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(false)

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(false)

    wrapper.destroy()
  })

  it('should render `option-label` slot correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-autocomplete placeholder="placeholder" :datasource="datasource" suggest-trigger="focus">
          <template slot="option-label" slot-scope="option">
            {{ option.value }}-{{ option.value }}
          </template>
        </veui-autocomplete>`
      },
      debugInBrowser
    )
    let { vm } = wrapper
    let input = wrapper.find(NATIVE_INPUT)
    input.trigger('focus')
    await vm.$nextTick()

    let { value } = vm.datasource[0]
    expect(
      wrapper.find('.veui-option-label').text() === `${value}-${value}`
    ).to.equal(true)
    input.element.value = 'fe'
    input.trigger('input')
    await vm.$nextTick()
    let value2 = vm.datasource[1].value
    expect(
      wrapper.find('.veui-option-label').text() === `${value2}-${value2}`
    ).to.equal(true)
    wrapper.destroy()
  })

  it('should handle `match`/`filter` props correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-autocomplete value="f" :datasource="datasource" expanded :match="match" :filter="filter"/>`
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()

    let items = wrapper.findAll('.veui-option')
    expect(items.length).to.equal(1)
    expect(items.at(0).text()).to.equal('female')
    expect(wrapper.find('mark').exists(), '高亮1').to.equal(true)

    // 全中无高亮
    vm.match = () => true
    await vm.$nextTick()
    items = wrapper.findAll('.veui-option')
    expect(items.length).to.equal(2)
    expect(wrapper.find('mark').exists(), '全中无高亮').to.equal(false)

    // 全中有高亮
    vm.match = null
    vm.filter = () => true
    await vm.$nextTick()
    items = wrapper.findAll('.veui-option')
    expect(items.length).to.equal(2)
    expect(wrapper.find('mark').exists(), '全中有高亮').to.equal(true)
    wrapper.destroy()
  })

  it('should handle `match` prop that returns an array of numbers correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-autocomplete value="f" :datasource="datasource" expanded :match="match"/>`
      },
      debugInBrowser
    )
    let { vm } = wrapper
    await vm.$nextTick()

    // 有高亮
    vm.match = ({ label }, keyword) => {
      const index = label.indexOf(keyword)
      return index >= 0 ? [index, index + keyword.length] : false
    }

    await vm.$nextTick()
    let items = wrapper.findAll('.veui-option')
    expect(items.length).to.equal(1)
    expect(wrapper.find('mark').exists(), 'Only one segment').to.equal(true)
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
          'veui-autocomplete': Autocomplete,
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
          <veui-field name="gender" :rules="rules" field="gender"><veui-autocomplete class="gender-input" v-model="data.gender"/></veui-field>
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

    await blurWithValue('1')
    expectFieldError(wrapper, false)

    await changeTrigger('input')

    await inputWithValue(null)
    expectFieldError(wrapper, valiErr)

    await inputWithValue('1')
    expectFieldError(wrapper, false)

    vm.validators = null
    await inputWithValue(null)
    expectFieldError(wrapper, ruleErr)

    await inputWithValue('1')
    expectFieldError(wrapper, false)

    wrapper.destroy()

    async function blurWithValue (val) {
      vm.data.gender = val
      await vm.$nextTick()
      let input = wrapper.find('.veui-input input')
      input.trigger('blur')
      await vm.$nextTick()
    }

    async function inputWithValue (val) {
      await vm.$nextTick()
      let input = wrapper.find('.veui-input input')
      input.element.value = val
      input.trigger('input')
      await vm.$nextTick()
    }

    async function changeTrigger (triggers) {
      vm.rules = [{ ...vm.rules[0], triggers }]
      vm.validators = [{ ...validators[0], triggers }]
      await vm.$nextTick()
    }
  })
})
