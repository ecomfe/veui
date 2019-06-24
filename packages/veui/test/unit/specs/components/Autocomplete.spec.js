import { mount } from '@vue/test-utils'
import Autocomplete from '@/components/Autocomplete/Autocomplete'

const INPUT = '.veui-input'
const SUGGESTIONS = '.veui-autocomplete-suggestions'
const SUGGESTION_ITEM = '.veui-autocomplete-suggestions .veui-option'

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
        }
      ]
    }
  }
}

const debugInBrowser = {
  attachToDocument: true,
  sync: false
}

describe('components/Autocomplete', function () {
  it('should render datasource correctly & open dropdown on focus', async () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete suggest-trigger="focus" :datasource="stringDatasource"/>'
    }, debugInBrowser)

    let { vm } = wrapper
    wrapper.find(INPUT).trigger('click')
    await vm.$nextTick()
    expect(wrapper.find(SUGGESTIONS).isVisible()).to.be.equal(true)
    wrapper.destroy()
  })

  it('should not open dropdown on input', async () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete suggest-trigger="input" :datasource="datasource"/>'
    }, debugInBrowser)

    let { vm } = wrapper
    wrapper.find(INPUT).trigger('click')
    await vm.$nextTick()
    expect(wrapper.find(SUGGESTIONS).isVisible()).to.be.equal(false)
    wrapper.destroy()
  })

  it('should handle select correctly', async () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete v-model="value" suggest-trigger="focus" :datasource="groupedDatasource"/>'
    }, debugInBrowser)
    let { vm } = wrapper
    wrapper.find(INPUT).trigger('click')
    await vm.$nextTick()
    let options = wrapper.findAll(SUGGESTION_ITEM)
    options.at(2).trigger('click')
    await vm.$nextTick()
    expect(vm.value === '22').to.equal(true)
    wrapper.destroy()
  })

  it('should handle input event & strict prop correctly', async () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete v-model="value" strict suggest-trigger="focus" :datasource="groupedDatasource"/>'
    }, debugInBrowser)
    let { vm } = wrapper
    let nativeInputWrap = wrapper.find(INPUT).find('input')
    nativeInputWrap.element.value = '2'
    nativeInputWrap.trigger('input')
    wrapper.find(INPUT).trigger('click')
    await vm.$nextTick()
    let options = wrapper.findAll(SUGGESTION_ITEM)

    expect(options.at(0).isVisible()).to.equal(false)
    expect(options.at(1).isVisible()).to.equal(false)
    expect(options.at(2).isVisible()).to.equal(true)
    document.body.click()
    await vm.$nextTick()
    expect(vm.value).to.equal('')
    wrapper.destroy()
  })

  it('should render placeholder correctly', () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete placeholder="placeholder"/>'
    }, debugInBrowser)
    expect(wrapper.find('.veui-input-placeholder').contains('placeholder')).to.equal(false)
    wrapper.destroy()
  })

  it('should handle focus correctly', async () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete ref="autocomplete" />'
    }, debugInBrowser)
    let { vm } = wrapper
    vm.$refs.autocomplete.focus()
    await vm.$nextTick()
    expect(wrapper.find('input').element === document.activeElement).to.equal(true)
    wrapper.destroy()
  })

  it('should handle keydown correctly', async () => {
    let wrapper = mount({
      ...componentOptions,
      template: '<veui-autocomplete v-model="value" suggest-trigger="focus" :datasource="datasource"/>'
    }, debugInBrowser)

    let { vm } = wrapper
    let input = wrapper.find('input')
    input.trigger('focus')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Down' })
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Up' })
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Down' })
    let options = wrapper.findAll(SUGGESTION_ITEM)
    expect(options.at(0).classes('focus-visible')).to.equal(true)

    input.trigger('keydown', { key: 'Enter' })
    await vm.$nextTick()
    expect(vm.value === 'male').to.equal(true)

    input.trigger('focus')
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Left' })
    await vm.$nextTick()
    input.trigger('keydown', { key: 'Esc' })
    await vm.$nextTick()
    expect(wrapper.find(SUGGESTIONS).isVisible()).to.be.equal(false)
    wrapper.destroy()
  })
})
