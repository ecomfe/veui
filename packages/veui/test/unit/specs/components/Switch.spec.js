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
