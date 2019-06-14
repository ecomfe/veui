import Vue from 'vue'
import SimpleDialogManager from '@/managers/simple-dialog'
import { isType } from '@/utils/lang'

class Dialog extends SimpleDialogManager {
  _show (params) {
    return params
  }
}

let dialog = new Dialog()

describe('managers/simple-dialog', () => {
  it('should implement `createComponent` function correctly', () => {
    let component = dialog.createComponent()
    expect(isType(Vue, component)).to.equal(true)
  })

  it('should implement `create` function correctly', () => {
    dialog.create()

    expect(dialog.components.length).to.equal(1)
    expect(isType(Vue, dialog.components[0])).to.equal(true)
  })

  it('should implement `removeComponent` function correctly', () => {
    let component = dialog.create()

    expect(dialog.components.length).to.equal(2)

    dialog.removeComponent(component)

    expect(dialog.components.length).to.equal(1)
  })

  it('should implement `show` function correctly', () => {
    let result = dialog.show('Content', 'Title', { open: true })

    expect(result).to.deep.equal({
      title: 'Title',
      content: 'Content',
      open: true
    })
  })

  it('should implement contextual methods correctly', () => {
    ['success', 'info', 'error', 'warn'].forEach(type => {
      let result = dialog[type]('Content', 'Title', { open: true })
      expect(result).to.deep.equal({
        title: 'Title',
        content: 'Content',
        open: true,
        type: type === 'warn' ? 'warning' : type
      })
    })
  })
})
