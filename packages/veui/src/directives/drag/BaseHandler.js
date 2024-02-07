export default class BaseHandler {
  options = {}

  context = null

  isDragging = false

  constructor (options, context, vnode) {
    this.setOptions(options)
    this.context = context
    this.vnode = vnode
  }

  ready () {}

  start () {
    this.isDragging = true
  }

  drag () {
    throw new Error('[v-drag] `drag` method must be implemented.')
  }

  end () {
    this.isDragging = false
  }

  destroy () {
    throw new Error('[v-drag] `destroy` method must be implemented.')
  }

  setOptions (options) {
    if (this.isDragging) {
      throw new Error('[v-drag] Do not set `options` while dragging.')
    }
    this.options = options
  }

  reset () {
    throw new Error('[v-drag] `reset` method must be implemented.')
  }
}
