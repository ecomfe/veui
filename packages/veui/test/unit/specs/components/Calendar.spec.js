import {mount} from '@vue/test-utils'
import Calendar from '@/components/Calendar'

describe('components/Calendar', () => {
  it('should handle selected prop with `null` value.', (done) => {
    const wrapper = mount(Calendar, {
      propsData: {
        selected: null
      }
    })

    wrapper.vm.$on('select', (val) => {
      expect(val instanceof Date).toBe(true)
      done()
    })

    wrapper.find('.veui-calendar-day button').trigger('click')
  })
})
