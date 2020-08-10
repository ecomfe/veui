import { mount } from '@vue/test-utils'
import sinon from 'sinon'
import Input from '@/components/Input'
import NumberInput from '@/components/NumberInput'

describe('components/NumberInput', () => {
  it('should handle value prop with `null` value.', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        value: null
      },
      sync: false
    })

    let changeHandler = sinon.spy()
    wrapper.vm.$on('change', changeHandler)
    wrapper.find('input').trigger('change')

    await wrapper.vm.$nextTick()
    expect(changeHandler.callCount).to.equal(0)
  })

  it('should transparently pass-through attrs to the <input> element.', () => {
    let wrapper = mount(NumberInput, {
      attrs: {
        autofocus: '',
        selectOnFocus: ''
      },
      sync: false
    })

    expect(wrapper.find(Input).props('selectOnFocus')).to.equal(true)
    expect(wrapper.find('input').element.autofocus).to.equal(true)
  })

  it('should handle focus event correctly', async () => {
    let wrapper = mount(NumberInput)
    wrapper.find('input').trigger('focus')

    let { vm } = wrapper
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(true)

    wrapper.destroy()
  })

  it('disabled input should not be focused when activated', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        disabled: true
      },
      sync: false
    })

    let { vm } = wrapper
    vm.activate()
    await vm.$nextTick()

    expect(wrapper.find('div.veui-input').classes('veui-focus')).to.equal(false)

    wrapper.destroy()
  })

  it('should not exceed max or min value', async () => {
    let wrapper = mount(
      {
        components: {
          'veui-number-input': NumberInput
        },
        template: '<veui-number-input :min="1" :max="3" v-model="val"/>',
        data () {
          return {
            val: 2
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let up = wrapper.find('.veui-number-input-step-up')
    let down = wrapper.find('.veui-number-input-step-down')
    let input = wrapper.find('input').element

    up.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('3')
    up.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('3')

    down.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('2')
    down.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('1')
    down.trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.value).to.equal('1')

    wrapper.destroy()
  })

  it('should handle readonly correctly', () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        readonly: true
      },
      sync: false
    })

    let input = wrapper.find('input.veui-input-input')
    input.setValue(2)
    expect(input.attributes('readonly')).to.equal('readonly')

    expect(input.element.value).to.equal('2')
  })

  it('should handle step prop correctly', async () => {
    let wrapper = mount(
      NumberInput,
      {
        propsData: {
          step: 3
        }
      },
      {
        sync: false
      }
    )

    let input = wrapper.find('input.veui-input-input')
    wrapper.find('button.veui-number-input-step-up').trigger('click')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('3')
  })

  it('should handle `decimal-place` prop  correctly', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        decimalPlace: 2
      },
      sync: false
    })

    let input = wrapper.find('input.veui-input-input')
    input.setValue('2')
    wrapper.find('input').trigger('change')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('2.00')

    input.setValue('2.333')
    wrapper.find('input').trigger('change')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('2.33')
  })

  it('should handle change event', done => {
    let wrapper = mount(NumberInput, {
      sync: false
    })

    wrapper.vm.$on('change', val => {
      expect(val).equal(1)
      wrapper.destroy()
      done()
    })

    wrapper.find('button.veui-number-input-step-up').trigger('click')
  })

  it('should make prop `value` fully controlled and violate `decimal-place` for respecting prop `value`', async () => {
    let wrapper = mount(NumberInput, {
      propsData: {
        value: 2.123,
        decimalPlace: 2
      },
      sync: false
    })

    let input = wrapper.find('input.veui-input-input')
    expect(input.element.value).to.equal('2.123')

    input.setValue('2')
    wrapper.find('input').trigger('change')
    await wrapper.vm.$nextTick()
    expect(input.element.value).to.equal('2.123')
  })
})
