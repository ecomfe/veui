import Select from 'veui/components/Select'
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
const OPTION_ITEM = '.veui-select-options .veui-option'
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
        sync: false
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
  it('should render value prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            placeholder: 'please select',
            value: null,
            multiple: false
          }
        },
        template: `<veui-select
          v-model="value"
          :options="options"
          :placeholder="placeholder"
          :multiple="multiple"
        />`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let { vm } = wrapper
    let label = wrapper.find('.veui-select-label')
    expect(label.text()).to.equal('please select')

    vm.value = '3'
    await vm.$nextTick()
    expect(label.text()).to.equal('选项3')

    vm.value = null
    vm.multiple = true
    await vm.$nextTick()
    expect(label.text()).to.equal('please select')
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

    wrapper.find('.veui-input-main').trigger('click')
    await vm.$nextTick()
    overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(true)

    document.body.click()
    await vm.$nextTick()
    vm.searchable = true
    await vm.$nextTick()
    wrapper.find('.veui-input-main').trigger('click')
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
    wrapper.find('.veui-select-input').trigger('click')
    await vm.$nextTick()
    let overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(false)

    vm.disabled = false
    vm.readonly = true
    await vm.$nextTick()
    wrapper.find('.veui-select-input').trigger('click')
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
    wrapper.find('.veui-input-main').trigger('click')
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
    wrapper.find('.veui-input-main').trigger('click')
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
    input.trigger('keydown', { key: 'Down' })
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
    items = wrapper.findAll(OPTION_ITEM)
    expect(items.at(0).isVisible()).to.equal(true)
    expect(items.at(1).isVisible()).to.equal(false)
    expect(items.at(2).isVisible()).to.equal(false)

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
    expect(items.at(1).isVisible()).to.equal(false)
    expect(items.at(0).isVisible()).to.equal(false)
    expect(items.at(2).isVisible()).to.equal(true)
    expect(items.at(3).isVisible()).to.equal(true)
    expect(items.at(4).isVisible()).to.equal(true)

    input.element.value = '选项2-1'
    input.trigger('input')
    await vm.$nextTick()
    expect(items.at(3).isVisible()).to.equal(false)
    expect(items.at(4).isVisible()).to.equal(false)

    input.element.value = 'xxsddd'
    input.trigger('input')
    await vm.$nextTick()
    items = wrapper.findAll(OPTION_ITEM)
    expect(items.at(0).isVisible()).to.equal(true)
    expect(
      items
        .at(0)
        .find('.veui-option-label')
        .text()
    ).to.equal('无搜索结果')
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
    let input = wrapper.find(NATIVE_INPUT)
    expect(input.element.value).to.equal('选项3')

    wrapper.find('button.veui-input-clear').trigger('click')
    await vm.$nextTick()
    expect(input.element.value).to.equal('')
    expect(vm.value).to.equal('')

    vm.clearable = true
    vm.searchable = false
    vm.value = '1'
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    let items = wrapper.findAll(OPTION_ITEM)
    expect(
      items
        .at(0)
        .find('.veui-option-label')
        .text()
    ).to.equal('请选择')

    items.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal(null)

    vm.multiple = true
    vm.value = ['2-1', '1-1']
    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    items = wrapper.findAll(OPTION_ITEM)
    items.at(0).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.deep.equal([])
    wrapper.destroy()
  })
})
