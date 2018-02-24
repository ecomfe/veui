<script>
import BreadcrumbItem from './BreadcrumbItem'
import Icon from './Icon'
import icons from '../mixins/icons'

export default {
  name: 'veui-breadcrumb',
  mixins: [icons],
  props: {
    routes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localRoutes: [...this.routes]
    }
  },
  watch: {
    routes (value) {
      this.localRoutes = value
      this.checkLocalRoutes()
    }
  },
  created () {
    this.checkLocalRoutes()
  },
  render () {
    return (
      <ul class="veui-breadcrumb" role="navigation">
        {this.$slots.default || this.localRoutes.map((route, index) => (
          <BreadcrumbItem to={route.to}
            replace={route.replace}
            type={route.type}
            native={route.native}
            onRedirect={event => this.fireRedirect(event, route, index)}>
            {this.$scopedSlots.default ? this.$scopedSlots.default({ route }) : (route.label || route.text)}
            {
              index !== this.localRoutes.length - 1
                ? <span slot="separator" class="veui-breadcrumb-separator">
                  {this.$scopedSlots.separator ? this.$scopedSlots.separator() : <Icon name={this.icons.next}></Icon>}
                </span>
                : null
            }
          </BreadcrumbItem>
        ))}
      </ul>
    )
  },
  methods: {

    /**
     * 默认将最后一个route的type设置为text
     */
    checkLocalRoutes () {
      if (this.localRoutes.length) {
        const last = this.localRoutes[this.localRoutes.length - 1]
        if (!last.type) {
          last.type = 'text'
        }
      }
    },

    fireRedirect (event, route, index) {
      this.$emit('redirect', event, route, index)
    }
  }
}
</script>
