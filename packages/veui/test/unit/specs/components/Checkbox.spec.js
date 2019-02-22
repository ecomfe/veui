import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Checkbox from '@/components/Checkbox'

describe('components/Checkbox', () => {
  it('should handle checked prop with `null` value.', done => {
    const wrapper = mount(Checkbox, {
      propsData: {
        checked: null
      }
    })

    wrapper.vm.$on('change', val => {
      expect(val).toBe(true)
      done()
    })

    wrapper.find('input').trigger('change')
  })

  it('should update checked/model value before change event is fired.', done => {
    let wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    new Vue({
      components: {
        'veui-checkbox': Checkbox
      },
      data () {
        return {
          choice: 'YES'
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
          expect(checked).toBe(false)
          expect(this.choice).toBe('NO')
          done()
        }
      },
      template: '<veui-checkbox v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
    }).$mount(wrapper)
  })
})
