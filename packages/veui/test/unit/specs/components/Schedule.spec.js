import { mount } from '@vue/test-utils'
import Schedule from '@/components/Schedule'

describe('components/Schedule', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount({
      methods: {
        handleSelect (val) {
          expect(val).to.deep.equal([undefined, [[0, 0]]])

          wrapper.destroy()
          done()
        }
      },
      render () {
        return (
          <Schedule selected={null} onSelect={val => this.handleSelect(val)} />
        )
      }
    })

    let button = wrapper.find('.veui-schedule-detail button')
    button.trigger('mousedown')
    button.trigger('mouseup')
  })
})
