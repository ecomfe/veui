<script>
import { prefixify } from '../mixins/prefix'
import '../common/global'

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
