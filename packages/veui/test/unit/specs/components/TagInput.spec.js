import { mount } from '@vue/test-utils'
import TagInput from '@/components/TagInput'

const INPUT = '.veui-input input'
const NATIVE_INPUT = '.veui-input input'
const TAG = '.veui-tag'
const SUGGESTIONS = '.veui-autocomplete-suggestions'
const SUGGESTION_ITEM = '.veui-autocomplete-suggestions .veui-option'

let datasource = [
  {
    value: '勇士'
  },
  {
    value: '马刺'
  },
  {
    value: '火箭'
  }
]
let components = {
  'veui-tag-input': TagInput
}

describe('components/TagInput', () => {
  it('should render `suggest-trigger` and `datasource` prop correctly', async () => {
    let wrapper = mount(
      {
        components,
        data () {
          return {
            datasource
          }
        },
        template:
          '<veui-tag-input suggest-trigger="focus" :datasource="datasource"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    wrapper.find(INPUT).trigger('focus')
    await vm.$nextTick()

    expect(wrapper.find(SUGGESTIONS).isVisible()).to.equal(true)
    let options = wrapper.findAll(SUGGESTION_ITEM)
    expect(options.at(0).text()).to.equal('勇士')
    expect(options.at(1).text()).to.equal('马刺')
    expect(options.at(2).text()).to.equal('火箭')
    wrapper.destroy()
  })

  it('should render `value` prop correctly', async () => {
    let wrapper = mount(
      {
        components,
        data () {
          return {
            datasource,
            value: null
          }
        },
        template: '<veui-tag-input v-model="value" :datasource="datasource"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let tags = wrapper.findAll(TAG)
    expect(tags.length).to.equal(0)

    vm.value = ['马刺', '勇士']
    await vm.$nextTick()

    tags = wrapper.findAll(TAG)
    expect(tags.length).to.equal(2)
    expect(tags.at(0).text()).to.equal('马刺')
    expect(tags.at(1).text()).to.equal('勇士')
    wrapper.destroy()
  })

  it('should render select suggestion correctly', async () => {
    let wrapper = mount(
      {
        components,
        data () {
          return {
            datasource,
            value: null
          }
        },
        template:
          '<veui-tag-input v-model="value" suggest-trigger="focus" :datasource="datasource"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find(INPUT)
    let nativeInput = wrapper.find(NATIVE_INPUT)
    let options = wrapper.findAll(SUGGESTION_ITEM)

    input.trigger('focus')
    await vm.$nextTick()
    options.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['勇士'])
    expect(nativeInput.element.value).to.equal('')

    input.trigger('focus')
    await vm.$nextTick()
    options.at(1).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['勇士', '马刺'])
    expect(nativeInput.element.value).to.equal('')

    input.trigger('focus')
    await vm.$nextTick()
    options.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['勇士', '马刺'])
    expect(nativeInput.element.value).to.equal('')

    wrapper.destroy()
  })

  it('should handle `strict` prop correctly', async () => {
    let wrapper = mount(
      {
        components,
        data () {
          return {
            datasource,
            value: [],
            strict: false
          }
        },
        template:
          '<veui-tag-input v-model="value" :datasource="datasource" :strict="strict"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find(NATIVE_INPUT)

    input.element.value = '火箭'
    input.trigger('input')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['火箭'])
    expect(input.element.value).to.equal('')

    input.element.value = '胡乱输入'
    input.trigger('input')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['火箭', '胡乱输入'])
    expect(input.element.value).to.equal('')

    vm.strict = true
    await vm.$nextTick()

    input.element.value = '各种乱入'
    input.trigger('input')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['火箭', '胡乱输入'])
    expect(input.element.value).to.equal('各种乱入')

    document.body.click()
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['火箭', '胡乱输入'])
    expect(input.element.value).to.equal('')

    wrapper.destroy()
  })

  it('should close tag correctly', async () => {
    let wrapper = mount(
      {
        components,
        data () {
          return {
            datasource,
            value: ['勇士', '火箭']
          }
        },
        template: '<veui-tag-input v-model="value" :datasource="datasource"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let tags = wrapper.findAll(TAG)

    tags
      .at(0)
      .find('.veui-button')
      .trigger('click')
    await vm.$nextTick()

    tags = wrapper.findAll(TAG)
    expect(tags.length).to.equal(1)
    expect(tags.at(0).text()).to.equal('火箭')
    expect(vm.value).to.deep.equal(['火箭'])
    wrapper.destroy()
  })

  it('should render correctly on `disabled` or `readonly` state', async () => {
    let wrapper = mount(
      {
        components,
        data () {
          return {
            datasource,
            value: ['火箭'],
            readonly: false,
            disabled: false
          }
        },
        template: `<veui-tag-input
          v-model="value"
          suggest-trigger="focus"
          :datasource="datasource"
          :readonly="readonly"
          :disabled="disabled"
        />`
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let input = wrapper.find(INPUT)
    let suggestions = wrapper.find(SUGGESTIONS)
    let tags = wrapper.findAll(TAG)

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(true)
    expect(
      tags
        .at(0)
        .find('.veui-button')
        .exists()
    ).to.equal(true)

    document.body.click()
    await vm.$nextTick()
    vm.disabled = true
    await vm.$nextTick()

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(false)
    expect(
      tags
        .at(0)
        .find('.veui-button')
        .exists()
    ).to.equal(false)

    document.body.click()
    await vm.$nextTick()
    vm.disabled = false
    vm.readonly = true
    await vm.$nextTick()

    input.trigger('focus')
    await vm.$nextTick()
    expect(suggestions.isVisible()).to.equal(false)
    expect(
      tags
        .at(0)
        .find('.veui-button')
        .exists()
    ).to.equal(false)

    wrapper.destroy()
  })
})
