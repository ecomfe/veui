import { mount } from '@vue/test-utils'
import CheckboxGroup from '@/components/CheckboxGroup'

describe('components/CheckboxGroup', () => {
  it('should handle items prop correctly', () => {
    const wrapper = mount(CheckboxGroup, {
      propsData: {
        items: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c', disabled: true }
        ],
        value: ['a']
      }
    },
    {
      sync: false
    })

    let boxes = wrapper.findAll('input[type="checkbox"]')
    expect(boxes.length).to.be.equal(3)
    expect(boxes.at(0).element.checked).to.be.equal(true)
    expect(boxes.at(1).element.checked).to.be.equal(false)

    expect(boxes.at(2).element.checked).to.be.equal(false)
    expect(boxes.at(2).element.disabled).to.be.equal(true)

    wrapper.destroy()
  })

  it('should handle checked prop with `null` value.', done => {
    const wrapper = mount({
      components: {
        'veui-checkbox-group': CheckboxGroup
      },
      data () {
        return {
          items: [
            { label: 'A', value: 'A' },
            { label: 'B', value: 'B' }
          ],
          checked: null
        }
      },
      methods: {
        handleChange (val) {
          expect(val).to.deep.equal(['A'])
          expect(this.checked).to.deep.equal(['A'])

          done()
        }
      },
      template: '<veui-checkbox-group v-model="checked" :items="items" @change="handleChange"/>'
    },
    {
      sync: false
    })

    wrapper.findAll('input[type="checkbox"]').at(0).trigger('change')
  })
})
