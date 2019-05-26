import { mount } from '@vue/test-utils'
import Radio from '@/components/Radio'

describe('components/Radio', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(Radio, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('input', val => {
      expect(val).to.be.equal(null)

      wrapper.destroy()
      done()
    })

    wrapper.find('input').element.checked = true
    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', done => {
    let wrapper = mount({
      components: {
        'veui-radio': Radio
      },
      data () {
        return {
          checked: false
        }
      },
      methods: {
        handleChange (checked) {
          expect(checked).to.be.equal(true)
          expect(this.checked).to.be.equal(true)

          wrapper.destroy()
          done()
        }
      },
      template: '<veui-radio v-model="checked" @change="handleChange"/>'
    })

    wrapper.find('input').element.checked = true
    wrapper.find('input').trigger('change')
  })
})
