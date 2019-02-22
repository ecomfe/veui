import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Radio from '@/components/Radio'

describe('components/Radio', () => {
  it('should handle value prop with `null` value.', done => {
    const wrapper = mount(Radio, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('input', val => {
      expect(val).toBe(null)
      done()
    })

    wrapper.find('input').element.checked = true
    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', done => {
    let wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    new Vue({
      components: {
        'veui-radio': Radio
      },
      data () {
        return {
          checked: false
        }
      },
      async mounted () {
        await this.$nextTick()

        this.$el
          .querySelector('input')
          .dispatchEvent(new MouseEvent('click'))
      },
      methods: {
        handleChange (checked) {
          expect(checked).toBe(true)
          expect(this.checked).toBe(true)
          done()
        }
      },
      template: '<veui-radio v-model="checked" @change="handleChange"/>'
    }).$mount(wrapper)
  })
})
