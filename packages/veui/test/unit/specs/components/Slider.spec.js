import Slider from '@/components/Slider'
import { mount, getStyle } from '../../../utils'

describe('components/Slider', function () {
  it('shoule render right type for Slider', () => {
    let wrapper = mount({
      components: {
        'veui-slider': Slider
      },
      data () {
        return {
          value: 0.5
        }
      },
      template: '<veui-slider v-model="value"/>'
    })
    expect(wrapper.contains('.veui-slider')).to.equal(true)
    wrapper.destroy()
  })

  it('should handle disabled prop correctly', () => {
    let wrapper = mount(Slider, {
      propsData: {
        disabled: true,
        value: 0.5
      }
    })

    expect(wrapper.contains('.veui-slider.veui-disabled')).to.equal(true)
    wrapper.destroy()
  })

  it('should handle readonly prop correctly', () => {
    let wrapper = mount(Slider, {
      propsData: {
        readonly: true,
        value: 0.5
      }
    })

    expect(wrapper.contains('.veui-slider.veui-readonly')).to.equal(true)
    wrapper.destroy()
  })

  it('should not exceed max or min value', async () => {
    let wrapper = mount(Slider, {
      propsData: {
        max: 1,
        min: 0,
        value: 2
      }
    })

    let obj = getStyle(wrapper.find('.veui-slider-thumb').element)
    expect(obj.left).to.equal('100%')
  })

  it('should display range correctly', async () => {
    let wrapper = mount(Slider, {
      propsData: {
        max: 100,
        min: 0,
        value: [10, 30]
      }
    })
    let obj = wrapper.findAll('.veui-slider-thumb')

    expect(obj.length).to.equal(2)
    expect(getStyle(obj.at(0).element).left).to.equal('10%')
    expect(getStyle(obj.at(1).element).left).to.equal('30%')
  })

  it('should display mark correctly', async () => {
    let wrapper = mount(Slider, {
      propsData: {
        max: 100,
        min: 0,
        value: 10,
        mark: true,
        step: 10
      }
    })
    let obj = wrapper.find('.veui-slider-track-default-marks').element
      .childNodes
    expect(obj.length).to.equal(11)
  })

  it('should make prop `value` fully controlled', async () => {
    let wrapper = mount(Slider, {
      propsData: {
        max: 100,
        min: 0,
        value: 10,
        mark: true,
        step: 10
      }
    })
    let marks = wrapper.findAll(
      '.veui-slider-track-default-marks .veui-slider-track-default-mark'
    )
    marks.at(3).trigger('click')
    await wrapper.vm.$nextTick()
    expect(getStyle(wrapper.find('.veui-slider-thumb').element).left).to.equal(
      '10%'
    )
  })

  it('should support keyboard access', async () => {
    let wrapper = mount({
      components: {
        'veui-slider': Slider
      },
      template: `<veui-slider v-model="value" :step="1" :min="0" :max="10"/>`,
      data () {
        return {
          value: 5
        }
      }
    })

    let { vm } = wrapper
    let thumb = wrapper.find('.veui-slider-thumb')
    thumb.element.focus()

    thumb.trigger('keydown.up', { key: 'Up' })
    await vm.$nextTick()
    expect(vm.value).to.equal(6)

    thumb.trigger('keydown.right', { key: 'Right' })
    await vm.$nextTick()
    expect(vm.value).to.equal(7)

    thumb.trigger('keydown.down', { key: 'Down' })
    await vm.$nextTick()
    expect(vm.value).to.equal(6)

    thumb.trigger('keydown.left', { key: 'Left' })
    await vm.$nextTick()
    expect(vm.value).to.equal(5)

    wrapper.destroy()
  })
})
