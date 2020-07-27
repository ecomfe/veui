<script>
import BreadcrumbItem from './BreadcrumbItem'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'

export default {
  name: 'veui-breadcrumb',
  mixins: [prefix, ui],
  props: {
    routes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    realRoutes () {
      if (this.routes && this.routes.length) {
        let routes = this.routes.map(i => ({ ...i }))

        // 默认将最后一个route的type设置为text
        const last = routes[routes.length - 1]
        if (!last.type) {
          last.type = 'text'
        }
        return routes
      }
      return []
    }
  },
  methods: {
    fireRedirect (event, route, index) {
      this.$emit('redirect', event, route, index)
    }
  },
  render () {
    return (
      <ol class={this.$c('breadcrumb')} role="navigation" ui={this.realUi}>
        {this.$slots.default ||
          this.realRoutes.map((route, index) => (
            <BreadcrumbItem
              to={route.to}
              replace={route.replace}
              type={route.type}
              native={route.native}
              onRedirect={event => this.fireRedirect(event, route, index)}
            >
              {this.$scopedSlots.item
                ? this.$scopedSlots.item({ route, ...route, index })
                : route.label || route.text}
              <template slot="separator">
                {this.$scopedSlots.separator
                  ? this.$scopedSlots.separator()
                  : this.$slots.separator}
              </template>
            </BreadcrumbItem>
          )) ||
          this.$slots.default}
      </ol>
    )
  }
}
</script>
