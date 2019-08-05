import { mount } from '@vue/test-utils'
import Slider from '@/components/Slider'
import { getStyle } from '../../../utils'

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

  it('should handle disabled prop correctly.', done => {
    let wrapper = mount(Slider, {
      propsData: {
        disabled: true,
        value: 0.5
      }
    })

    expect(wrapper.vm.disabled).to.be.equals(true)

    wrapper.destroy()
    done()
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

  it('should display range correctly.', async () => {
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

  it('should display mark correctly.', async () => {
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
    expect(obj.length).to.equal(9)
  })
})
