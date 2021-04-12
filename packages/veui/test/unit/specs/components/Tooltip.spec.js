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
        <div>
          <button ref="btn">btn</button>
          <veui-tooltip target="btn" :open.sync="open">
            {{ message }}
          </veui-tooltip>
        </div>
        `
    })
    expect(wrapper.find('.veui-tooltip-box').text()).to.equal(
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

    await wait(0)
    expect(wrapper.vm.open).to.equal(true)
    wrapper.destroy()
  })

  it('should make prop `open` fully controlled', async () => {
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
                  <veui-tooltip target="tooltip-test" :open="open" trigger="click">
                      {{ message }}
                  </veui-tooltip>
              </div>
              `
    })
    wrapper.find('.tooltip-test').trigger('click')

    await wait(0)
    expect(wrapper.vm.open).to.equal(false)

    wrapper.vm.open = true
    await wait(400)
    expect(wrapper.find('.veui-tooltip').isVisible()).to.equal(true)
    document.body.click()
    await wait(400)
    expect(wrapper.find('.veui-tooltip').isVisible()).to.equal(true)
    wrapper.destroy()
  })
})
