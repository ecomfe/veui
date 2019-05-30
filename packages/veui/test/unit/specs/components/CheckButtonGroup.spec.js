import { mount } from '@vue/test-utils'
import CheckButtonGroup from '@/components/CheckButtonGroup'

describe('components/CheckButtonGroup', () => {
  it('should handle items prop correctly with slot', () => {
    const wrapper = mount(CheckButtonGroup, {
      propsData: {
        items: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b', disabled: true },
          { label: 'C', value: 'c' }
        ],
        value: ['a']
      }
    },
    {
      sync: false
    })

    let buttons = wrapper.findAll('button.veui-button')
    expect(buttons.length).to.be.equal(3)
    expect(buttons.at(0).classes('veui-button-selected')).to.be.equal(true)
    expect(buttons.at(1).classes('veui-button-selected')).to.be.equal(false)
    expect(buttons.at(1).element.disabled).to.be.equal(true)
    expect(buttons.at(2).classes('veui-button-selected')).to.be.equal(false)

    wrapper.destroy()
  })

  it('should handle change event correctly', done => {
    let wrapper = mount({
      components: {
        'veui-check-button-group': CheckButtonGroup
      },
      data () {
        return {
          items: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
            { label: 'C', value: 'c' }
          ],
          selected: []
        }
      },
      methods: {
        handleChange (value) {
          expect(value).to.deep.equal(['a'])
          expect(this.selected).to.deep.equal(['a'])

          wrapper.destroy()
          done()
        }
      },
      template: '<veui-check-button-group v-model="selected" :items="items" @change="handleChange"/>'
    },
    {
      sync: false
    })

    wrapper.findAll('button.veui-button').at(0).trigger('click')
  })
})
