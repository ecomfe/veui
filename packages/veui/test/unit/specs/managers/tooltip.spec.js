import { createTooltipManager } from '@/managers/tooltip'
import config from '@/managers/config'
import { getPortalEntry } from '@/utils/dom'
import { expectTooltip, wait } from '../../../utils'

describe('managers/tooltip', () => {
  it('should respect warmup and cooldown', async () => {
    const manager = createTooltipManager({ warmup: 200, cooldown: 300 })
    const el = document.createElement('div')
    const other = document.createElement('div')

    manager.enter(el, { content: 'Hi' })
    await wait(100)
    expectTooltip(null)

    manager.leave() // should cancel
    await wait(150)
    expectTooltip(null)

    manager.enter(el, { content: 'Hi' })
    await wait(100)
    expectTooltip(null)

    await wait(150)
    // active
    expectTooltip('Hi')

    manager.leave()
    await wait(250)
    expectTooltip(false)

    manager.enter(other, { content: 'Hey' })
    await wait(0)
    expectTooltip('Hey')

    manager.leave()
    await wait(350)
    expectTooltip(null)

    manager.destroy()
  })

  it('should handle ignore invalid usage', async () => {
    const warmup = config.get('tooltip.warmup')

    const manager = createTooltipManager()
    const el = document.createElement('div')

    manager.enter(null, { content: 'Hi' })
    await wait(warmup + 50)
    expectTooltip(null)

    manager.enter(el, {})
    await wait(warmup + 50)
    expectTooltip(null)

    manager.leave()

    manager.destroy()
  })

  it('should be safely destroyed', async () => {
    const manager = createTooltipManager({ warmup: 100 })
    const el = document.createElement('div')

    manager.enter(el, { content: 'Hi' })
    await wait(150)
    expectTooltip('Hi')

    const entry = getPortalEntry(document.querySelector('.veui-tooltip'))
    entry.remove()

    manager.destroy()
    expectTooltip(null)
  })

  it('should respect reactive content', async () => {
    const manager = createTooltipManager({ warmup: 100 })
    const el = document.createElement('div')

    manager.enter(el, { content: 'Hi' })
    await wait(150)
    expectTooltip('Hi')

    manager.update({ content: 'Hey' })
    await wait(0)
    expectTooltip('Hey')

    manager.destroy()
  })
})
