import { createLocalVue, shallowMount } from '@vue/test-utils'
import activatable from '@/mixins/activatable'

const noop = function () {}

const localVue = createLocalVue()

localVue.use(activatable)

const ActivatableComponent = {
  template: '<div>Activatable Component</div>',
  methods: {
    activate: noop
  }
}

const InActivatableComponent = {
  template: '<div>InActivatable Component</div>',
  methods: {
    inactivate: noop
  }
}

describe('mixins/activatable', () => {
  it('should has `activate` method', () => {
    const { vm } = shallowMount(ActivatableComponent, {
      localVue
    })

    expect(vm.activate).to.be.a('function')
  })

  it('should out warn that `activate` is not method', () => {
    const { vm } = shallowMount(InActivatableComponent, {
      localVue
    })

    expect(vm.activate).to.be.a('undefined')
  })
})
