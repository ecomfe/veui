import prompt from '@/managers/prompt'
import { wait } from '../../../utils'

describe('managers/prompt', () => {
  it('should implement `createComponent` function correctly', async () => {
    let isOk = false
    let isCancel = false
    let component = prompt.create({
      title: 'Title',
      content: 'Content',
      ok (value) {
        expect(value).to.equal('123')
        isOk = true
      },
      cancel () {
        isCancel = true
      }
    })
    await component.$nextTick()
    let promptBox = component.$children[0]

    expect(promptBox.open).to.equal(true)
    expect(getEl('.veui-dialog-content-head-title').innerText).to.equal('Title')
    expect(getEl('.veui-prompt-box-info').innerText).to.equal('Content')

    let input = getEl('input')
    input.value = '123'
    input.dispatchEvent(new InputEvent('input'))
    await component.$nextTick()
    let buttons = getEl('.veui-dialog-content-foot').querySelectorAll(
      '.veui-button'
    )
    buttons[0].dispatchEvent(new MouseEvent('click'))
    await component.$nextTick()

    expect(isOk).to.equal(true)

    buttons[1].dispatchEvent(new MouseEvent('click'))
    await component.$nextTick()

    expect(isCancel).to.equal(true)

    prompt.removeComponent(component)
  })

  it('should implement `_show` function correctly', async () => {
    let isOk = false
    let isCancel = false
    prompt
      .show('Content', 'Title', {
        open: true,
        ok () {
          isOk = true
        },
        cancel () {
          isCancel = true
        }
      })
      .then(value => {
        expect(value).to.equal('123')
      })
    await wait(0)

    expect(getEl('.veui-dialog-content-head-title').innerText).to.equal('Title')
    expect(getEl('.veui-prompt-box-info').innerText).to.equal('Content')

    let input = getEl('input')
    input.value = '123'
    input.dispatchEvent(new InputEvent('input'))
    await wait(0)
    let buttons = getEl('.veui-dialog-content-foot').querySelectorAll(
      '.veui-button'
    )
    buttons[0].dispatchEvent(new MouseEvent('click'))
    await wait(0)

    expect(isOk).to.equal(true)

    buttons[1].dispatchEvent(new MouseEvent('click'))
    await wait(0)

    expect(isCancel).to.equal(true)

    document.body.removeChild(getEl('.veui-prompt-box'))
  })

  it('should handle async ok/cancel correctly', async () => {
    let prevent = true
    prompt.show('Content', 'Title', {
      open: true,
      async ok () {
        await wait(100)
        if (prevent) {
          return false
        }
      }
    })
    await wait(0)
    let buttons = getEl('.veui-dialog-content-foot').querySelectorAll(
      '.veui-button'
    )
    buttons[0].dispatchEvent(new MouseEvent('click'))

    await wait(500)

    expect(getEl('.veui-dialog-content-foot')).to.not.equal(null)
    prevent = false
    buttons[0].dispatchEvent(new MouseEvent('click'))

    await wait(500)

    expect(getEl('.veui-dialog-content-foot')).to.equal(null)
  })
})

function getEl (selector) {
  return document.querySelector(selector)
}
