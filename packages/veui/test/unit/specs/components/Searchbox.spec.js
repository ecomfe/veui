import { mount } from '@vue/test-utils'
import Searchbox from '@/components/Searchbox'

describe('components/Searchbox', () => {
  it('should handle selected prop with `null` value.', done => {
    let wrapper = mount({
      methods: {
        handleInput (val) {
          expect(val).to.equal('')

          wrapper.destroy()
          done()
        }
      },
      render () {
        return <Searchbox value={null} onInput={val => this.handleInput(val)} />
      }
    })

    wrapper.find('.veui-input-input').trigger('input')
  })
})
