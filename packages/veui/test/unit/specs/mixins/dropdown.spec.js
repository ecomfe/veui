import { createLocalVue, shallowMount } from '@vue/test-utils'
import dropdown from '@/mixins/dropdown'

const localVue = createLocalVue()

const DropdownComponent = {
  template: '<div><div ref="box">dropdown child</div></div>',
  data () {
    return {
      realDisabled: false,
      realReadonly: false
    }
  },
  mixins: [dropdown]
}

describe('mixins/dropdown', () => {
  it('should apply dropdown mixins', () => {
    const { vm } = shallowMount(DropdownComponent, {
      localVue,
      propsData: {
        expanded: false
      }
    })

    expect(vm.dropdownId).to.include('veui-dropdown-')
  })

  it('should activate dropdown component', async () => {
    const wrapper = shallowMount(DropdownComponent, {
      localVue,
      propsData: {
        expanded: false
      }
    })

    wrapper.vm.activate()

    await wrapper.vm.$nextTick()

    /* eslint-disable no-unused-expressions */
    expect(wrapper.emitted().toggle.length).to.equal(1)
  })

  it('should inactivate dropdown component', async () => {
    const wrapper = shallowMount(DropdownComponent, {
      localVue,
      propsData: {
        expanded: true
      }
    })

    wrapper.vm.close()

    await wrapper.vm.$nextTick()

    /* eslint-disable no-unused-expressions */
    expect(wrapper.emitted().toggle.length).to.equal(1)
  })

  it('should not expand dropdown', async () => {
    const wrapper = shallowMount(DropdownComponent, {
      localVue,
      propsData: {
        expanded: false
      }
    })

    wrapper.setData({
      realDisabled: true
    })

    wrapper.vm.activate()

    await wrapper.vm.$nextTick()

    /* eslint-disable no-unused-expressions */
    expect(wrapper.emitted().toggle).to.be.undefined
  })
})
