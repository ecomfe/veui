export default class BaseHandler {

  options = {}

  context = null

  constructor (options, context) {
    this.options = options
    this.context = context
  }

  start () {}

  drag () {}

  end () {}

  destroy () {}
}
