import {mount} from '@vue/test-utils'
import Radio from '@/components/Radio'

describe('components/Radio', () => {
  it('should handle value prop with `null` value.', (done) => {
    const wrapper = mount(Radio, {
      propsData: {
        value: null
      }
    })

    wrapper.vm.$on('change', (val) => {
      expect(val).toBe(null)
      done()
    })

    wrapper.find('input').element.checked = true
    wrapper.find('input').trigger('change')
  })
})
