import {mount} from '@vue/test-utils'
import DatePicker from '@/components/DatePicker'

describe('components/DatePicker', () => {
  it('should handle selected prop with `null` value.', (done) => {
    const wrapper = mount(DatePicker, {
      propsData: {
        selected: null
      }
    })

    wrapper.vm.$on('select', (val) => {
      expect(val instanceof Date).toBe(true)
      done()
    })

    wrapper.find('.veui-date-picker-button').trigger('click')
    wrapper.find('.veui-calendar-day button').trigger('click')
  })
})
