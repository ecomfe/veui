<script>
import BreadcrumbItem from './BreadcrumbItem'
import Icon from './Icon'
import '../icons'

export default {
  name: 'veui-breadcrumb',
  props: {
    routes: {
      type: Array,
      default () {
        return []
      }
    },

    /**
     * @deprecated
     **/
    routers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localRoutes: this.routes.length ? this.routes : this.routers
    }
  },
  watch: {
    routes (value) {
      this.localRoutes = value
      this.checkLocalRoutes()
    },
    routers (value) {
      this.localRoutes = value
      this.checkLocalRoutes()
    }
  },
  created () {
    this.checkLocalRoutes()
  },
  render () {
    return (
      <ul class="veui-breadcrumb">
        {this.$slots.default || this._l(this.localRoutes, (route, index) => {
          return (
            <BreadcrumbItem to={route.to}
              replace={route.replace}
              type={route.type}
              native={route.native}
              onRedirect={event => this.fireRedirect(event, route, index)}>
              {this.$scopedSlots.default({ route, router: route })}
              {
                index !== this.localRoutes.length - 1
                  ? <span slot="separator" class="veui-breadcrumb-separator">
                      {this.$scopedSlots.separator ? this.$scopedSlots.separator() : <Icon name="angle-right"></Icon>}
                    </span>
                  : null
              }
            </BreadcrumbItem>
          )
        })}
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

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-breadcrumb {
  .clearfix();
  margin: 0;
  padding: 0;
  list-style: none;
  color: @veui-text-color-weak;

  &-separator {
    padding: 0 8px;

    .veui-icon {
      vertical-align: middle;
    }
  }
}
</style>
