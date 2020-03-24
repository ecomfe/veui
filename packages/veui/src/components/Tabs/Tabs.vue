<script>
import Button from '../Button'
import Link from '../Link'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import config from '../../managers/config'
import { makeCoupledParent } from '../../mixins/coupled'
import makeControllable from '../../mixins/controllable'
import { isEmpty } from '../../utils/helper'
import '../../common/uiTypes'
import { scrollTo } from '../../utils/dom'
import { find, findIndex, throttle } from 'lodash'

let tabs = makeCoupledParent({
  type: 'tabs',
  childrenKey: 'items'
})

config.defaults(
  {
    matches (current, to) {
      return current.fullPath === to.fullPath
    }
  },
  'tabs'
)

export default {
  name: 'veui-tabs',
  mixins: [prefix, ui, i18n, tabs, makeControllable(['active'])],
  props: {
    active: {
      type: String
    },
    matches: {
      default () {
        return config.get('tabs.matches')
      },
      validator (value) {
        return typeof value === 'function'
      }
    },
    addable: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: null
    },
    tip: {
      type: String
    }
  },
  data () {
    return {
      items: [],
      focusedTab: null,
      listOverflow: false,
      stops: null,
      hit: {
        start: true,
        end: false
      }
    }
  },
  computed: {
    tabAttrs () {
      return this.items.map(({ id, name, attrs }, index) => {
        return {
          role: 'tab',
          'aria-selected': this.activeTab && id === this.activeTab.id,
          'aria-setsize': this.items.length,
          'aria-posinset': index + 1,
          'aria-controls': id,
          ...attrs
        }
      })
    },
    activeTab () {
      let active = this.realActive
      return isEmpty(active)
        ? this.matchedTab || this.items[0]
        : find(this.items, ({ name, id }) => name === active || id === active)
    },
    matchedTab () {
      if (!this.$route || !this.items.some(({ to }) => to)) {
        return null
      }

      return find(this.items, ({ matches, to }) => matches(this.$route, to))
    },
    showPanel () {
      return this.$slots.panel || (this.activeTab && !this.activeTab.empty)
    }
  },
  watch: {
    items () {
      this.$nextTick(() => {
        this.updateLayout()
      })
    },
    activeTab (tab) {
      if (!tab) {
        return
      }

      // Might trigger overflow change and scrollers need to be rendered before this
      setTimeout(() => {
        this.scrollTabIntoView(tab)
      })
    }
  },
  mounted () {
    if (!this.active && this.activeTab) {
      this.realActive = this.activeTab.name || this.activeTab.id
    }

    this.updateLayout()
  },
  methods: {
    handleActivate ({ disabled, name, id }) {
      if (disabled) {
        return
      }
      this.realActive = name || id
    },
    handleRemove (tab, e) {
      this.$emit('remove', tab)
      e.stopPropagation()
    },
    handleAdd () {
      this.$emit('add')
    },
    updateLayout () {
      let { list, items = [] } = this.$refs

      // need to check tab counts because of a WebKit bug
      // see https://codepen.io/Justineo/pen/Poqdawm
      this.listOverflow =
        items.length === 0 ? false : list.scrollWidth > list.clientWidth

      this.stops = items.map(el => [
        el.offsetLeft,
        el.offsetLeft + el.offsetWidth
      ])
    },
    scrollTabIntoView (tab) {
      let { list } = this.$refs
      let index = findIndex(this.items, ({ id }) => id === tab.id)
      if (index === -1) {
        return
      }
      let [tabStart, tabEnd] = this.stops[index]
      let viewStart = list.scrollLeft
      let viewEnd = list.scrollLeft + list.clientWidth

      if (
        (tabStart >= viewStart && tabEnd <= viewEnd) ||
        tabEnd - tabStart >= viewEnd - viewStart
      ) {
        return
      }

      if (tabStart < viewStart) {
        this.scrollTo(tabStart)
      } else if (tabEnd > viewEnd) {
        this.scrollTo(tabEnd - list.clientWidth)
      }
    },
    scrollTo (x) {
      let { list } = this.$refs

      scrollTo(list, x, 0)
    },
    handleScroll (forward) {
      let { list } = this.$refs

      let current = forward
        ? list.scrollLeft + list.clientWidth
        : list.scrollLeft
      let target = find(this.stops, ([start, end], i) => {
        if (forward) {
          let prev = this.stops[i - 1]

          if (!prev) {
            return false
          }

          return prev[1] <= current && current < end
        } else {
          let next = this.stops[i + 1]

          if (!next) {
            return false
          }

          return start <= current && current < next[0]
        }
      })
      if (!target) {
        return
      }
      this.scrollTo(forward ? target[0] : target[1] - list.clientWidth)
    },
    updateScrollState () {
      let { list } = this.$refs

      this.hit = {
        start: list.scrollLeft === 0,
        end: list.scrollLeft + list.clientWidth >= list.scrollWidth
      }
    },
    handleRemoveChild (index) {
      let activeIndex = index === 0 ? 0 : index - 1
      let tab = this.items[activeIndex]
      if (tab) {
        this.realActive = tab.name || tab.id
      }
    }
  },
  render () {
    const renderTabItem = this.$scopedSlots['tab-item']
    const renderLabel =
      this.$scopedSlots['tab-item-label'] ||
      (({ label, status }) => [
        <div class={this.$c('tabs-item-label-content')}>
          {label}
          {status ? (
            <Icon
              class={[
                this.$c('tabs-item-status'),
                this.$c(`tabs-item-status-${status}`)
              ]}
              name={this.icons[status]}
            />
          ) : null}
        </div>
      ])

    return (
      <div
        class={{
          [this.$c('tabs')]: true,
          [this.$c('tabs-empty')]: this.items.length === 0
        }}
        ui={this.realUi}
      >
        <div class={this.$c('tabs-menu')}>
          {this.listOverflow ? (
            <Button
              class={this.$c('tabs-prev')}
              ui={this.uiParts.nav}
              disabled={this.hit.start}
              onClick={throttle(() => this.handleScroll(false), 200)}
            >
              <Icon name={this.icons.prev} />
            </Button>
          ) : null}
          <div
            ref="list"
            class={this.$c('tabs-list')}
            role="tablist"
            onScroll={this.updateScrollState}
          >
            {this.items.map((tab, index) => (
              <div
                key={tab.id}
                ref="items"
                refInFor
                class={{
                  [this.$c('tabs-item')]: true,
                  [this.$c('tabs-item-disabled')]: tab.disabled,
                  [this.$c('tabs-item-removable')]: tab.removable,
                  [this.$c('tabs-item-active')]: this.activeTab === tab,
                  [this.$c('tabs-item-remove-focus')]: this.focusedTab === tab
                }}
              >
                {renderTabItem ? (
                  renderTabItem({
                    ...tab,
                    index,
                    attrs: this.tabAttrs[index],
                    activate: () => this.handleActivate(tab)
                  })
                ) : tab.to ? (
                  <Link
                    class={this.$c('tabs-item-label')}
                    to={tab.to}
                    native={tab.native}
                    disabled={tab.disabled}
                    onClick={() => this.handleActivate(tab)}
                    {...{ attrs: this.tabAttrs[index] }}
                  >
                    {renderLabel({
                      ...tab,
                      index,
                      attrs: this.tabAttrs[index]
                    })}
                  </Link>
                ) : (
                  <button
                    type="button"
                    class={this.$c('tabs-item-label')}
                    disabled={tab.disabled}
                    onClick={() => this.handleActivate(tab)}
                    {...{ attrs: this.tabAttrs[index] }}
                  >
                    {renderLabel({
                      ...tab,
                      index,
                      attrs: this.tabAttrs[index]
                    })}
                  </button>
                )}
                {tab.removable ? (
                  <Button
                    class={this.$c('tabs-item-remove')}
                    ui={this.uiParts.remove}
                    onClick={e => this.handleRemove(tab, e)}
                    onFocus={() => {
                      this.focusedTab = tab
                    }}
                    onBlur={() => {
                      this.focusedTab = null
                    }}
                  >
                    <Icon
                      name={this.icons.remove}
                      label={this.t('remove', { label: tab.label })}
                    />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          {this.listOverflow ? (
            <Button
              class={this.$c('tabs-next')}
              ui={this.uiParts.nav}
              disabled={this.hit.end}
              onClick={() => this.handleScroll(true)}
            >
              <Icon name={this.icons.next} />
            </Button>
          ) : null}
          {this.addable ? (
            <Button
              class={this.$c('tabs-add')}
              ui={this.uiParts.add}
              disabled={this.max != null && this.items.length >= this.max}
              onClick={this.handleAdd}
            >
              <Icon name={this.icons.add} />
              {this.t('add')}
            </Button>
          ) : null}
          {this.tip || this.$slots.extra ? (
            <div class={this.$c('tabs-extra')}>
              {this.$slots.extra ||
                (this.tip ? (
                  <div class={this.$c('tabs-tip')}>{this.tip}</div>
                ) : null)}
            </div>
          ) : null}
        </div>
        <div v-show="showPanel" class={this.$c('tabs-panel')}>
          {this.$slots.default}
          {!this.activeTab || this.activeTab.empty ? this.$slots.panel : null}
        </div>
      </div>
    )
  }
}
</script>
