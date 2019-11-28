import { mount } from '@vue/test-utils'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputGroup from '@/components/InputGroup'

describe('components/Span', () => {
  it('should render default slot correctly.', () => {
    let wrapper = mount(InputGroup, {
      sync: false,
      slots: {
        default: [Input, Button]
      }
    })

    expect(wrapper.contains('.veui-input')).to.equal(true)
    expect(wrapper.contains('.veui-button')).to.equal(true)
    wrapper.destroy()
  })
})
