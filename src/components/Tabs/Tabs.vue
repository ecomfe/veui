<script>
import Tab from './Tab'
export default {
  name: 'veui-tabs',

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
      current: ''
    }
  },

  render () {
    return (
      <div class="veui-tabs-wrap" ui={this.ui}>
        <div class="veui-tabs-nav">
          <div class="veui-tabs-list">
            {
              this._l(this.tabs, tab => (
                <div onClick={ $event => this.setCurrent(tab.name) } class={{
                  'veui-tabs-item': true,
                  'active': tab.name === this.current
                }}>{ tab.label }</div>
              ))
            }
          </div>
        </div>
        <div class="veui-tabs-panel">
          { this.$slots.default }
        </div>
      </div>
    )
  },

  computed: {
    tabsName () {
      return this.tabs.map(item => item.name)
    }
  },

  methods: {
    add (tab) {
      this.tabs.push(tab)
    },

    setCurrent (value) {
      let values = this.tabsName

      if (!values.length) return
      if (typeof value === 'number') {
        this.current = values[value]
      } else if (typeof value === 'string' && values.indexOf(value) !== -1) {
        this.current = value
      } else {
        this.current = values[0]
      }
    }
  },

  watch: {
    current (val) {
      this.$emit('update:active', val)
    },

    active (val) {
      this.setCurrent(val)
    }
  },

  mounted () {
    this.setCurrent(this.active)
  },

  components: {
    Tab
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/variables.less";

.veui-tabs-wrap {

  .veui-tabs-nav {
    position: relative;
    margin-bottom: -1px;
  }

  .veui-tabs-list {
    overflow: hidden;
  }

  .veui-tabs-item {
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
    cursor: pointer;
    background: @veui-gray-color-sup-5;

    &:hover {
      color: @veui-theme-color-hover;
    }

    &.active {
      border-bottom: none;
      background: #fff;
      color: @veui-theme-color-primary;
    }
  }

  .veui-tab-content {
    border: 1px solid @veui-gray-color-sup-1;
    padding: 20px;
    min-height: 200px;
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
      border-bottom:1px solid @veui-gray-color-sup-1;


      &.active {
        border-bottom:1px solid @veui-theme-color-primary;
      }
      
    }
    
    .veui-tabs-nav {
      border-bottom:1px solid @veui-gray-color-sup-1;
      margin-bottom: 20px;
    }

    .veui-tab-content {
      border: none;
    }
  }
  
}
</style>
