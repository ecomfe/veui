import { FocusManager } from '@/managers/focus'
import { wait } from '../../../utils'

describe('managers/focus', function () {
  this.timeout(10000)

  it('should create FocusContext correctly', async () => {
    let focus = new FocusManager()

    let root = document.createElement('div')
    document.body.appendChild(root)

    root.innerHTML = `
      <div id="dialog-1">
        <input id="input-1-1">
        <input id="input-1-2">
        <span id="span-1-3"><input id="input-1-3"></span>
      </div>
      <div id="dialog-2">
        <input id="input-2-1">
        <input id="input-2-2">
        <input id="input-2-3">
      </div>
      <div tabindex="0" id="dialog-3"></div>
    `

    let dialog1 = root.querySelector('#dialog-1')
    let dialog2 = root.querySelector('#dialog-2')
    let dialog3 = root.querySelector('#dialog-3')
    let input11 = root.querySelector('#input-1-1')
    let input12 = root.querySelector('#input-1-2')
    let input13 = root.querySelector('#input-1-3')
    let span13 = root.querySelector('#span-1-3')
    let input21 = root.querySelector('#input-2-1')
    let input22 = root.querySelector('#input-2-2')
    let input23 = root.querySelector('#input-2-3')

    let ctx1 = focus.createContext(dialog1, { preferred: span13 })
    await wait(50)
    expect(document.activeElement).to.equal(input13)

    let ctx2 = focus.createContext(dialog2, { source: input12, trap: true })
    await wait(50)
    expect(document.activeElement).to.equal(input21)

    input21.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
    )
    await wait(50)
    expect(document.activeElement).to.equal(input23)

    input22.focus()
    input22.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
    )
    await wait(50)
    expect(document.activeElement).to.equal(input22)

    input22.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    await wait(50)
    expect(document.activeElement).to.equal(input22)

    let ctx3 = focus.createContext(dialog3, { trap: true, source: input22 })
    dialog3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wait(50)
    expect(document.activeElement).to.equal(dialog3)

    dialog3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    await wait(50)
    expect(document.activeElement).to.equal(dialog3)

    dialog3.dispatchEvent(new MouseEvent('mousedown'))
    focus.remove(ctx3)
    input23.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    await wait(50)
    expect(document.activeElement).to.equal(input21)

    focus.remove(ctx2)
    await wait(50)
    expect(document.activeElement).to.equal(input12)

    focus.remove(ctx1)
    await wait(50)
    expect(document.activeElement).to.equal(input12)

    let ctx4 = focus.createContext(dialog1, { source: input21 })
    let ctx5 = focus.createContext(dialog2, { source: input11 })
    let ctx6 = focus.createContext(dialog1, { source: input22 })

    input23.focus()
    ctx4.toTop()
    focus.remove(ctx4)
    await wait(50)
    expect(document.activeElement).to.equal(input11)

    focus.remove(ctx5)
    await wait(50)
    expect(document.activeElement).to.equal(input11)

    focus.remove(ctx6)
    await wait(50)
    expect(document.activeElement).to.equal(input21)

    let other = new FocusManager()
    let ctx7 = other.createContext(dialog3)
    focus.remove(ctx7)
    other.remove(ctx7)

    expect(() => {
      other.createContext()
    }).to.throw('Root must be specified to create a FocusContext instance.')

    document.body.removeChild(root)
  })
})
