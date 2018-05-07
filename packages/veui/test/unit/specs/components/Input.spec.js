import { mount } from '@vue/test-utils'
import Input from '@/components/Input'

describe('components/Input', () => {
  it('should handle value prop with `null` value.', done => {
    const wrapper = mount(Input, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('input', val => {
      expect(val).toBe('')
      done()
    })

    wrapper.find('input').trigger('input')
  })
})
