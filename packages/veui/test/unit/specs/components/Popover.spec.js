import { mount } from '@vue/test-utils'
import Popover from '@/components/Popover'
import { wait } from '../../../utils'

describe('components/Popover', function () {
  it('should put the layer root node directly below the body.', async () => {
    let wrapper = mount({
      components: {
        'veui-popover': Popover
      },
      data () {
        return {
          open: true
        }
      },
      template: `
        <veui-popover :open.sync="open">
            default slot content
        </veui-popover>
        `
    })

    await wait(0)

    expect(wrapper.find('.veui-popover-box').element.parentNode).to.equal(
      document.body
    )

    wrapper.destroy()
  })

  it('should render slot correctly for Popover', () => {
    let wrapper = mount({
      components: {
        'veui-popover': Popover
      },
      data () {
        return {
          open: true,
          message: 'default slot content'
        }
      },
      template: `
        <veui-popover :open.sync="open">
            {{ message }}
        </veui-popover>
        `
    })
    expect(wrapper.find('.veui-popover-box').text()).to.equal(
      'default slot content'
    )
    wrapper.destroy()
  })

  it('should display the message correctly for Popover', async () => {
    let wrapper = mount({
      components: {
        'veui-popover': Popover
      },
      data () {
        return {
          open: false,
          message: 'default slot content'
        }
      },
      template: `
              <div>
                  <div class="popover-test" ref="popover-test">hover 测试</div>
                  <veui-popover target="popover-test" :open.sync="open" trigger="click">
                      {{ message }}
                  </veui-popover>
              </div>
              `
    })
    wrapper.find('.popover-test').trigger('click')

    await wait(0)
    expect(wrapper.vm.open).to.equal(true)
    wrapper.destroy()
  })

  it('should handle `autofocus` correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-popover': Popover
        },
        template: `
          <div>
            <div ref="t">?</div>
            <veui-popover target="t" autofocus open>
                <input/>
            </veui-popover>
          </div>`
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    await wait(0)
    expect(document.activeElement.tagName.toLowerCase()).to.equal('input')
    wrapper.destroy()
  })

  it('should ignore `autofocus` if `interactive` is `false`', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-popover': Popover
        },
        template: `
          <div>
            <div ref="t">?</div>
            <veui-popover target="t" autofocus open :interactive="false">
                <input/>
            </veui-popover>
          </div>`
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    await wait(0)
    expect(document.activeElement.tagName.toLowerCase()).to.not.equal('input')
    wrapper.destroy()
  })
})
