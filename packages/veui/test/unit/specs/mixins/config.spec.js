import { mount } from '@vue/test-utils'
import ConfigProvider from '@/components/ConfigProvider'
import config from '@/managers/config'
import useConfig from '@/mixins/config'

const TEST_FIELD = '__veui_test.config'

config.defaults({
  [TEST_FIELD]: 'test'
})

const DummyConsumer = {
  mixins: [useConfig('config', '__veui_test.')],
  render () {
    this.renderCount = (this.renderCount || 0) + 1
    return <div>{JSON.stringify(this.config[TEST_FIELD])}</div>
  }
}

describe('mixins/config', () => {
  it('should ConfigProvider works correctly', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            context: null
          }
        },
        render () {
          return (
            <ConfigProvider value={this.context}>
              <DummyConsumer />
            </ConfigProvider>
          )
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    expect(wrapper.text()).to.equal(JSON.stringify(config.get(TEST_FIELD)))

    vm.context = {
      [TEST_FIELD]: '撞日'
    }
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.context[TEST_FIELD]))
    wrapper.destroy()
  })

  it('should make config consumers only reactive to specific prefixes', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            context: null
          }
        },
        render () {
          return (
            <ConfigProvider value={this.context}>
              <DummyConsumer ref="dummy" />
            </ConfigProvider>
          )
        }
      },
      {
        sync: false
      }
    )

    const { vm } = wrapper
    await vm.$nextTick()

    const prevCount = vm.$refs.dummy.renderCount
    vm.context = {
      not_exists: 1
    }
    await vm.$nextTick()
    expect(vm.$refs.dummy.renderCount).to.equal(prevCount)

    vm.context = {
      [TEST_FIELD]: '撞日'
    }
    await vm.$nextTick()
    expect(vm.$refs.dummy.renderCount).to.equal(prevCount + 1)
    wrapper.destroy()
  })
})
