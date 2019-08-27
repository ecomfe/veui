import Select from 'veui/components/Select'
import Vue from 'vue'
import { some } from 'lodash'
import { mount } from '@vue/test-utils'

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
        this.$el
          .querySelector('.veui-select-button')
          .dispatchEvent(new Event('click'))

        setTimeout(() => {
          let options = document.body.querySelectorAll('.veui-option')
          expect(
            some(options[0].classList, item => item === 'veui-option-disabled')
          ).to.equal(true)
          expect(
            some(options[1].classList, item => item === 'veui-option-disabled')
          ).to.equal(false)
          document.body.innerHTML = ''
          done()
        })
      },
      template: `<veui-select :options="options"></veui-select>`
    })
  })

  it('should handle disabled prop of OptionGroup correctly', () => {
    let wrapper = mount({
      components: {
        'veui-select': Select
      },
      data () {
        return {
          options: [
            {
              label: 'a',
              value: 'a'
            },
            {
              label: 'b',
              disabled: true,
              options: [
                {
                  label: 'c',
                  value: 'c'
                },
                {
                  label: 'd',
                  value: 'd'
                }
              ]
            }
          ]
        }
      },
      template: '<veui-select :options="options"/>'
    })
    let disabledWrappers = wrapper.findAll('.veui-option-disabled')
    expect(disabledWrappers.length).to.equal(2)
    wrapper.destroy()
  })

  it('should not open subMenu if disabled prop of OptionGroup is true', async () => {
    let wrapper = mount({
      components: {
        'veui-select': Select
      },
      data () {
        return {
          options: [
            {
              label: 'a',
              position: 'popup',
              options: [
                {
                  label: 'e',
                  value: 'e'
                }
              ]
            },
            {
              label: 'b',
              disabled: true,
              position: 'popup',
              options: [
                {
                  label: 'c',
                  value: 'c'
                },
                {
                  label: 'd',
                  value: 'd'
                }
              ]
            }
          ]
        }
      },
      template: '<veui-select :options="options"/>'
    })
    let controlButton = wrapper.find('.veui-select-button')
    controlButton.trigger('click')
    await wrapper.vm.$nextTick()
    let options = wrapper.findAll('.veui-option')
    let command = wrapper.findAll('.veui-option-group-button')
    let menus = wrapper.findAll('.veui-option-group-box')
    expect(options.length).to.equal(3)
    command.wrappers[1].trigger('click')

    expect(menus.wrappers[1].element.style.display).to.equal('none')
    command.wrappers[0].trigger('click')
    expect(menus.wrappers[0].element.style.display).to.equal('')
    wrapper.destroy()
  })
})
