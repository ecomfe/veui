import { mount } from '@vue/test-utils'
import Span from '@/components/Span'

describe('components/Span', () => {
  it('should support customized ui correctly.', async () => {
    let wrapper = mount(Span, {
      sync: false,
      propsData: {
        ui: 'large'
      }
    })

    expect(wrapper.attributes('ui')).to.equal('large')

    wrapper.setProps({ ui: 'micro' })
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('ui')).to.equal('micro')

    wrapper.setProps({ ui: 'small' })
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('ui')).to.equal('small')

    wrapper.setProps({ ui: 'tiny' })
    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('ui')).to.equal('tiny')

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
