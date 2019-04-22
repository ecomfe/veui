import { mount } from '@vue/test-utils'
import Textarea from '@/components/Textarea'

describe('components/Textarea', () => {
  it('should handle value prop with `null` value.', done => {
    const wrapper = mount(Textarea, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('input', val => {
      expect(val).toBe('')
      done()
    })

    wrapper.find('textarea').trigger('input')
  })

  it('should transparently pass-through attrs to the <textarea> element.', () => {
    const wrapper = mount(Textarea, {
      attrs: {
        autofocus: ''
      }
    })

    expect(wrapper.find('textarea').element.autofocus).toBe(true)
  })
})
