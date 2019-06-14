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

  it('should implement `removeComponent` frunction correctly', () => {
    let component = dialog.create()

    expect(dialog.components.length).to.equal(2)

    dialog.removeComponent(component)

    expect(dialog.components.length).to.equal(1)
  })

  it('should implement `show` frunction correctly', () => {
    let result = dialog.show('Content', 'Title', { open: true })

    expect(result).to.deep.equal({
      title: 'Title',
      content: 'Content',
      open: true
    })
  })

  it('should implement `success` frunction correctly', () => {
    let result = dialog.success('Content', 'Title', { open: true })

    expect(result).to.deep.equal({
      title: 'Title',
      content: 'Content',
      open: true,
      type: 'success'
    })
  })

  it('should implement `info` frunction correctly', () => {
    let result = dialog.info('Content', 'Title', { open: true })

    expect(result).to.deep.equal({
      title: 'Title',
      content: 'Content',
      open: true,
      type: 'info'
    })
  })

  it('should implement `error` frunction correctly', () => {
    let result = dialog.error('Content', 'Title', { open: true })

    expect(result).to.deep.equal({
      title: 'Title',
      content: 'Content',
      open: true,
      type: 'error'
    })
  })

  it('should implement `warn` frunction correctly', () => {
    let result = dialog.warn('Content', 'Title', { open: true })

    expect(result).to.deep.equal({
      title: 'Title',
      content: 'Content',
      open: true,
      type: 'warning'
    })
  })
})
