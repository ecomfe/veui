import { mount } from '@vue/test-utils'
import Steps from '@/components/Steps'
import Link from '@/components/Link'

let datasource = [
  { label: 'label 1', desc: 'desc 1', to: '/home' },
  { label: 'label 2', desc: 'desc 2', status: 'error' },
  { label: 'label 3', desc: 'desc 3' }
]

describe('components/Steps', () => {
  it('should handle steps prop with `null` value.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: null
      }
    })

    expect(wrapper.contains('.veui-steps')).to.equal(true)
    wrapper.destroy()
  })

  it('should render correctly according to the step status.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: datasource,
        current: 2
      }
    })

    let links = wrapper.findAll(Link)
    expect(links.at(0).classes('veui-steps-step-completed')).to.equal(true)
    expect(links.at(1).classes('veui-steps-step-error')).to.equal(true)
    expect(links.at(2).classes('veui-steps-step-current')).to.equal(true)

    wrapper.setProps({ current: 1 })

    expect(links.at(0).classes('veui-steps-step-completed')).to.equal(true)
    expect(links.at(1).classes('veui-steps-step-error-current')).to.equal(true)
    expect(links.at(2).classes('veui-steps-step-incomplete')).to.equal(true)
    wrapper.destroy()
  })

  it('should set prop `to` of links properly.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: datasource
      }
    })

    expect(wrapper.find(Link).props('to')).to.equal('/home')
    wrapper.destroy()
  })

  it('should render index slot.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: datasource
      },
      scopedSlots: {
        index:
          '<div class="test-index-slot" slot-scope="props">{{ props.index + 1 }}</div>'
      }
    })

    expect(wrapper.find('.test-index-slot').text()).to.equal('1')
    wrapper.destroy()
  })

  it('should render label slot.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: datasource
      }
    })

    expect(wrapper.find('.veui-steps-step-label').text()).to.equal('label 1')
    wrapper.destroy()
  })

  it('should render desc slot.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: datasource
      }
    })

    expect(wrapper.find('.veui-steps-step-desc').text()).to.equal('desc 1')
    wrapper.destroy()
  })

  it('should handle `click` correctly.', () => {
    let wrapper = mount(Steps, {
      propsData: {
        steps: datasource,
        current: 1
      }
    })

    wrapper
      .findAll(Link)
      .at(1)
      .trigger('click')
    expect(wrapper.emitted().click[0][0]).to.equal(1)
    wrapper.destroy()
  })
})
