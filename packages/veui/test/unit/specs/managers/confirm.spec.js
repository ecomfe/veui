import confirm from '@/managers/confirm'
import { wait } from '../../../utils'

describe('managers/confirm', () => {
  it('should implement `createComponent` function correctly', async () => {
    let isOk = false
    let isCancel = false
    let component = confirm.create({
      title: 'Title',
      content: 'Content',
      ok () {
        isOk = true
      },
      cancel () {
        isCancel = true
      }
    })
    await component.$nextTick()
    let confirmBox = component.$children[0]

    expect(confirmBox.open).to.equal(true)
    expect(getEl('.veui-dialog-content-head-title').innerText).to.equal('Title')
    expect(getEl('.veui-dialog-content-body').innerText).to.equal('Content')

    let buttons = getEl('.veui-dialog-content-foot').querySelectorAll(
      '.veui-button'
    )
    buttons[0].dispatchEvent(new MouseEvent('click'))
    await component.$nextTick()

    expect(isOk).to.equal(true)

    buttons[1].dispatchEvent(new MouseEvent('click'))
    await component.$nextTick()

    expect(isCancel).to.equal(true)

    confirm.removeComponent(component)
  })

  it('should implement `_show` function correctly', async () => {
    let isOk = false
    let isCancel = false
    confirm.show('Content', 'Title', {
      open: true,
      ok () {
        isOk = true
      },
      cancel () {
        isCancel = true
      }
    })
    await wait(0)

    expect(getEl('.veui-dialog-content-head-title').innerText).to.equal('Title')
    expect(getEl('.veui-dialog-content-body').innerText).to.equal('Content')

    let buttons = getEl('.veui-dialog-content-foot').querySelectorAll(
      '.veui-button'
    )
    buttons[0].dispatchEvent(new MouseEvent('click'))
    await wait(0)

    expect(isOk).to.equal(true)

    buttons[1].dispatchEvent(new MouseEvent('click'))
    await wait(0)

    expect(isCancel).to.equal(true)

    document.body.removeChild(getEl('.veui-confirm-box'))
  })
})

function getEl (selector) {
  return document.querySelector(selector)
}
