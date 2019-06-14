import alert from '@/managers/alert'
import { wait } from '../../../utils'

describe('managers/alert', () => {
  it('should implement `createComponent` function correctly', async () => {
    let isClicked = false
    let component = alert.create({
      title: 'Title',
      content: 'Content',
      type: 'error',
      ok () {
        isClicked = true
      }
    })
    await component.$nextTick()
    let $children = component.$children[0]

    expect($children.open).to.equal(true)
    expect($children.title).to.equal('Title')
    expect($children.type).to.equal('error')
    expect($children.$slots.default[0].text).to.equal('Content')

    $children.$children[0].$children[0].$children[1].$emit('click')
    await component.$nextTick()

    expect(isClicked).to.equal(true)

    alert.removeComponent(component)
  })

  it('should implement `_show` function correctly', async () => {
    let isClicked = false
    alert.success('Content', 'Title', { open: true, ok () { isClicked = true } })
    await wait(0)

    expect(getEl('.veui-alert-box-title').innerText).to.equal('Title')
    expect(getEl('.veui-alert-box-content').innerText).to.equal('Content')

    getEl('.veui-dialog-content-foot').querySelector('.veui-button').dispatchEvent(new MouseEvent('click'))
    await wait(0)

    expect(isClicked).to.equal(true)
  })
})

function getEl (selector) {
  return document.querySelector(selector)
}
