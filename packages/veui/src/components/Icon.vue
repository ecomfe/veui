<script>
import FaIcon from 'vue-awesome/components/Icon'
import prefix from '../mixins/prefix'

export default {
  ...FaIcon,
  name: 'veui-icon',
  mixins: [prefix],
  computed: {
    ...FaIcon.computed,
    klass () {
      return {
        'fa-icon': true,
        'fa-spin': this.spin,
        'fa-flip-horizontal': this.flip === 'horizontal',
        'fa-flip-vertical': this.flip === 'vertical',
        'fa-inverse': this.inverse,
        'fa-pulse': this.pulse,
        [this.$c('icon')]: true
      }
    }
  }
}
</script>
