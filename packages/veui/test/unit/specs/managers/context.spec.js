import { mount } from '@vue/test-utils'
import { createContext } from '@/managers/context'
import { defaults } from 'lodash'

const Context = createContext('dummy')

const DummyConsumer = {
  mixins: [Context.useConsumer('context')],
  render () {
    return <div>{JSON.stringify(this.context)}</div>
  }
}

describe('managers/context', () => {
  it('should work with Provider + Consumer', async () => {
    let wrapper = mount({
      data () {
        return {
          value: 1
        }
      },
      render () {
        return (
          <Context.Provider value={this.value}>
            <Context.Consumer
              scopedSlots={{
                default: (contextValue) => (
                  <div>{JSON.stringify(contextValue)}</div>
                )
              }}
            />
          </Context.Provider>
        )
      }
    })
    let { vm } = wrapper
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    await serialAssert(
      ['2', true, false, 0, '', null, { foo: 1 }, [{ foo: 1 }]],
      wrapper
    )
    wrapper.destroy()
  })

  it('should work with Provider + useConsumer', async () => {
    let wrapper = mount({
      data () {
        return {
          value: 1
        }
      },
      render () {
        return (
          <Context.Provider value={this.value}>
            <DummyConsumer />
          </Context.Provider>
        )
      }
    })

    let { vm } = wrapper
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    await serialAssert([false, 0, null, { foo: 1 }, [{ foo: 1 }]], wrapper)
    wrapper.destroy()
  })

  it('should merge context value among multiple nested providers correctly', async () => {
    let wrapper = mount(
      {
        data () {
          return {
            value1: { foo: 1 },
            value2: { bar: 2 }
          }
        },
        render () {
          return (
            <div>
              <Context.Provider value={this.value1}>
                <DummyConsumer class="dummy-1" />
                <Context.Provider value={this.value2}>
                  <DummyConsumer class="dummy-2" />
                </Context.Provider>
              </Context.Provider>
            </div>
          )
        }
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    expect(wrapper.find('.dummy-1').text()).to.equal(JSON.stringify(vm.value1))
    expect(wrapper.find('.dummy-2').text()).to.equal(
      JSON.stringify(defaults({}, vm.value2, vm.value1))
    )
    wrapper.destroy()
  })
})

async function serialAssert (values, wrapper) {
  for (let i = 0; i < values.length; i++) {
    wrapper.vm.value = values[i]
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(wrapper.vm.value))
  }
}
