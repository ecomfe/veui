import { mount } from '@vue/test-utils'
import Input from '@/components/Input'
import NumberInput from '@/components/NumberInput'

describe('components/NumberInput', () => {
  it('should handle value prop with `null` value.', () => {
    const wrapper = mount(NumberInput, {
      propsData: {
        value: null
      }
    })

    const changeHandler = jest.fn()
    wrapper.vm.$on('change', changeHandler)
    wrapper.find('input').trigger('change')
    setTimeout(() => {
      expect(changeHandler.mock.calls.length).toBe(0)
    })
  })

  it('should transparently pass-through attrs to the <input> element.', () => {
    const wrapper = mount(NumberInput, {
      attrs: {
        autofocus: '',
        selectOnFocus: ''
      }
    })

    expect(wrapper.find(Input).props('selectOnFocus')).toBe(true)
    expect(wrapper.find('input').element.autofocus).toBe(true)
  })
})
