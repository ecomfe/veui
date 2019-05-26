import { mount } from '@vue/test-utils'
import Calendar from '@/components/Calendar'

describe('components/Calendar', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount(Calendar, {
      propsData: {
        selected: null
      }
    })

    wrapper.vm.$on('select', val => {
      expect(val instanceof Date).to.be.equal(true)

      wrapper.destroy()
      done()
    })

    wrapper.find('.veui-calendar-day button').trigger('click')
  })
})
