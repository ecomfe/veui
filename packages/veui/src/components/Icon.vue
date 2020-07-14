<script>
import FaIcon from 'vue-awesome/components/Icon'
import { prefixify } from '../mixins/prefix'

const {
  render,
  props: { name, ...props },
  ...options
} = FaIcon

export default {
  ...options,
  name: 'veui-icon',
  mixins: [
    {
      computed: {
        classes () {
          return {
            [prefixify('icon')]: true
          }
        }
      }
    }
  ],
  props: {
    name: {
      type: [Object, String],
      validator (val) {
        if (val && typeof val.render === 'function') {
          return true
        }
        return name.validator(val)
      }
    },
    ...props
  },
  mounted () {},
  updated () {},
  render (h) {
    if (typeof this.name === 'string') {
      return render.call(this, h)
    }

    const Icon = this.name
    return <Icon class={this.classes} spin={this.spin} />
  }
}
</script>
