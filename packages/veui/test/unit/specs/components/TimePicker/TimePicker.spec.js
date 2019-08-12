import { mount } from '@vue/test-utils'
import TimePicker from '@/components/TimePicker'
import { isEqual } from 'lodash'

const OPTION_WRAPPER = '.veui-time-picker-option-group-wrapper'
const NATIVE_INPUT = '.veui-input input'
const OPTION = '.veui-option'
let componentOptions = {
  components: {
    'veui-time-picker': TimePicker
  },
  data () {
    return {
      value0: null,
      min0: [1],
      max0: [10]
    }
  }
}

const debugInBrowser = {
  attachToDocument: true,
  sync: false
}

describe('components/TimePicker', function () {
  it('should render datasource correctly & open dropdown on focus', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template:
          '<veui-time-picker :minute-datasource="[0, 30]" :second-datasource="[0, 15, 30]"/>'
      },
      debugInBrowser
    )

    let { vm } = wrapper
    wrapper.find(NATIVE_INPUT).trigger('focus')
    await vm.$nextTick()
    let options = wrapper.findAll(OPTION_WRAPPER)
    expect(options.isVisible()).to.equal(true)
    expect(options.length === 3).to.equal(true)
    expect(
      options.at(0).findAll(OPTION).length === 24 &&
        options.at(1).findAll(OPTION).length === 2 &&
        options.at(2).findAll(OPTION).length === 3
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should render option slot correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-time-picker :second-datasource="[0, 30]"><template
              slot="option" slot-scope="{label}" >{{label + '*'}}</template></veui-time-picker>`
      },
      debugInBrowser
    )

    let { vm } = wrapper
    wrapper.find(NATIVE_INPUT).trigger('focus')
    await vm.$nextTick()
    let options = wrapper.findAll(OPTION_WRAPPER)
    expect(
      options
        .at(0)
        .findAll(OPTION)
        .at(0)
        .contains('*')
    ).to.equal(true)

    wrapper.destroy()
  })

  it('should handle selection correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-time-picker
            :value.sync="value0"
            :minute-datasource="[15, 30]"
            :second-datasource="[0, 30]"
          />`
      },
      debugInBrowser
    )

    let { vm } = wrapper
    wrapper.find(NATIVE_INPUT).trigger('focus')
    await vm.$nextTick()
    let options = wrapper.findAll(OPTION_WRAPPER)
    expect(options.isVisible()).to.equal(true)
    options
      .at(2)
      .findAll(OPTION)
      .at(1)
      .trigger('click')
    await vm.$nextTick()
    expect(isEqual(vm.value0, [0, 15, 30])).to.equal(true)

    wrapper.destroy()
  })

  it('should handle input correctly', async () => {
    let wrapper = mount(
      {
        ...componentOptions,
        template: `<veui-time-picker
            :value.sync="value0"
            :minute-datasource="[15, 30]"
            :second-datasource="[0, 30]"/>`
      },
      debugInBrowser
    )

    let { vm } = wrapper
    let nativeInput = wrapper.find(NATIVE_INPUT)
    nativeInput.trigger('focus')
    nativeInput.element.value = 'abc'
    nativeInput.trigger('input')
    document.body.click()
    await vm.$nextTick()
    expect(isEqual(vm.value0, null)).to.equal(true)

    nativeInput.element.value = '12:30:30'
    nativeInput.trigger('input')
    await vm.$nextTick()

    expect(isEqual(vm.value0, [12, 30, 30])).to.equal(true)
    wrapper.destroy()
  })
})
