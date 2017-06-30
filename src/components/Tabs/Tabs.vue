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
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      tabs: [],
      localActive: this.active === undefined ? 0 : this.active
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
              this._l(this.tabs, tab => (
                <li onClick={ $event => this.setCurrent(tab.name) } class={{
                  'veui-tabs-item': true,
                  'veui-tabs-active': tab.name === this.localActive
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

    setCurrent (value) {
      let values = this.tabNames

      if (!values.length) return
      // if setCurrent by index, index should be from 0 to values's last one
      if (typeof value === 'number' && value > -1 && value < values.length) {
        this.localActive = values[value]
      // if setCurrent by name, name should be of tab's name
      } else if (typeof value === 'string' && values.indexOf(value) !== -1) {
        this.localActive = value
      // otherwise setCurrent to first one
      } else {
        this.localActive = values[0]
      }

      this.$emit('update:active', this.localActive)
    }
  },
  watch: {
    active (val) {
      this.setCurrent(val)
    }
  },
  mounted () {
    this.setCurrent(this.active)
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
