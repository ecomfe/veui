import { mount } from '@vue/test-utils'
import nudge from '@/directives/nudge'
import config from '@/managers/config'

let DEFAULT_STEP = config.get('nudge.step')

describe('directives/nudge', () => {
  it(`should callback with step ${DEFAULT_STEP} upon keydown by default`, async () => {
    let updated = []
    let wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge="handler">foo</div>`,
      methods: {
        handler (val) {
          updated.push(val)
        }
      }
    })
    wrapper.trigger('keydown', {
      key: 'Foo'
    })
    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })
    wrapper.trigger('keydown', {
      key: 'Up',
      altKey: true
    })
    wrapper.trigger('keydown', {
      key: 'Down',
      altKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowUp',
      shiftKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowDown',
      shiftKey: true
    })

    await wrapper.vm.$nextTick()

    expect(updated).to.deep.equal([1, -1, 0.1, -0.1, 10, -10])
  })

  it(`should callback with specified step value upon keydown by default`, async () => {
    let updated = []
    let wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge="{
          update: handler,
          step: 10
        }">foo</div>`,
      methods: {
        handler (val) {
          updated.push(val)
        }
      }
    })
    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })
    wrapper.trigger('keydown', {
      key: 'ArrowDown'
    })
    wrapper.trigger('keydown', {
      key: 'ArrowUp',
      altKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowDown',
      altKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowUp',
      shiftKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowDown',
      shiftKey: true
    })

    await wrapper.vm.$nextTick()

    expect(updated).to.deep.equal([10, -10, 1, -1, 100, -100])
  })

  it(`should be able to specify axis`, async () => {
    let updated = []
    let wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge.x="handler">foo</div>`,
      methods: {
        handler (val) {
          updated.push(val)
        }
      }
    })
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })
    wrapper.trigger('keydown', {
      key: 'ArrowLeft'
    })
    wrapper.trigger('keydown', {
      key: 'Right',
      altKey: true
    })
    wrapper.trigger('keydown', {
      key: 'Left',
      altKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowRight',
      shiftKey: true
    })
    wrapper.trigger('keydown', {
      key: 'ArrowLeft',
      shiftKey: true
    })

    await wrapper.vm.$nextTick()

    expect(updated).to.deep.equal([1, -1, 0.1, -0.1, 10, -10])
  })

  it('should clear up correctly', () => {
    let wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge="handler">foo</div>`,
      methods: {
        handler () {}
      }
    })

    wrapper.destroy()
    expect(wrapper.element.__nudgeData__).to.be.equal(null)
  })

  it('should handle dynamic options correctly', async () => {
    let updated = []
    let wrapper = mount({
      directives: { nudge },
      template: `<div v-nudge="{
          update: handler,
          axis
        }">foo</div>`,
      data () {
        return {
          axis: 'y'
        }
      },
      methods: {
        handler (val) {
          updated.push(val)
        }
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()
    expect(updated).to.deep.equal([1])

    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    await wrapper.vm.$nextTick()
    expect(updated).to.deep.equal([1])

    wrapper.vm.axis = 'x'

    await wrapper.vm.$nextTick()
    wrapper.trigger('keydown', {
      key: 'ArrowRight'
    })

    await wrapper.vm.$nextTick()
    expect(updated).to.deep.equal([1, 1])

    wrapper.trigger('keydown', {
      key: 'ArrowUp'
    })

    await wrapper.vm.$nextTick()
    expect(updated).to.deep.equal([1, 1])
  })
})
