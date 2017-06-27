import overlay from './managers/overlay'

export default {
  install (Vue, { baseZIndex = 100 } = {}) {
    overlay.setBaseZIndex(baseZIndex)
  }
}
