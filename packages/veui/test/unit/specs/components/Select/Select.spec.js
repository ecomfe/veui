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

    wrapper.find('.veui-select-input').trigger('click')
    await vm.$nextTick()
    overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(true)

    document.body.click()
    await vm.$nextTick()
    vm.searchable = true
    await vm.$nextTick()
    wrapper.find('.veui-select-search-input').trigger('click')
    await vm.$nextTick()
    overlay = wrapper.find('.veui-overlay-box')
    expect(overlay.isVisible()).to.equal(false)
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
          options: datasource
        }
      },
      template: '<veui-select :options="options" v-model="value"/>'
    })
    let { vm } = wrapper
    wrapper.find('.veui-select-input').trigger('click')
    await vm.$nextTick()
    let options = wrapper.findAll(OPTION_ITEM)
    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal('2-1')
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
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Esc' })
    await vm.$nextTick()
    expect(overlay.isVisible()).to.equal(false)

    input.trigger('focus')
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
    let options = wrapper.findAll(OPTION_ITEM)
    expect(options.length).to.equal(3)

    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.value).to.equal('2-3')
    wrapper.destroy()
  })

  it('should render and clear value correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-select': Select
        },
        data () {
          return {
            options: datasource,
            value: '3'
          }
        },
        template: '<veui-select v-model="value" :options="options" searchable/>'
      },
      {
        sync: false,
        attachToDocument: true
      }
    )
    let input = wrapper.find(NATIVE_INPUT)
    expect(input.element.value).to.equal('选项3')

    wrapper.find('button.veui-input-clear').trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('')
    wrapper.destroy()
  })
})
