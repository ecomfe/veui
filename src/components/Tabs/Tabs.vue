<script>
import Tab from './Tab'
export default {
  name: 'veui-tabs',

  props: ['ui', 'type', 'active'],

  data () {
    return {
      tabs: [],
      current: ''
    }
  },

  render () {
    return (
      <div class="veui-tabs-wrap">
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

  methods: {
    add (tab) {
      this.tabs.push(tab)
    },

    setCurrent (value) {
      if (!this.tabs.length) return
      let values = this.tabs.map(item => item.name)
      if (value) {
        if (values.indexOf(value) !== -1) {
          this.current = value
        }
      } else if (values.length) {
        this.current = values[0]
      }
    }
  },

  watch: {
    current (val) {
      this.$emit('change', val)
    }
  },

  mounted () {
    console.log(111)
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
    overflow: hidden;
    position: relative;
    margin-bottom: -1px;
  }

  .veui-tabs-list {
    overflow: hidden;

    .veui-tabs-item {
      list-style: none;
      color: @veui-gray-color-normal;
      float: left;
      cursor: pointer;
      text-align: center;
      padding: 0 25px;
      font-size: 14px;
      line-height: 36px;
      height: 36px;
      border: 1px solid @veui-gray-color-sup-1;
      border-radius: 4px 4px 0 0;
      margin-right: 6px;
      background: #FFF;

      &:hover {
        color: @veui-theme-color-hover;
      }

      &.active {
        border-bottom: none;
        color: @veui-theme-color-primary;
      }
    }
  }

  .veui-tab-content {
    border: 1px solid @veui-gray-color-sup-1;
    padding: 20px;
  }
  
}
</style>
