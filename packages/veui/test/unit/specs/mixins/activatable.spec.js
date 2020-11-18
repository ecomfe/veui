import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import activatable from '@/mixins/activatable'

const noop = function () {}

const localVue = createLocalVue()

const ActivatableComponent = {
  template: '<div>Activatable Component</div>',
  methods: {
    activate: noop
  },
  mixins: [activatable]
}

const InActivatableComponent = {
  template: '<div>InActivatable Component</div>',
  methods: {
    inactivate: noop
  },
  mixins: [activatable]
}

describe('mixins/activatable', () => {
  let msg
  beforeEach(() => {
    Vue.config.warnHandler = message => {
      msg = message
    }
  })

  afterEach(() => {
    Vue.config.warnHandler = undefined
    msg = undefined
  })

  it('should has `activate` method', () => {
    const { vm } = shallowMount(ActivatableComponent, {
      localVue
    })

    expect(vm.activate).to.be.a('function')
    expect(msg).to.be.undefined
  })

  it('should out warn that `activate` is not method', () => {
    const { vm } = shallowMount(InActivatableComponent, {
      localVue
    })

    expect(vm.activate).to.be.undefined
    expect(msg).to.not.be.undefined
  })
})
