export default class BaseHandler {
  options = {}

  context = null

  isDragging = false

  constructor (options, context) {
    this.setOptions(options)
    this.context = context
  }

  start () {
    this.isDragging = true
  }

  drag () {
    throw new Error('`drag` method must be implemented.')
  }

  end () {
    this.isDragging = false
  }

  destroy () {
    throw new Error('`destroy` method must be implemented.')
  }

  setOptions (options) {
    if (this.isDragging) {
      throw new Error('Do not set `options` while dragging.')
    }
    this.options = options
  }

  reset () {
    throw new Error('`reset` method must be implemented.')
  }
}
