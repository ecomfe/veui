<script>
export default {
  name: 'veui-tabs',
  uiTypes: ['tabs'],
  props: {
    ui: {
      type: String,
      default: 'default'
    },
    type: {
      type: String
    },
    active: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      tabs: [],
      localIndex: undefined,
      localActive: ''
    }
  },
  computed: {
    tabNames () {
      return this.tabs.map(item => item.name)
    }
  },
  render () {
    return (
      <div class="veui-tabs" ui={this.ui}>
        <div class="veui-tabs-menu">
          <ul class="veui-tabs-list">
            {
              this._l(this.tabs, (tab, index) => (
                <li onClick={ $event => this.setActive({ name: tab.name, index }) } class={{
                  'veui-tabs-item': true,
                  'veui-tabs-active': index === this.localIndex
                }}>{ tab.label }</li>
              ))
            }
          </ul>
        </div>
        <div class="veui-tabs-panel">
          { this.$slots.default }
        </div>
      </div>
    )
  },
  methods: {
    add (tab) {
      this.tabs.push(tab)
    },

    setActive ({active, index}) {
      let values = this.tabNames

      this.localIndex = index !== undefined ? index : values.indexOf(active)
      this.localActive = active !== undefined ? active : values[index]

      this.$emit('update:active', this.localActive)
      this.$emit('update:index', this.localIndex)
    },

    init () {
      let values = this.tabNames
      let { active, index } = this.$props

      if (!values.length) return

      if (active !== undefined) {
        // if active and index are set at same time
        if (index !== undefined && active !== values[index]) {
          this.$utils.warn(`[tabs]active name is not correct`)
        } else {
          this.setActive({ active })
        }
        return
      }

      if (index !== undefined) {
        if (index < 0 || index > values.length - 1) {
          this.$utils.warn(`[tabs] index should between 0 to ${values.length}`)
        } else {
          this.setActive({ index })
        }
      }
    }
  },
  watch: {
    active (val) {
      this.setActive({
        active: val
      })
    },
    index (val) {
      this.setActive({
        index: val
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-tabs {

  &-menu {
    position: relative;
    margin-bottom: -1px;
  }

  &-list {
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  &-item {
    list-style: none;
    color: @veui-gray-color-normal;
    float: left;
    text-align: center;
    padding: 0 25px;
    font-size: 14px;
    line-height: 36px;
    height: 36px;
    border: 1px solid @veui-gray-color-sup-1;
    border-radius: 4px 4px 0 0;
    margin-right: 6px;
    background: @veui-gray-color-sup-5;
    cursor: pointer;

    &:hover {
      color: @veui-theme-color-hover;
    }

    &.veui-tabs-active {
      border-bottom: none;
      background: #fff;
      color: @veui-theme-color-primary;
    }
  }

  &[ui~="simple"] {
    .veui-tabs-list {
      position: relative;
      margin-bottom: -1px;
    }

    .veui-tabs-item {
      min-width: 80px;
      border: none;
      border-radius: 0;
      background: #fff;
      border-bottom: 1px solid @veui-gray-color-sup-1;

      &.veui-tabs-active {
        border-bottom: 1px solid @veui-theme-color-primary;
      }
    }

    .veui-tabs-menu {
      border-bottom: 1px solid @veui-gray-color-sup-1;
      margin-bottom: 20px;
    }

    .veui-tab {
      border: none;
    }
  }
}
</style>
