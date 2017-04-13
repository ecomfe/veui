<script>
import BreadcrumbItem from './BreadcrumbItem'

export default {
  name: 'veui-breadcrumb',
  props: {
    routers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localRouters: this.routers
    }
  },
  watch: {
    routers (value) {
      this.localRouters = value
      this.checkLocalRouters()
    }
  },
  created () {
    this.checkLocalRouters()
  },
  render () {
    function renderSlot (slotName, ...args) {
      if (this.$slots[slotName]) {
        return this.$slots[slotName]
      }
      if (this.$scopedSlots[slotName]) {
        return this.$scopedSlots[slotName](...args)
      }
    }

    return (
      <ul class="veui-breadcrumb">
        {this._l(this.localRouters, (router, index) => {
          return (
            <BreadcrumbItem to={router.to}
              replace={router.replace}
              type={router.type}
              native={router.native}
              onRedirect={event => this.fireRedirect(event, router, index)}>
              {renderSlot.call(this, 'default', { router })}
              {
                index !== this.localRouters.length - 1
                  ? <span class="veui-breadcrumb-separator">
                      {renderSlot.call(this, 'separator', { router })}
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
     * 默认将最后一个router的type设置为text
     */
    checkLocalRouters () {
      if (this.localRouters.length) {
        const lastRouter = this.localRouters[this.localRouters.length - 1]
        if (!lastRouter.type) {
          lastRouter.type = 'text'
        }
      }
    },

    fireRedirect (event, router, index) {
      this.$emit('redirect', event, router, index)
    }
  }
}
</script>

<style lang="less">
.veui-breadcrumb {
  padding: 0;
  margin: 0;
  list-style: none;
  .clearfix();
}

.veui-breadcrumb-separator {
  padding: 0 8px;
}
</style>
