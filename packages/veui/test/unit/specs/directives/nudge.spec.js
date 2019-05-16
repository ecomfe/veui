import { mount } from '@vue/test-utils'
import nudge from '@/directives/nudge'
import config from '@/managers/config'

const DEFAULT_STEP = config.get('nudge.step')

describe('directives/nudge', () => {
  it(`should callback with step ${DEFAULT_STEP} upon keydown by default`, done => {
    let updated = []
    const wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge="handler">foo</div>`,
      methods: {
        handler (val) {
          updated.push(val)

          if (updated.length === 6) {
            expect(updated).toEqual([1, -1, 0.1, -0.1, 10, -10])
            done()
          }
        }
      }
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowUp'
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowDown'
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowUp',
      altKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowDown',
      altKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowUp',
      shiftKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowDown',
      shiftKey: true
    })
  })

  it(`should callback with specified step value upon keydown by default`, done => {
    let updated = []
    const wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge="{
          update: handler,
          step: 10
        }">foo</div>`,
      methods: {
        handler (val) {
          updated.push(val)

          if (updated.length === 6) {
            expect(updated).toEqual([10, -10, 1, -1, 100, -100])
            done()
          }
        }
      }
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowUp'
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowDown'
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowUp',
      altKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowDown',
      altKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowUp',
      shiftKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowDown',
      shiftKey: true
    })
  })

  it(`should be able to specify axis`, done => {
    let updated = []
    const wrapper = mount({
      directives: { nudge },
      template: `<div tabindex="0" v-nudge.x="handler">foo</div>`,
      methods: {
        handler (val) {
          updated.push(val)

          if (updated.length === 6) {
            expect(updated).toEqual([1, -1, 0.1, -0.1, 10, -10])
            done()
          }
        }
      }
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowRight'
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowLeft'
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowRight',
      altKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowLeft',
      altKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowRight',
      shiftKey: true
    })
    wrapper.find('div').trigger('keydown', {
      key: 'ArrowLeft',
      shiftKey: true
    })
  })
})
