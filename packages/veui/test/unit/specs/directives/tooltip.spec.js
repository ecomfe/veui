import { expectTooltip, mount, wait } from '../../../utils'
import tooltip from '@/directives/tooltip'
import tooltipManager from '@/managers/tooltip'
import config from '@/managers/config'

describe('directives/tooltip', () => {
  it('should respect globally configured warmup and cooldown', async function () {
    this.timeout(5000)
    let warmup = config.get('tooltip.warmup')
    let cooldown = config.get('tooltip.cooldown')

    let wrapper = mount(
      {
        directives: { tooltip },
        template: `
          <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center">
            <div class="a" v-tooltip="'Hi'">A</div>
            <div class="b" v-tooltip="{ content: 'Hey' }">B</div>
          </div>`
      },
      {
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
    expectTooltip('Hey')

    b.trigger('mouseleave')
    await wait(cooldown + 50)
    expectTooltip(null)

    tooltipManager.destroy()

    wrapper.destroy()
  })

  it('should work with dynamic disabled option', async function () {
    this.timeout(5000)
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

  it('should work with dynamic position option', async function () {
    this.timeout(5000)
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
})
