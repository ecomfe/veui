<script>
import Vue from 'vue'

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
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tabs: [],
      localIndex: null,
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
                <li onClick={ $event => this.setActive({ index }) } class={{
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
      let names = this.tabs.map(tab => tab.name)
      let tabIndex = names.length

      if (!tab.name || names.indexOf(tab.name) === -1) {
        if (tab.name === this.active) {
          this.localActive = tab.name
          this.localIndex = tabIndex
        }

        if (tabIndex === this.index) {
          this.localActive = tab.name
          this.localIndex = tabIndex
        }

        this.tabs.push(tab)
      } else {
        Vue.util.warn('invalid! deplicate tab name')
      }
    },

    setActive ({active, index}) {
      let values = this.tabNames

      this.localIndex = index !== undefined ? index : values.indexOf(active)
      this.localActive = active !== undefined ? active : values[index]
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
    },
    localIndex (val) {
      this.$emit('update:index', this.val)
    },
    localActive (val) {
      this.$emit('update:active', this.val)
    }
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
