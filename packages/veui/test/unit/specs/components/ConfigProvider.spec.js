import ConfigProvider from '@/components/ConfigProvider'
import Collapse from '@/components/Collapse'
import Input from '@/components/Input'
import config from '@/managers/config'
import useConfig from '@/mixins/config'
import { mount } from '../../../utils'

const TEST_FIELD = '__veui_test.config'
const TEST_OBJ_FIELD = '__veui_test.obj'

config.defaults({
  [TEST_FIELD]: 'test',
  [TEST_OBJ_FIELD]: {
    foo: 'bar',
    baz: 'bop'
  }
})

const DummyConsumer = {
  mixins: [useConfig('config', '__veui_test')],
  render () {
    this.renderCount = (this.renderCount || 0) + 1
    return <div>{JSON.stringify(this.config[TEST_FIELD])}</div>
  }
}

describe('components/ConfigProvider', function () {
  this.timeout(10000)

  it('should ConfigProvider works correctly', async () => {
    let wrapper = mount({
      data () {
        return {
          context: undefined
        }
      },
      render () {
        return (
          <ConfigProvider value={this.context}>
            <DummyConsumer />
          </ConfigProvider>
        )
      }
    })

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
    let wrapper = mount({
      data () {
        return {
          context: undefined
        }
      },
      render () {
        return (
          <ConfigProvider value={this.context}>
            <DummyConsumer ref="dummy" />
          </ConfigProvider>
        )
      }
    })

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

  it('should config ui/icons correctly.', async () => {
    let wrapper = mount({
      data () {
        return {
          context: {
            [`${TEST_OBJ_FIELD}.foo`]: 'foo'
          }
        }
      },
      render () {
        return (
          <ConfigProvider value={this.context}>
            <DummyConsumer ref="dummy" />
          </ConfigProvider>
        )
      }
    })

    const { vm } = wrapper
    let dummy = vm.$refs.dummy

    await vm.$nextTick()
    expect(dummy.config[TEST_OBJ_FIELD].foo).to.equal('foo')
    expect(dummy.config[TEST_OBJ_FIELD].baz).to.equal('bop')

    vm.context = {
      [TEST_OBJ_FIELD]: {
        foo: 'foo1'
      }
    }
    await vm.$nextTick()
    expect(dummy.config[TEST_OBJ_FIELD].foo).to.equal('foo1')
    expect(dummy.config[TEST_OBJ_FIELD].baz).to.equal(undefined)

    vm.context = {
      [`${TEST_OBJ_FIELD}.baz`]: 'baz1'
    }
    await vm.$nextTick()
    expect(dummy.config[TEST_OBJ_FIELD].foo).to.equal('bar')
    expect(dummy.config[TEST_OBJ_FIELD].baz).to.equal('baz1')
    wrapper.destroy()
  })

  it('should config ui sub themes correctly.', async () => {
    let wrapper = mount({
      data () {
        return {
          context: {
            theme: 'd22'
          }
        }
      },
      render () {
        return (
          <div>
            <h1>Hello</h1>
            <ConfigProvider value={this.context}>
              <Collapse label="Test" expanded>
                <Input />
              </Collapse>
            </ConfigProvider>
          </div>
        )
      }
    })

    const collapse = wrapper.find(Collapse)
    const input = collapse.find(Input)

    expect(collapse.attributes('ui').includes('theme:d22')).to.equal(true)
    expect(input.attributes('ui').includes('theme:d22')).to.equal(true)

    wrapper.destroy()
  })
})
