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
import tooltip from '../../directives/tooltip'
import drag from '../../directives/drag'
import '../../common/global'
import { scrollTo } from '../../utils/dom'
import { find, findIndex, throttle, pick, noop } from 'lodash'
import { renderSlot } from '../../utils/helper'

let tabs = useParent('tabs', 'tab', {
  childrenKey: 'tabs',
  onBeforeRemoveChild: 'handleRemoveChild'
})

config.defaults(
  {
    matches: (current, to) => current.fullPath === to.fullPath
  },
  'tabs'
)

export default {
  name: 'veui-tabs',
  directives: {
    resize,
    tooltip,
    drag
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
    items: Array,
    sortable: Boolean,
    addLabel: String
  },
  data () {
    return {
      focusedTab: null,
      menuOverflow: false,
      hit: {
        start: true,
        end: false
      },
      dragging: false
    }
  },
  computed: {
    realMatches () {
      return this.matches == null ? this.config['tabs.matches'] : this.matches
    },
    realItems () {
      return this.isControlled('items') ? normalizeItems(this.items) : this.tabs
    },
    tabAttrs () {
      return this.realItems.map(({ id, attrs }, index) => {
        return {
          role: 'tab',
          'aria-selected': this.activeTab && id === this.activeTab.id,
          'aria-setsize': this.realItems.length,
          'aria-posinset': index + 1,
          'aria-controls': id,
          ...attrs
        }
      })
    },
    hasRouteItem () {
      return this.realItems.some(({ to }) => !!to)
    },
    activeTab () {
      let active = this.realActive
      return (
        find(
          this.realItems,
          ({ name, id }) => name === active || id === active
        ) ||
        this.matchedTab ||
        (this.realItems || [])[0]
      )
    },
    activeKey () {
      if (this.activeTab) {
        const { id, name } = this.activeTab
        return name || id
      }
      return undefined
    },
    activeIndex () {
      return findIndex(this.realItems, (tab) => tab === this.activeTab)
    },
    matchedTab () {
      if (!this.$route || !this.hasRouteItem) {
        return null
      }

      return find(this.realItems, ({ matches, to }) =>
        matches ? matches(this.$route, to) : this.realMatches(this.$route, to)
      )
    },
    realAddLabel () {
      return this.addLabel || this.t('add')
    },
    slotProps () {
      return {
        items: this.realItems,
        active: this.realActive,
        activeTab: this.activeTab ? pickFields(this.activeTab) : null
      }
    },
    dragDirective () {
      return {
        name: 'drag',
        value: {
          name: 'items',
          containment: 'list',
          dragstart: () => {
            this.dragging = true
          },
          dragend: () => {
            this.dragging = false
          },
          exclude: `.${this.$c('tabs-item-remove')}`,
          sort: (fromIndex, toIndex) => {
            this.$emit('sort', fromIndex, toIndex)
          }
        },
        modifiers: { sort: true, x: true }
      }
    }
  },
  watch: {
    realItems () {
      this.$nextTick(() => {
        this.updateLayout()
        this.updateScrollState()
      })
    },
    activeTab (tab, prev) {
      if (!tab || (prev && tab.id === prev.id)) {
        return
      }
      this._scrollTabIntoView(tab.id)
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
      this.scrollTab(tab.id)

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
      let { menu, items = [] } = this.$refs
      let list = this.$refs.list.$el

      if (items.length === 0) {
        return false
      }

      if (menu.scrollWidth > menu.clientWidth) {
        return true
      }

      let firstLeft = this.stops[0][0]
      let lastRight = this.stops[items.length - 1][1]

      return lastRight - firstLeft - list.clientWidth > 1
    },
    updateLayout () {
      let { items = [], list } = this.$refs
      if (!list) {
        return
      }
      // stops 不用响应
      // drag 之后 ，items 是无序的
      this.stops = items
        .map((el) => [el.offsetLeft, el.offsetLeft + el.offsetWidth])
        .sort(([leftA], [leftB]) => (leftA > leftB ? 1 : -1))
      this.menuOverflow = this.isMenuOverflow()
    },
    /**
     * @public
     */
    scrollTabIntoView (tabName) {
      const tab = find(this.realItems, ({ name }) => name === tabName)
      if (tab) {
        return this._scrollTabIntoView(tab.id)
      }
    },
    _scrollTabIntoView (tabId) {
      // Might trigger overflow change and scrollers need to be rendered before this
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.scrollTab(tabId)
      })
    },
    scrollTab (tabId) {
      let list = this.$refs.list.$el
      let index =
        tabId != null ? findIndex(this.realItems, ({ id }) => id === tabId) : -1
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
      let list = this.$refs.list.$el

      scrollTo(list, x, 0)
    },
    handleScroll (forward) {
      let list = this.$refs.list.$el

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
      let list = this.$refs.list.$el

      this.hit = {
        start: list.scrollLeft === 0,
        end: list.scrollWidth - list.scrollLeft - list.clientWidth < 1
      }
    },
    handleWheelScroll (e) {
      let { deltaX, deltaY } = e
      let delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY

      this.$refs.list.$el.scrollLeft += delta
      e.preventDefault()
    },
    handleRemoveChild (id) {
      if (!this.activeTab || id !== this.activeTab.id) {
        return
      }
      const index = this.activeIndex
      let tab = this.realItems[index === 0 ? 1 : index - 1]
      if (tab) {
        this.commit('active', tab.name || tab.id)
      } else {
        // 当前的已经是最后了，清空 active
        this.commit('active', null)
      }
    },
    renderPanelContent () {
      if (this.isControlled('items')) {
        return renderSlot(this, 'panel', this.slotProps)
      }
      let hasPanelsFromTab = false
      const panelsFromTab = this.realItems.map((tab, index) => {
        const active = this.activeTab === tab
        if (active || this.eager) {
          const tabPanel = tab.renderPanel({
            ...pickFields(tab),
            index,
            active
          })

          if (tabPanel) {
            hasPanelsFromTab = true
            return (
              <div
                id={tab.id}
                class={this.$c('tab-panel')}
                role="tabpanel"
                v-show={active}
              >
                {tabPanel}
              </div>
            )
          }
        }
        return null
      })
      return hasPanelsFromTab
        ? panelsFromTab
        : renderSlot(this, 'panel', this.slotProps)
    },
    renderTabContent (tab) {
      const { tooltip, renderLabel, label, status } = tab
      return (
        <div class={this.$c('tabs-item-label-content')}>
          <div
            class={this.$c('tabs-item-label-ellipsis')}
            {...(tooltip
              ? {
                directives: [
                  {
                    name: 'tooltip',
                    value: renderTooltip(tooltip, tab),
                    modifiers: { overflow: true }
                  }
                ]
              }
              : {})}
          >
            {renderItem([renderLabel, this.$scopedSlots['tab-label']], tab) ||
              label}
          </div>
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
      )
    }
  },
  render () {
    const panelContent = this.renderPanelContent()
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
          [this.$c('tabs-empty')]: this.realItems.length === 0,
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
          <transition-group
            ref="list"
            key="list"
            name={this.$c('tabs-list')}
            tag="div"
            class={{
              [this.$c('tabs-list')]: true,
              [this.$c('tabs-list-dragging')]: this.dragging
            }}
            role="tablist"
            {...{
              directives,
              nativeOn: {
                scroll: this.updateScrollState,
                wheel: this.menuOverflow ? this.handleWheelScroll : noop
              }
            }}
          >
            {this.realItems.map((tab, index) => (
              <div
                key={tab.id}
                ref="items"
                refInFor
                ui={this.realUi}
                class={{
                  [this.$c('tabs-item')]: true,
                  [this.$c('disabled')]: tab.disabled,
                  [this.$c('tabs-item-removable')]: tab.removable,
                  [this.$c('tabs-item-active')]: this.activeTab === tab,
                  [this.$c('tabs-item-remove-focus')]: this.focusedTab === tab
                }}
                {...{
                  directives: this.sortable ? [this.dragDirective] : undefined
                }}
              >
                {renderItem([tab.renderTab, this.$scopedSlots['tab-item']], {
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
                      {this.renderTabContent({
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
                      {this.renderTabContent({
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
          </transition-group>
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
              disabled={this.max != null && this.realItems.length >= this.max}
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
          <div
            class={this.$c('tabs-panel')}
            key={this.eager ? undefined : `__panel_${this.activeKey || ''}`}
          >
            {panelContent}
          </div>
        ) : null}
      </div>
    )
  }
}

const TAB_FIELDS = [
  'label',
  'name',
  'disabled',
  'to',
  'native',
  'removable',
  'status',
  'tooltip'
]

function renderTooltip (tooltip, item) {
  if (tooltip === true) {
    return item.label
  }

  if (typeof tooltip === 'function') {
    const tab = pick(item, TAB_FIELDS)
    return tooltip(tab)
  }

  return null
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

function normalizeItems (items) {
  return (items || []).map((item) => {
    if (!item.name) {
      throw new Error('[veui-tabs] The name of tab is required!')
    }
    return {
      ...item,
      id: item.name
    }
  })
}
</script>
