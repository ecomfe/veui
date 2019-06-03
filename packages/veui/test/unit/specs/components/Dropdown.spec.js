import { mount, createWrapper } from '@vue/test-utils'
import Dropdown from '@/components/Dropdown'

let datasource = [
  {
    label: '男',
    value: 'male',
    disabled: false
  },
  {
    label: '女',
    value: 'female',
    disabled: true
  }
]

describe('components/Dropdown', () => {
  it('should handle `trigger` prop correctly', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        trigger: 'hover',
        options: datasource,
        label: '测试Dropdown',
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })

    let button = wrapper.find('.veui-dropdown-button')
    let menuWrapper = createWrapper(document.querySelector('.test-overlay-class'))

    button.element.onmouseenter = () => {
      expect(menuWrapper.attributes().style.display).to.not.equal('none')
      wrapper.destroy()
    }
    button.trigger('mouseenter')
  })

  it('should handle other props correctly', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        ui: 'micro',
        split: true,
        disabled: true,
        trigger: 'hover',
        options: datasource,
        label: '测试Dropdown',
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })

    let label = wrapper.find('.veui-dropdown-label')
    let button = wrapper.find('.veui-dropdown-button')
    let commandButton = wrapper.find('.veui-dropdown-command')
    let menuWrapper = createWrapper(document.querySelector('.test-overlay-class'))
    let attributes = button.attributes()

    // ui
    expect(wrapper.attributes().ui).to.be.equal('micro')
    // disabled
    expect(attributes.disabled).to.be.equal('disabled')
    expect(attributes.class).to.include('veui-disabled')
    expect(attributes['aria-disabled']).to.be.equal('true')
    // label
    expect(label.text()).to.be.equal('测试Dropdown')
    // split
    expect(commandButton.exists()).to.be.equal(true)
    // overlayClass
    expect(menuWrapper.exists()).to.be.equal(true)
    // options
    expect(menuWrapper.find('.veui-option-group').exists()).to.be.equal(true)
    wrapper.destroy()
  })

  it('should render option slot correctly', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        trigger: 'hover',
        options: datasource,
        overlayClass: 'test-overlay-class'
      },
      scopedSlots: {
        option: '<div class="test-veui-option" slot-scope="props">{{props.label}}</div>'
      },
      sync: false,
      attachToDocument: true
    })

    wrapper.vm.focus()
    expect(document.activeElement).to.be.satisfy(
      item => item === document.querySelector('.veui-dropdown-button')
    )

    let menuWrapper = wrapper.find('.test-overlay-class')
    let option = menuWrapper.find('.test-veui-option')

    expect(option.exists()).to.be.equal(true)
    expect(option.text()).to.be.oneOf(['男', '女'])
    wrapper.destroy()
  })

  it('should trigger click event with a value', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        options: datasource,
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })

    wrapper.vm.$on('click', val => {
      expect(val).to.be.equal('male')
      wrapper.destroy()
    })

    let menuWrapper = createWrapper(document.querySelector('.test-overlay-class'))
    let options = menuWrapper.findAll('.veui-option')

    options.wrappers[0].trigger('click')
  })

  it('should trigger click event without a value', () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        options: datasource
      },
      sync: false,
      attachToDocument: true
    })

    wrapper.vm.$on('click', val => {
      expect(val).to.be.equal(undefined)
      wrapper.destroy()
    })

    let commandButton = wrapper.find('.veui-dropdown-command')

    commandButton.trigger('click')
  })

  it('should close the dropdown menu if `esc` is pressed', async () => {
    let wrapper = mount(Dropdown, {
      propsData: {
        split: true,
        trigger: 'click',
        options: datasource,
        overlayClass: 'test-overlay-class'
      },
      sync: false,
      attachToDocument: true
    })
    // for coverage
    wrapper.vm.focus()
    expect(document.activeElement).to.be.satisfy(
      item => item === document.querySelector('.veui-dropdown-command')
    )

    const { $nextTick } = wrapper.vm
    let button = wrapper.find('.veui-dropdown-button')
    button.trigger('click')

    await $nextTick()
    let menuWrapper = wrapper.find('.test-overlay-class')
    let optionWrapper = menuWrapper.find('.veui-dropdown-options')

    optionWrapper.trigger('keydown.esc')
    await $nextTick()
    expect(menuWrapper.attributes().style).to.include('display: none')
    wrapper.destroy()
  })
})
