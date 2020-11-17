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
      localVue
    })

    expect(vm.dropdownId).to.include('veui-dropdown-')
    /* eslint-disable no-unused-expressions */
    expect(vm.expanded).to.false
  })

  it('should activate dropdown component', async () => {
    const { vm } = shallowMount(DropdownComponent, {
      localVue
    })

    vm.activate()

    await vm.$nextTick()

    /* eslint-disable no-unused-expressions */
    expect(vm.expanded).to.true
  })

  it('should inactivate dropdown component', async () => {
    const { vm } = shallowMount(DropdownComponent, {
      localVue
    })

    vm.close()

    await vm.$nextTick()

    /* eslint-disable no-unused-expressions */
    expect(vm.expanded).to.false
  })

  it('should not expand dropdown', async () => {
    const wrapper = shallowMount(DropdownComponent, {
      localVue
    })

    wrapper.setData({
      realDisabled: true
    })

    wrapper.vm.activate()

    await wrapper.vm.$nextTick()

    /* eslint-disable no-unused-expressions */
    expect(wrapper.vm.expanded).to.false
  })
})
