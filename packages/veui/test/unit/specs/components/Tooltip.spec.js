import { mount } from '@vue/test-utils'
import Tooltip from '@/components/Tooltip'
import { wait } from '../../../utils'

describe('components/Tooltip', function () {
  it('should put the layer root node directly below the body.', async () => {
    let wrapper = mount({
      components: {
        'veui-tooltip': Tooltip
      },
      data () {
        return {
          open: true
        }
      },
      template: `
        <veui-tooltip :open.sync="open">
            default slot content
        </veui-tooltip>
        `
    })

    await wait(0)

    expect(wrapper.find('.veui-tooltip-box').element.parentNode).to.equal(
      document.body
    )

    wrapper.destroy()
  })

  it('shoule render right type for Tooltip', () => {
    let wrapper = mount({
      components: {
        'veui-tooltip': Tooltip
      },
      data () {
        return {
          open: true
        }
      },
      template: `
        <veui-tooltip :open.sync="open">
            default slot content
        </veui-tooltip>
        `
    })
    expect(wrapper.contains('.veui-tooltip')).to.equal(true)
    wrapper.destroy()
  })

  it('should render slot correctly for Tooltip', () => {
    let wrapper = mount({
      components: {
        'veui-tooltip': Tooltip
      },
      data () {
        return {
          open: true,
          message: 'default slot content'
        }
      },
      template: `
        <veui-tooltip :open.sync="open">
            {{ message }}
        </veui-tooltip>
        `
    })
    expect(wrapper.find('.veui-tooltip-content').text()).to.equal(
      'default slot content'
    )
    wrapper.destroy()
  })

  it('should display the message correctly for Tooltip', async () => {
    let wrapper = mount({
      components: {
        'veui-tooltip': Tooltip
      },
      data () {
        return {
          open: false,
          message: 'default slot content'
        }
      },
      template: `
              <div>
                  <div class="tooltip-test" ref="tooltip-test">hover 测试</div>
                  <veui-tooltip target="tooltip-test" :open.sync="open" trigger="click">
                      {{ message }}
                  </veui-tooltip>
              </div>
              `
    })
    wrapper.find('.tooltip-test').trigger('click')
    await wait(10)
    expect(wrapper.vm.open).to.equal(true)
    wrapper.destroy()
  })
})
