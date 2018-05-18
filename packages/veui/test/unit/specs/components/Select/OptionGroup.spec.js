import Select from 'veui/components/Select'
import Vue from 'vue'
import { some } from 'lodash'

describe('components/Select/OptionGroup', () => {
  it('should pass down the `disabled` prop to the Option.', done => {
    new Vue({
      el: document.createElement('div'),
      components: {
        'veui-select': Select
      },
      data () {
        return {
          options: [
            {
              value: 1,
              label: '1',
              disabled: true
            },
            {
              value: 2,
              label: '2',
              disabled: false
            }
          ]
        }
      },
      mounted () {
        this.$el.querySelector('.veui-select-button').dispatchEvent(new Event('click'))

        setTimeout(() => {
          const options = document.body.querySelectorAll('.veui-option')
          expect(some(options[0].classList, item => item === 'veui-option-disabled')).toBe(true)
          expect(some(options[1].classList, item => item === 'veui-option-disabled')).toBe(false)
          done()
        })
      },
      template: `
        <veui-select :options="options"></veui-select>`
    })
  })
})
