export default {
  name: 'veui-element',
  props: {
    is: {
      type: String,
      default: 'div'
    }
  },
  render () {
    let Element = this.is
    return <Element>{ this.$slots.default || '' }</Element>
  }
}
