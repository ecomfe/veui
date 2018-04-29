import Vue from 'vue'
import Searchbox from '@/components/Searchbox'

describe('components/Searchbox', () => {
  it('should handle selected prop with `null` value.', (done) => {
    new Vue({
      mounted () {
        this.$el.querySelector('.veui-input-input').dispatchEvent(new Event('input'))
      },
      methods: {
        handleInput (val) {
          expect(val).toBe('')
          done()
        }
      },
      render () {
        return (<Searchbox value={null} onInput={(val) => this.handleInput(val)} />)
      }
    }).$mount()
  })
})
