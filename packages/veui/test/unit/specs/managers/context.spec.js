import { mount } from '@vue/test-utils'
import { createContext } from '@/managers/context'

const Context = createContext('dummy')

const DummyConsumer = {
  mixins: [Context.useConsumer('context')],
  render () {
    return <div>{JSON.stringify(this.context)}</div>
  }
}

describe('managers/context', () => {
  it('should Provider and Consumer work with primitives/objects correctly', async () => {
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
                default: contextValue => (
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

    vm.value = '2'
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    vm.value = true
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    // test some falsy values
    vm.value = false
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    vm.value = 0
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    vm.value = ''
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    vm.value = null
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    // test object values
    vm.value = { foo: 1 }
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    // test array values
    vm.value = [{ foo: 1 }]
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))
    wrapper.destroy()
  })

  it('should Provider and useConsumer work correctly', async () => {
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

    vm.value = false
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    vm.value = 0
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    vm.value = null
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    // test object values
    vm.value = { foo: 1 }
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))

    // test array values
    vm.value = [{ foo: 1 }]
    await vm.$nextTick()
    expect(wrapper.text()).to.equal(JSON.stringify(vm.value))
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
      JSON.stringify(Object.assign({}, vm.value1, vm.value2))
    )
    wrapper.destroy()
  })
})
