import {mount} from '@vue/test-utils'
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
})
