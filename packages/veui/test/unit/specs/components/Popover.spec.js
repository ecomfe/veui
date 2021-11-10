import Popover from '@/components/Popover'
import { wait, mount } from '../../../utils'

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

  it('should render slot correctly for Popover', async () => {
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
        <div>
          <button ref="btn">btn</button>
          <veui-popover target="btn" :open="open">
            {{ message }}
          </veui-popover>
        </div>
        `
    })
    await wrapper.vm.$nextTick()
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
    // popover 现在需要在 nextTick 才能渲染出 overlay（因为 targetNode 在 nextTick 才能存在）
    await wrapper.vm.$nextTick()
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

    // await wrapper.vm.$nextTick()
    // await wait(0)
    // 虽然上面的 wait 可以，但是还是对时机宽容点
    await wait(100)
    expect(document.activeElement.tagName.toLowerCase()).to.equal('input')
    wrapper.destroy()
  })

  it('should handle title prop correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-popover': Popover
        },
        template: `
          <div>
            <div ref="t">?</div>
            <veui-popover target="t" open title="title"/>
          </div>`
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    const { vm } = wrapper
    await vm.$nextTick()
    expect(wrapper.find('.veui-popover-head').text()).to.contains('title')
    wrapper.destroy()
  })

  it('should handle title slot correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-popover': Popover
        },
        template: `
          <div>
            <div ref="t">?</div>
            <veui-popover target="t" open>
              <div slot="title">title</div>
            </veui-popover>
          </div>`
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    const { vm } = wrapper
    await vm.$nextTick()
    expect(wrapper.find('.veui-popover-head').text()).to.contains('title')
    wrapper.destroy()
  })

  it('should render foot correctly', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-popover': Popover
        },
        data () {
          return {
            renderSlot: false
          }
        },
        template: `
          <div>
            <div ref="t">?</div>
            <veui-popover target="t" open foot>
              <div v-if="renderSlot" slot="foot">foot</div>
            </veui-popover>
          </div>`
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    const { vm } = wrapper
    await vm.$nextTick()
    expect(wrapper.find('.veui-popover-foot').exists()).to.eql(true)

    vm.renderSlot = true
    await vm.$nextTick()
    expect(wrapper.find('.veui-popover-foot').text()).to.contains('foot')
    wrapper.destroy()
  })

  it('should open correctly when used as uncontrolled component.', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-popover': Popover
        },
        template: `
          <div>
            <div class="test-target" ref="t">?</div>
            <veui-popover target="t" trigger="click">
              <div class="test-content">popover</div>
            </veui-popover>
          </div>`
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    const { vm } = wrapper
    await vm.$nextTick()
    wrapper.find('.test-target').trigger('click')
    await vm.$nextTick()
    expect(wrapper.find('.test-content').isVisible()).to.eql(true)
    wrapper.destroy()
  })
})
