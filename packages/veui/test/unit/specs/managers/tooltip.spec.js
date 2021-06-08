import { createTooltipManager } from '@/managers/tooltip'
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
})
