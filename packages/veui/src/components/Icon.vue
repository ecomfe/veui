<script>
import FaIcon from 'vue-awesome/components/Icon'
import { prefixify } from '../mixins/prefix'

export default {
  ...FaIcon,
  name: 'veui-icon',
  data () {
    return {
      classes: {
        [prefixify('icon')]: true
      }
    }
  }
}
</script>
