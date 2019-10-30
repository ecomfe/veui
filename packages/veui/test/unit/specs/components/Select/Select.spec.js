import Select from 'veui/components/Select'
import OptionGroup from 'veui/components/OptionGroup'
import Option from 'veui/components/Option'
import { mount } from '@vue/test-utils'

const datasource = [
  {
    label: '选项1',
    value: '1',
    options: [
      {
        label: '子选项1-1',
        value: '1-1'
      },
      {
        label: '子选项1-2',
        value: '1-2'
      }
    ]
  },
  {
    label: '选项2',
    value: '2',
    options: [
      {
        label: '子选项2-1',
        value: '2-1'
      },
      {
        label: '子选项2-2',
        value: '2-2'
      },
      {
        label: '子选项2-3',
        value: '2-3'
      }
    ]
  },
  {
    label: '选项3',
    value: '3'
  }
]

const NATIVE_INPUT = '.veui-input input'
const OPTION_ITEM =
  '.veui-select-options .veui-option-group:not([hidden]) > .veui-option'
const GROUP_LABEL = '.veui-select-options .veui-option-group-label'

describe('components/Select/Select', () => {
  it('should render options correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            value: null,
            options: null
          }
        },
        template: '<veui-select :options="options"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let options = wrapper.findAll(OPTION_ITEM)
    expect(options.length).to.equal(0)

    vm.options = datasource
    await vm.$nextTick()
    options = wrapper.findAll(OPTION_ITEM)
    expect(options.length).to.equal(6)
    wrapper.destroy()
  })

  it('should render inline options correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select,
          'veui-option-group': OptionGroup,
          'veui-option': Option
        },
        data () {
          return {
            hero: null
          }
        },
        template: `
          <veui-select
            v-model="hero"
          >
            <veui-option
              value="baidu"
              label="百度"
            />
            <veui-option
              value="alibaba"
              label="阿里巴巴"
            />
            <veui-option
              value="tencent"
              label="腾讯"
            />
          </veui-select>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let options = wrapper.findAll(OPTION_ITEM)
    expect(options.length).to.equal(3)
    expect(wrapper.text()).to.equal('请选择')

    options.at(0).trigger('click')
    await vm.$nextTick()

    expect(vm.hero).to.equal('baidu')
    expect(wrapper.text()).to.equal('百度')
    wrapper.destroy()
  })

  it('should render value prop correctly for singular select', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            value: null
          }
        },
        template: `<veui-select
          v-model="value"
          :options="options"
          placeholder="Please select"
        />`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper
    let label = wrapper.find('.veui-select-label')

    expect(wrapper.text()).to.equal('Please select')

    vm.value = '3'
    await vm.$nextTick()
    expect(label.text()).to.equal('选项3')

    vm.value = null
    await vm.$nextTick()
    expect(wrapper.text()).to.equal('Please select')

    wrapper.destroy()
  })

  it('should render value prop correctly for multiple select', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            value: null
          }
        },
        template: `<veui-select
          v-model="value"
          :options="options"
          placeholder="Please select"
          multiple
        />`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    expect(wrapper.text()).to.equal('Please select')
    expect(wrapper.find('.veui-tag').exists()).to.equal(false)

    vm.value = ['3', '1-1']
    await vm.$nextTick()
    let tags = wrapper.findAll('.veui-tag')
    expect(tags.exists()).to.equal(true)
    expect(tags.length).to.equal(2)
    expect(tags.at(1).text()).to.equal('子选项1-1')
    wrapper.destroy()
  })

  it('should handle click event correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-select': Select
      },
      data () {
        return {
          options: datasource,
          searchable: false
        }
      },
      template: '<veui-select :options="options" :searchable="searchable"/>'
    })
    let { vm } = wrapper
    let overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(false)

    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await vm.$nextTick()
    overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(true)
    document.body.click()
    await vm.$nextTick()
    vm.searchable = true
    await vm.$nextTick()
    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await vm.$nextTick()
    overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(true)
    wrapper.destroy()
  })

  it('should render `disabled` and `readonly` props correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-select': Select
      },
      data () {
        return {
          options: datasource,
          disabled: true,
          readonly: false
        }
      },
      template:
        '<veui-select :options="options" :disabled="disabled" :readonly="readonly"/>'
    })
    let { vm } = wrapper
    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await vm.$nextTick()
    let overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(false)

    vm.disabled = false
    vm.readonly = true
    await vm.$nextTick()
    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should handle select correctly', async () => {
    let wrapper = mount({
      components: {
        'veui-select': Select
      },
      data () {
        return {
          value: null,
          options: datasource,
          multiple: false
        }
      },
      template: `<veui-select
        :options="options"
        v-model="value"
        :multiple="multiple"
      />`
    })
    let { vm } = wrapper
    let overlay = wrapper.find('.veui-overlay-box')
    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(true)

    let options = wrapper.findAll(OPTION_ITEM)
    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(false)
    expect(vm.value).to.equal('2-1')

    vm.multiple = true
    vm.value = []
    await vm.$nextTick()
    wrapper.find('.veui-select-trigger').trigger('mouseup')
    await vm.$nextTick()
    options.at(2).trigger('click')
    options.at(3).trigger('click')
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(true)
    expect(vm.value).to.deep.equal(['2-1', '2-2'])

    options.at(3).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal(['2-1'])
    wrapper.destroy()
  })

  it('should handle keydown event correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            value: null,
            searchable: false
          }
        },
        template:
          '<veui-select v-model="value" :options="options" :searchable="searchable"/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let input = wrapper.find(NATIVE_INPUT)
    let overlay = wrapper.find('.veui-overlay-box')
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(true)
    document.body.click()
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(false)

    vm.searchable = true
    await vm.$nextTick()
    input.trigger('click')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Esc' })
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(false)

    input.trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Up' })
    await vm.$nextTick()
    let items = wrapper.findAll(OPTION_ITEM)
    expect(items.at(0).classes('focus-visible')).to.equal(true)

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value).to.equal('1-1')
    expect(overlay.isVisible()).to.equal(false)

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(true)

    input.trigger('keydown', { key: 'Tab' })
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(false)
    wrapper.destroy()
  })

  it('should handle input event correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            value: null
          }
        },
        template: '<veui-select v-model="value" :options="options" searchable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let input = wrapper.find(NATIVE_INPUT)
    let overlay = wrapper.find('.veui-overlay-box')
    input.trigger('focus')
    input.element.value = '选项2'
    input.trigger('input')
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(true)
    let items = wrapper.findAll(OPTION_ITEM)
    expect(items.length === 3).to.equal(true)

    input.element.value = '选项2-1'
    input.trigger('input')
    await vm.$nextTick()
    items = wrapper.findAll(OPTION_ITEM)
    expect(items.length === 1).to.equal(true)

    input.element.value = 'xxsddd'
    input.trigger('input')
    await vm.$nextTick()
    items = wrapper.findAll(OPTION_ITEM)
    expect(wrapper.find('.veui-select-options-no-data').text()).to.equal(
      '无搜索结果'
    )
    wrapper.destroy()
  })

  it('should clear value correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            value: '3',
            clearable: false,
            searchable: true,
            multiple: false
          }
        },
        template: `<veui-select
          v-model="value"
          :options="options"
          :searchable="searchable"
          :clearable="clearable"
          :multiple="multiple"
        />`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    expect(wrapper.text()).to.equal('选项3')

    expect(wrapper.find('.veui-select-clear').exists()).to.equal(false)

    await vm.$nextTick()

    vm.clearable = true
    vm.searchable = false
    vm.value = '1'
    await vm.$nextTick()
    let clear = wrapper.find('.veui-select-clear')
    expect(clear.exists()).to.equal(true)

    clear.trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(null)

    vm.multiple = true
    vm.value = ['2-1', '1-1']
    await vm.$nextTick()
    clear.trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])
    wrapper.destroy()
  })

  it('should render label slot correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            value: null,
            options: datasource
          }
        },
        template: `
          <veui-select :options="options">
            <template v-slot:option-label="{ label }">{{ label }} - 🤘</template>
            <template v-slot:group-label="{ label }">{{ label }} - 🤞</template>
          </veui-select>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let { vm } = wrapper

    await vm.$nextTick()
    let options = wrapper.findAll(OPTION_ITEM)
    expect(options.at(0).text()).to.equal('子选项1-1 - 🤘')

    let groups = wrapper.findAll(GROUP_LABEL)
    expect(groups.at(0).text()).to.equal('选项1 - 🤞')
    wrapper.destroy()
  })
})
