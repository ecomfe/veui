import Vue from 'vue'
import Schedule from '@/components/Schedule'

describe('components/Schedule', () => {
  it('should handle selected prop with `null` value.', done => {
    new Vue({
      mounted () {
        const button = this.$el.querySelector('.veui-schedule-detail button')
        button.dispatchEvent(new Event('mousedown'))
        button.dispatchEvent(new Event('mouseup'))
      },
      methods: {
        handleSelect (val) {
          expect(val).toEqual([undefined, [[0, 0]]])
          done()
        }
      },
      render () {
        return (
          <Schedule selected={null} onSelect={val => this.handleSelect(val)} />
        )
      }
    }).$mount()
  })
})
