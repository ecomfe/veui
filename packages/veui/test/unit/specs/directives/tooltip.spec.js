import { expectTooltip, mount, wait } from '../../../utils'
import Button from '@/components/Button'
import tooltip from '@/directives/tooltip'
import tooltipManager from '@/managers/tooltip'
import config from '@/managers/config'

describe('directives/tooltip', function () {
  this.timeout(10000)

  it('should respect globally configured warmup and cooldown', async () => {
    let warmup = config.get('tooltip.warmup')
    let cooldown = config.get('tooltip.cooldown')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center">
            <div class="a" v-tooltip="'Hi'">A</div>
            <div class="b" v-tooltip="{ content: 'Hey' }">B</div>
            <div class="c" v-tooltip>Hola</div>
          </div>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let a = wrapper.find('.a')
    let b = wrapper.find('.b')
    let c = wrapper.find('.c')

    a.trigger('mouseenter')

    await wait(warmup - 100)
    expectTooltip(null)

    a.trigger('mouseleave') // should cancel
    await wait(150)
    expectTooltip(null)

    a.trigger('mouseenter')
    await wait(warmup - 100)
    expectTooltip(null)

    await wait(150)
    // active
    expectTooltip('Hi')

    a.trigger('mouseleave')
    await wait(cooldown - 100)
    expectTooltip(false)

    b.trigger('mouseenter')
    await wait(0)
    expectTooltip('Hey')

    b.trigger('mouseleave')
    c.trigger('mouseenter')
    await wait(0)
    expectTooltip('Hola')

    c.trigger('mouseleave')
    await wait(cooldown + 50)
    expectTooltip(null)

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should work with dynamic disabled option', async () => {
    let warmup = config.get('tooltip.warmup')
    let cooldown = config.get('tooltip.cooldown')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center">
            <div class="a" v-tooltip="{ content: 'Hi', disabled }">A</div>
          </div>`,
        data () {
          return {
            disabled: false
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let a = wrapper.find('.a')

    a.trigger('mouseenter')

    await wait(warmup + 50)
    expectTooltip('Hi')

    a.trigger('mouseleave')
    await wait(cooldown + 50)
    expectTooltip(null)

    wrapper.vm.disabled = true
    await wait(0)

    a.trigger('mouseenter')
    await wait(warmup + 50)
    expectTooltip(null)

    a.trigger('mouseleave')
    await wait(50)
    expectTooltip(null)

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should work with dynamic position option', async () => {
    let warmup = config.get('tooltip.warmup')
    let cooldown = config.get('tooltip.cooldown')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center">
            <div class="a" v-tooltip="{ content: 'Hi', position }">A</div>
          </div>`,
        data () {
          return {
            position: 'top'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let a = wrapper.find('.a')

    a.trigger('mouseenter')

    await wait(warmup + 50)
    expectTooltip('Hi', 'top')

    a.trigger('mouseleave')
    await wait(cooldown + 50)
    expectTooltip(null)

    wrapper.vm.position = 'right-end'
    await wait(0)

    a.trigger('mouseenter')
    await wait(warmup + 50)
    expectTooltip('Hi', 'right-end')

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should close correctly when target is destroyed', async () => {
    let warmup = config.get('tooltip.warmup')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center">
            <div class="a" v-if="a" key="a" v-tooltip="'Hi'">A</div>
          </div>`,
        data () {
          return {
            position: 'top',
            a: true,
            b: true
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    const { vm } = wrapper
    let a = wrapper.find('.a')

    a.trigger('mouseenter')

    await wait(warmup + 50)
    expectTooltip('Hi', 'top')

    vm.a = false
    await vm.$nextTick()
    await wait(0)
    expectTooltip(null)

    vm.a = true
    await vm.$nextTick()
    a = wrapper.find('.a')
    a.trigger('mouseenter')
    await wait(warmup + 50)
    expectTooltip('Hi', 'top')

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should respect `overflow` modifier', async () => {
    let warmup = config.get('tooltip.warmup')
    let cooldown = config.get('tooltip.cooldown')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center">
            <div class="a" style="width: 30px; overflow: hidden; white-space: nowrap"
              v-tooltip.overflow="'Hi'"
            >ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
            <div class="b" style="width: 30px; overflow: hidden; white-space: nowrap"
              v-tooltip.overflow="'Hi'"
            >B</div>
          </div>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let a = wrapper.find('.a')
    let b = wrapper.find('.b')

    a.trigger('mouseenter')

    await wait(warmup - 100)
    expectTooltip(null)

    a.trigger('mouseleave') // should cancel
    await wait(150)
    expectTooltip(null)

    a.trigger('mouseenter')
    await wait(warmup - 100)
    expectTooltip(null)

    await wait(150)
    // active
    expectTooltip('Hi')

    a.trigger('mouseleave')
    await wait(cooldown - 100)
    expectTooltip(false)

    b.trigger('mouseenter')
    await wait(0)
    expectTooltip(false)

    await wait(150)
    expectTooltip(null)

    b.trigger('mouseleave')
    await wait(cooldown + 50)
    expectTooltip(null)

    b.trigger('mouseenter')
    await wait(warmup + 100)

    expectTooltip(null)

    b.trigger('mouseleave')
    a.trigger('mouseenter')
    await wait(warmup - 100)
    expectTooltip(null)

    await wait(200)
    expectTooltip('Hi')

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should respect reactive content', async () => {
    let warmup = config.get('tooltip.warmup')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div>
            <div class="a" v-tooltip="contentA">A</div>
            <div class="b" v-tooltip="contentB">B</div>
          </div>`,
        data () {
          return {
            contentA: 'Hi',
            contentB: 'Hey'
          }
        }
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let a = wrapper.find('.a')

    a.trigger('mouseenter')
    await wait(warmup + 50)
    expectTooltip('Hi')

    wrapper.setData({ contentA: 'Bye' })
    await wait(0)
    expectTooltip('Bye')

    wrapper.setData({ contentB: 'See you' })
    await wait(0)
    expectTooltip('Bye')

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should respect the theme of the closest component', async () => {
    let warmup = config.get('tooltip.warmup')

    let wrapper = mount(
      {
        directives: { tooltip },
        components: {
          'veui-button': Button
        },
        template: `
          <veui-button theme="ai">
            <span class="a" v-tooltip="'Hi'">A</span>
          </veui-button>`
      },
      {
        sync: false,
        attachToDocument: true
      }
    )

    let a = wrapper.find('.a')

    a.trigger('mouseenter')
    await wait(warmup + 50)
    expectTooltip('Hi', (tooltip) => {
      expect(tooltip.matches('.veui-ai-tooltip-box')).to.equal(true)
    })

    wrapper.destroy()
  })
})
