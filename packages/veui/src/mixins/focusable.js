import warn from '../utils/warn'

export default {
  created () {
    if (
      process.env.NODE_ENV !== 'production' &&
      typeof this.focus !== 'function'
    ) {
      warn('Method [focus] must be implemented for focusable components.', this)
    }
  }
}
