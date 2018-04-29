import {mount} from '@vue/test-utils'
import Checkbox from '@/components/Checkbox'

describe('components/Checkbox', () => {
  it('should handle checked prop with `null` value.', (done) => {
    const wrapper = mount(Checkbox, {
      propsData: {
        checked: null
      }
    })

    wrapper.vm.$on('change', (val) => {
      expect(val).toBe(true)
      done()
    })

    wrapper.find('input').trigger('change')
  })
})
