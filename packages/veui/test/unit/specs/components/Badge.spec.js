import { mount } from '@vue/test-utils'
import Badge from '@/components/Badge'
import config from '@/managers/config'

describe('components/Badge', function () {
  this.timeout(10000)

  it('should render `status` correctly', () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: `
        <div>
        <veui-badge status="success">News</veui-badge>
        <veui-badge type="error">News</veui-badge>
        </div>`
    })

    const badges = wrapper.findAll(Badge)
    expect(badges.at(0).contains('.veui-badge-success')).to.equal(true)
    expect(badges.at(1).contains('.veui-badge-error')).to.equal(true)
    wrapper.destroy()
  })

  it('should render corner badge without content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge>News</veui-badge>'
    })
    const label = wrapper.find('.veui-badge-label')
    const dot = wrapper.find('.veui-badge-dot')
    expect(label.exists()).to.equal(false)
    expect(dot.exists()).to.equal(true)
  })

  it('should render corner badge with content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge value="hot">News</veui-badge>'
    })
    const label = wrapper.find('.veui-badge-label')
    const dot = wrapper.find('.veui-badge-dot')
    expect(label.exists()).to.equal(true)
    expect(dot.exists()).to.equal(false)
  })

  it('should handle `max` prop correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge :value="value" :max="max">News</veui-badge>',
      data () {
        return {
          value: 1000,
          max: null
        }
      }
    })

    const { vm } = wrapper
    const max = config.get('badge.max')

    const label = wrapper.find('.veui-badge-label')
    expect(label.text()).to.equal(`${max}+`)
    vm.max = 99

    await vm.$nextTick()
    expect(label.text()).to.equal('99+')
  })

  it('should render standalone badge without content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge/>'
    })
    const dot = wrapper.find('.veui-badge-dot')
    expect(dot.exists()).to.equal(true)
    expect(wrapper.text()).to.equal('')
  })

  it('should render standalone badge with content correctly', async () => {
    const wrapper = mount({
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge value="hot"/>'
    })
    const dot = wrapper.find('.veui-badge-dot')
    expect(dot.exists()).to.equal(true)
    expect(wrapper.text()).to.equal('hot')
  })

  it('should recognize standalone reactively', async () => {
    const wrapper = mount({
      data () {
        return {
          standalone: true
        }
      },
      components: {
        'veui-badge': Badge
      },
      template: '<veui-badge><span v-if="!standalone">btn</span></veui-badge>'
    })
    const { vm } = wrapper
    expect(wrapper.find('.veui-badge-standalone').exists()).to.equal(true)

    vm.standalone = false
    await vm.$nextTick()
    expect(wrapper.find('.veui-badge-standalone').exists()).to.equal(false)
  })
})
