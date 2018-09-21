<script>
import BreadcrumbItem from './BreadcrumbItem'
import ui from '../mixins/ui'

export default {
  name: 'veui-breadcrumb',
  mixins: [ui],
  components: {
    'veui-breadcrumb-item': BreadcrumbItem
  },
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
      <ol class="veui-breadcrumb" role="navigation">
        {
          this.$slots.default || this.localRoutes.map((route, index) => (
            <veui-breadcrumb-item to={route.to}
              replace={route.replace}
              type={route.type}
              native={route.native}
              onRedirect={event => this.fireRedirect(event, route, index)}>
              {
                this.$scopedSlots.default
                  ? this.$scopedSlots.default({ route, ...route, index })
                  : (route.label || route.text)
              }
              <template slot="separator">
                {
                  this.$scopedSlots.separator
                    ? this.$scopedSlots.separator()
                    : null
                }
              </template>
            </veui-breadcrumb-item>
          )) || this.$slots.default
        }
      </ol>
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
