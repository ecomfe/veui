import { mount } from '@vue/test-utils'
import Textarea from '@/components/Textarea'

describe('components/Textarea', () => {
  it('should handle value prop with `null` value.', done => {
    let wrapper = mount(
      Textarea,
      {
        propsData: {
          value: null
        }
      },
      {
        attachToDocument: true,
        sync: false
      }
    )

    wrapper.vm.$on('input', val => {
      expect(val).to.be.equal('')

      wrapper.destroy()
      done()
    })

    wrapper.find('textarea').trigger('input')
  })

  it('should transparently pass-through attrs to the <textarea> element.', () => {
    let wrapper = mount(
      Textarea,
      {
        attrs: {
          autofocus: ''
        }
      },
      {
        sync: false
      }
    )

    expect(wrapper.find('textarea').element.autofocus).to.be.equal(true)
    wrapper.destroy()
  })
})
