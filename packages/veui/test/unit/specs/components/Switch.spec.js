import Vue from 'vue'
import { mount } from '@vue/test-utils'
import Switch from '@/components/Switch'

describe('components/Switch', () => {
  it('should handle checked prop with `null` value.', done => {
    const wrapper = mount(Switch, {
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
        'veui-switch': Switch
      },
      data () {
        return {
          choice: 'YES'
        }
      },
      async mounted () {
        await this.$nextTick()

        this.$el.querySelector('input').dispatchEvent(new MouseEvent('click'))
      },
      methods: {
        handleChange (checked) {
          expect(checked).toBe(false)
          expect(this.choice).toBe('NO')
          done()
        }
      },
      template:
        '<veui-switch v-model="choice" true-value="YES" false-value="NO" @change="handleChange"/>'
    }).$mount(wrapper)
  })
})
