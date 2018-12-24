import warn from '../utils/warn'

export default {
  created () {
    if (typeof this.activate !== 'function') {
      warn('Method [activate] must be implemented for activatable components.', this)
    }
  }
}
