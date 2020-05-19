<script>
import { prefixify } from '../mixins/prefix'

export default {
  name: 'veui-span',
  uiTypes: ['transparent'],
  functional: true,
  render (h, { data, children }) {
    return h(
      'span',
      {
        ...data,
        class: {
          [prefixify('span')]: true
        }
      },
      children
    )
  }
}
</script>
