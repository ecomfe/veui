import { mount } from '@vue/test-utils'
import sinon from 'sinon'
import Input from '@/components/Input'
import NumberInput from '@/components/NumberInput'

describe('components/NumberInput', () => {
  it('should handle value prop with `null` value.', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        value: null
      }
    })

    let changeHandler = sinon.spy()
    wrapper.vm.$on('change', changeHandler)
    wrapper.find('input').trigger('change')

    await wrapper.vm.$nextTick()
    expect(changeHandler.callCount).to.be.equal(0)
  })

  it('should transparently pass-through attrs to the <input> element.', () => {
    let wrapper = mount(NumberInput, {
      attrs: {
        autofocus: '',
        selectOnFocus: ''
      }
    })

    expect(wrapper.find(Input).props('selectOnFocus')).to.be.equal(true)
    expect(wrapper.find('input').element.autofocus).to.be.equal(true)
  })
})
