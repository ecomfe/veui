<script>
import Button from '../Button'
import Link from '../Link'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import config from '../../managers/config'
import useConfig from '../../mixins/config'
import { useParent } from '../../mixins/coupled'
import useControllable from '../../mixins/controllable'
import resize from '../../directives/resize'
import '../../common/global'
import { scrollTo } from '../../utils/dom'
import { find, findIndex, throttle, pick, noop } from 'lodash'

let tabs = useParent('tabs', 'tab', {
  childrenKey: 'items',
  onBeforeRemoveChild: 'handleRemoveChild'
})

config.defaults(
  {
    matches: (current, to) => current.fullPath === to.fullPath
  },
  'tabs'
)

const TAB_FIELDS = [
  'label',
  'name',
  'disabled',
  'to',
  'native',
  'removable',
  'status'
]

export default {
  name: 'veui-tabs',
  directives: {
    resize
  },
  mixins: [
    prefix,
    ui,
    i18n,
    tabs,
    useControllable(['active']),
    useConfig('config', 'tabs')
  ],
  props: {
    active: {
      type: String
    },
    matches: {
      validator (value) {
        return typeof value === 'function'
      }
    },
    addable: Boolean,
    max: {
      type: Number,
      default: null
    },
    tip: String,
    eager: Boolean,
    addLabel: String
  },
  data () {
    return {
      focusedTab: null,
      menuOverflow: false,
      stops: null,
      hit: {
        start: true,
        end: false
      }
    }
  },
  computed: {
    realMatches () {
      return this.matches == null ? this.config['tabs.matches'] : this.matches
    },
    tabAttrs () {
      return this.items.map(({ id, attrs }, index) => {
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
    hasRouteItem () {
      return this.items.some(({ to }) => !!to)
    },
    activeTab () {
      let active = this.realActive
      return (
        find(this.items, ({ name, id }) => name === active || id === active) ||
        this.matchedTab ||
        (this.items || [])[0]
      )
    },
    activeIndex () {
      return findIndex(this.items, (tab) => tab === this.activeTab)
    },
    matchedTab () {
      if (!this.$route || !this.hasRouteItem) {
        return null
      }

      return find(this.items, ({ matches, to }) => matches(this.$route, to))
    },
    realAddLabel () {
      return this.addLabel || this.t('add')
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
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.scrollTabIntoView(tab)
      })
    },
    $route (value) {
      if (value && this.hasRouteItem) {
        let newValue = this.matchedTab
          ? this.matchedTab.name || this.matchedTab.id
          : null
        this.commit('active', newValue)
      }
    }
  },
  mounted () {
    if (!this.active && this.activeTab) {
      this.commit('active', this.activeTab.name || this.activeTab.id)
    }

    this.updateLayout()
  },
  beforeDestroy () {
    clearTimeout(this.scrollTimer)
  },
  methods: {
    handleActivate (tab) {
      if (tab.disabled) {
        return
      }
      this.commit('active', tab.name || tab.id)
      this.scrollTabIntoView(tab)

      this.$emit('change', pickFields(tab))
    },
    handleRemove (tab, e) {
      this.$emit('remove', pickFields(tab))
      e.stopPropagation()
    },
    handleAdd () {
      this.$emit('add')
    },
    isMenuOverflow () {
      let { menu, list, items = [] } = this.$refs

      if (items.length === 0) {
        return false
      }

      if (menu.scrollWidth > menu.clientWidth) {
        return true
      }

      let first = items[0]
      let last = items[items.length - 1]

      return (
        last.getBoundingClientRect().right -
          first.getBoundingClientRect().left >
        list.getBoundingClientRect().width
      )
    },
    updateLayout () {
      let { items = [] } = this.$refs

      // no items means no need to scroll
      this.menuOverflow = this.isMenuOverflow()

      this.stops = items.map((el) => [
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
    handleWheelScroll (e) {
      let { deltaX, deltaY } = e
      let delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY

      this.$refs.list.scrollLeft += delta

      e.preventDefault()
    },
    handleRemoveChild (id) {
      if (!this.activeTab || id !== this.activeTab.id) {
        return
      }
      const index = this.activeIndex
      let tab = this.items[index === 0 ? 1 : index - 1]
      if (tab) {
        this.commit('active', tab.name || tab.id)
      } else {
        // 当前的已经是最后了，清空 active
        this.commit('active', null)
      }
    }
  },
  render () {
    const renderTabItem = this.$scopedSlots['tab-item']
    const renderTabContent = (props) => (
      <div class={this.$c('tabs-item-label-content')}>
        <div>
          {renderItem(
            [props.renderLabel, this.$scopedSlots['tab-label']],
            props
          ) || props.label}
        </div>
        {props.status ? (
          <Icon
            class={[
              this.$c('tabs-item-status'),
              this.$c(`tabs-item-status-${props.status}`)
            ]}
            name={this.icons[props.status]}
          />
        ) : null}
      </div>
    )

    const renderTabPanel = (props) => {
      const tabPanel = props.renderPanel({
        ...pickFields(props),
        index: props.index,
        active: props.active
      })

      return tabPanel && (props.active || this.eager) ? (
        <div
          id={props.id}
          class={this.$c('tab-panel')}
          role="tabpanel"
          v-show={props.active}
        >
          {tabPanel}
        </div>
      ) : null
    }

    const tabPanels = this.items.map((tab, index) =>
      renderTabPanel({
        ...tab,
        index,
        active: this.activeTab === tab
      })
    )
    const panelContent = tabPanels.some(Boolean) ? tabPanels : this.$slots.panel

    const directives = [
      {
        name: 'resize',
        value: this.updateLayout,
        modifiers: { debounce: true, leading: true, 200: true }
      }
    ]

    return (
      <div
        class={{
          [this.$c('tabs')]: true,
          [this.$c('tabs-empty')]: this.items.length === 0,
          [this.$c('tabs-overflow')]: this.menuOverflow
        }}
        ui={this.realUi}
      >
        {this.$slots.default}
        <div ref="menu" class={this.$c('tabs-menu')}>
          {this.menuOverflow ? (
            <Button
              key="__tabs_prev__"
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
            onWheel={this.menuOverflow ? this.handleWheelScroll : noop}
            {...{ directives }}
          >
            {this.items.map((tab, index) => (
              <div
                key={tab.id}
                ref="items"
                refInFor
                class={{
                  [this.$c('tabs-item')]: true,
                  [this.$c('disabled')]: tab.disabled,
                  [this.$c('tabs-item-removable')]: tab.removable,
                  [this.$c('tabs-item-active')]: this.activeTab === tab,
                  [this.$c('tabs-item-remove-focus')]: this.focusedTab === tab
                }}
              >
                {renderItem([tab.renderTab, renderTabItem], {
                  ...pickFields(tab),
                  index,
                  active: this.activeTab === tab,
                  attrs: this.tabAttrs[index],
                  activate: () => this.handleActivate(tab)
                }) ||
                  (tab.to ? (
                    <Link
                      class={this.$c('tabs-item-label')}
                      to={tab.to}
                      native={tab.native}
                      disabled={tab.disabled}
                      onClick={() => this.handleActivate(tab)}
                      {...{ attrs: this.tabAttrs[index] }}
                    >
                      {renderTabContent({
                        ...pickFields(tab),
                        index,
                        active: this.activeTab === tab
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
                      {renderTabContent({
                        ...tab,
                        index
                      })}
                    </button>
                  ))}
                {tab.removable ? (
                  <Button
                    class={this.$c('tabs-item-remove')}
                    ui={this.uiParts.remove}
                    aria-label={this.t('remove', { label: tab.label })}
                    onClick={(e) => this.handleRemove(tab, e)}
                    onFocus={() => {
                      this.focusedTab = tab
                    }}
                    onBlur={() => {
                      this.focusedTab = null
                    }}
                  >
                    <Icon name={this.icons.remove} />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          {this.menuOverflow ? (
            <Button
              key="__tabs_next__"
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
              key="__tabs_add__"
              class={this.$c('tabs-add')}
              ui={this.uiParts.add}
              disabled={this.max != null && this.items.length >= this.max}
              onClick={this.handleAdd}
            >
              <Icon name={this.icons.add} />
              {this.realAddLabel}
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
        {panelContent ? (
          <div class={this.$c('tabs-panel')}>{panelContent}</div>
        ) : null}
      </div>
    )
  }
}

/**
 * Render with the first render function that returns something
 * @param {Array<Function>} renderFns render functions, usually scoped slot renderers
 * @param {Object} props slot scopes
 */
function renderItem (renderFns, props) {
  for (let i = 0; i < renderFns.length; i++) {
    let render = renderFns[i]
    if (!render) {
      continue
    }

    let content = render(props)
    if (content) {
      return content
    }
  }

  return null
}

/**
 * Pick only necessary fields for slots and events
 * @param {Object} tab a tab object
 * @returns {Object} An object consists of necessary fields
 */
function pickFields (tab) {
  return pick(tab, TAB_FIELDS)
}
</script>
