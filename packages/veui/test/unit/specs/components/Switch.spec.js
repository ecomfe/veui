import { mount } from '@vue/test-utils'
import Switch from '@/components/Switch'
import sinon from 'sinon'

describe('components/Switch', () => {
  it('should handle checked prop with `null` value.', done => {
    let wrapper = mount(Switch, {
      propsData: {
        checked: null
      }
    })

    wrapper.vm.$on('change', val => {
      expect(val).to.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', done => {
    let wrapper = mount({
      components: {
        'veui-switch': Switch
      },
      data () {
        return {
          choice: 'YES'
        }
      },
      methods: {
        handleChange (checked) {
          expect(checked).to.equal(false)
          expect(this.choice).to.equal('NO')

          wrapper.destroy()
          done()
        }
      },
      template:
        '<veui-switch v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
    })

    wrapper.find('input').trigger('change')
  })

  it('should handle disabled prop correctly.', done => {
    let wrapper = mount(Switch, {
      propsData: {
        disabled: true
      }
    })

    expect(wrapper.vm.disabled).to.be.equals(true)

    wrapper.destroy()
    done()
  })

  it('should handle change correctly when disabled', async () => {
    let wrapper = mount(Switch, {
      propsData: {
        disabled: true
      }
    })

    let changeHandler = sinon.spy()
    wrapper.vm.$on('change', changeHandler)
    wrapper.find('input').trigger('change')

    await wrapper.vm.$nextTick()
    expect(changeHandler.callCount).to.equal(0)

    wrapper.destroy()
  })

  it('should support checked + change usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleChange (checked) {
            this.checked = checked
          }
        },
        template: '<veui-switch :checked="checked" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.checked = true

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should support checked.sync usage', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        template: '<veui-switch :checked.sync="checked"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper
    let box = wrapper.find('input')

    vm.checked = true

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(false)

    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    expect(vm.checked).to.equal(true)

    vm.checked = false

    await vm.$nextTick()
    expect(box.element.checked).to.equal(false)

    wrapper.destroy()
  })

  it('should only emit change event upon user interaction', async () => {
    let changes = 0
    let wrapper = mount(
      {
        components: {
          'veui-switch': Switch
        },
        data () {
          return {
            checked: false
          }
        },
        methods: {
          handleChange (checked) {
            changes++
          }
        },
        template: '<veui-switch :checked="checked" @change="handleChange"/>'
      },
      {
        sync: false
      }
    )

    let { vm } = wrapper

    vm.checked = true
    vm.checked = false

    await vm.$nextTick()
    vm.checked = true

    await vm.$nextTick()
    vm.checked = false

    await vm.$nextTick()
    expect(changes).to.equal(0)

    let box = wrapper.find('input')
    box.element.checked = true
    box.trigger('change')

    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    box.element.checked = true
    box.trigger('change')

    await vm.$nextTick()
    box.element.checked = false
    box.trigger('change')

    await vm.$nextTick()
    expect(changes).to.equal(4)

    wrapper.destroy()
  })

  it('should handle correctly when activated', () => {
    let wrapper = mount(
      Switch,
      {
        propsData: {
          checked: false
        }
      },
      {
        sync: false
      }
    )

    wrapper.vm.$on('change', val => {
      expect(val).to.equal(true)
    })

    wrapper.vm.activate()
  })
})
