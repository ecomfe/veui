import { mount } from '@vue/test-utils'
import Switch from '@/components/Switch'

describe('components/Switch', () => {
  it('should handle checked prop with `null` value.', done => {
    let wrapper = mount(Switch, {
      propsData: {
        checked: null
      }
    })

    wrapper.vm.$on('change', val => {
      expect(val).to.be.equal(true)

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
          expect(checked).to.be.equal(false)
          expect(this.choice).to.be.equal('NO')

          wrapper.destroy()
          done()
        }
      },
      template:
        '<veui-switch v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
    })

    wrapper.find('input').trigger('change')
  })
})
