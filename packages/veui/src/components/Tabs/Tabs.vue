<script>
import Vue from 'vue'
import Link from '../Link'

export default {
  name: 'veui-tabs',
  uiTypes: ['tabs'],
  props: {
    ui: {
      type: String,
      default: 'default'
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
                tab.to
                  ? <li class={{
                    'veui-tabs-item': true,
                    'veui-tabs-item-active': index === this.localIndex
                  }}><Link to={tab.to} native={tab.native}>{ tab.label }</Link></li>
                  : <li onClick={$event => this.setActive({ index })} class={{
                    'veui-tabs-item': true,
                    'veui-tabs-item-active': index === this.localIndex
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
        Vue.util.warn(`Invalid tab name: [${tab.name}]`)
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
      this.$emit('update:index', val)
    },
    localActive (val) {
      this.$emit('update:active', val)
    }
  }
}
</script>
