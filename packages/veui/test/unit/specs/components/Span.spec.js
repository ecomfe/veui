import { mount } from '@vue/test-utils'
import Span from '@/components/Span'

describe('components/Span', () => {
  it('should support customized ui correctly.', async () => {
    let wrapper = mount(Span, {
      sync: false,
      propsData: {
        ui: 'l'
      }
    })

    expect(wrapper.attributes('ui')).to.equal('l')

    wrapper.setProps({ ui: 'xs' })
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('ui')).to.equal('xs')

    wrapper.destroy()
  })

  it('should render default slot correctly.', () => {
    let wrapper = mount(Span, {
      sync: false,
      slots: {
        default: '<a class="link" href="#">Link</a>'
      }
    })

    expect(wrapper.contains('a.link')).to.equal(true)
    wrapper.destroy()
  })
})
