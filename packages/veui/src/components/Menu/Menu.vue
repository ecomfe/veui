<template>
<div
  :ui="realUi"
  :class="{
    [$c('menu')]: true,
    [$c('menu-collapsed')]: realCollapsed
  }"
>
  <div :class="$c('menu-tree-wrapper')">
    <slot name="before"/>
    <abstract-tree
      ref="tree"
      :ui="realUi"
      :class="{
        [$c('menu-tree')]: true,
        [$c('menu-tree-has-icon')]: hasIcon
      }"
      :items="normalizedItems"
      :expanded="realExpanded"
      :matches="treeMatches"
    >
      <template
        slot="item"
        slot-scope="{ item: link, expanded: itemExpanded, depth }"
      >
        <slot
          name="item"
          :expanded="itemExpanded"
          v-bind="link"
        >
          <div
            :ref="link.name"
            :class="{
              [$c('menu-item')]: true,
              [$c('menu-item-expanded')]: itemExpanded,
              [$c('menu-tree-item')]: true,
              ...itemClass(link)
            }"
            @mouseenter="show(link)"
          >
            <veui-link
              :disabled="!!link.disabled"
              :class="$c('menu-link')"
              v-bind="pickLinkProps(link)"
              :ui="realUi"
              :tabindex="
                depth === 1 ? link.tabIndex : link.disabled ? null : '-1'
              "
              @click="handleItemClick(link, true)"
              @keydown.native="handleKeydown($event, link)"
            >
              <span
                v-if="link.icon || $scopedSlots.icon || $slots.icon"
                :class="$c('menu-item-icon')"
              >
                <slot
                  name="icon"
                  v-bind="link"
                >
                  <veui-icon
                    :ui="realUi"
                    :name="link.icon"
                  />
                </slot>
              </span>
              <slot
                v-if="!realCollapsed"
                name="item-label"
                v-bind="link"
              >
                <span :class="$c('menu-item-label')">{{ link.label }}</span>
              </slot>
            </veui-link>
            <veui-button
              v-if="
                !realCollapsed &&
                  !link.disabled &&
                  link.children &&
                  link.children.length
              "
              :ui="uiParts.toggle"
              tabindex="-1"
              :class="$c('menu-item-toggle')"
              @click="toggleExpanded(link)"
            >
              <veui-icon
                :class="$c('menu-toggle-icon')"
                :name="link.expanded ? icons.collapse : icons.expand"
              />
            </veui-button>
          </div>
        </slot>
        <veui-overlay
          v-if="realCollapsed && link.options && link.options.length"
          :target="link.name"
          :options="realOverlayOptions"
          :open="!!hoverItem && hoverItem.name === link.name"
          position="right-start"
          :overlay-class="$c('menu-overlay')"
          trigger="hover"
          autofocus
        >
          <div
            v-outside="{
              refs: outsideRefs,
              delay: 100,
              trigger: 'hover',
              handler: close
            }"
            :class="$c('menu-popout')"
          >
            <div :class="$c('menu-group-title')">{{ link.label }}</div>
            <veui-option-group
              :ref="`dropdown-${link.name}`"
              :overlay-class="$c('menu-overlay')"
              :options="link.options"
              position="popup"
              trigger="hover"
              option-tag="div"
              @keydown.native="handleKeydown($event, null, link)"
            >
              <template
                slot="option"
                slot-scope="option"
              >
                <slot
                  name="item"
                  v-bind="option"
                >
                  <veui-link
                    :class="{
                      [$c('menu-item')]: true,
                      [$c('menu-link')]: true,
                      ...itemClass(option)
                    }"
                    v-bind="pickLinkProps(option)"
                    :tabindex="option.disabled ? null : 0"
                    @click="handleItemClick(option)"
                  >
                    <slot
                      name="item-label"
                      v-bind="option"
                    >
                      <span :class="$c('menu-item-label')">{{
                        option.label
                      }}</span>
                    </slot>
                  </veui-link>
                </slot>
              </template>
              <template
                slot="option-group-label"
                slot-scope="group"
              >
                <slot
                  name="item"
                  v-bind="group"
                >
                  <veui-link
                    :class="{
                      [$c('menu-item')]: true,
                      [$c('menu-link')]: true,
                      ...itemClass(group.option)
                    }"
                    v-bind="pickLinkProps(group.option)"
                    :tabindex="group.option.disabled ? null : 0"
                    @click="
                      handleGroupLabelClick(group.option, group.closeMenu)
                    "
                  >
                    <slot
                      name="item-label"
                      v-bind="group"
                    >
                      <span :class="$c('menu-item-label')">{{
                        group.label
                      }}</span>
                    </slot>
                  </veui-link>
                </slot>
              </template>
            </veui-option-group>
          </div>
        </veui-overlay>
      </template>
    </abstract-tree>
    <slot name="after"/>
  </div>
  <div
    v-if="collapsible"
    :class="$c('menu-footer')"
  >
    <veui-button
      :ui="uiParts.toggle"
      :class="$c('menu-toggle')"
      :tabindex="-1"
      @click="toggleCollapsed"
    >
      <veui-icon
        :class="$c('menu-toggle-icon')"
        :name="realCollapsed ? icons.expand : icons.collapse"
      />
    </veui-button>
  </div>
</div>
</template>

<script>
import AbstractTree from '../Tree/AbstractTree'
import Icon from '../Icon'
import Link from '../Link'
import Button from '../Button'
import OptionGroup from '../OptionGroup'
import Overlay from '../Overlay'
import { some, uniq, includes, forEach, find } from 'lodash'
import controllable from '../../mixins/controllable'
import mixin from './_mixin'
import { closest, getFocusable } from '../../utils/dom'
import '../../common/uiTypes'

export default {
  name: 'veui-menu',
  components: {
    AbstractTree,
    'veui-link': Link,
    'veui-icon': Icon,
    'veui-option-group': OptionGroup,
    'veui-overlay': Overlay,
    'veui-button': Button
  },
  mixins: [
    mixin,
    controllable([
      {
        prop: 'collapsed',
        get (getReal) {
          return this.collapsible ? getReal() : false
        }
      },
      {
        prop: 'expanded',
        get (getReal) {
          return this.realCollapsed ? [] : getReal() || []
        }
      }
    ])
  ],
  props: {
    collapsible: Boolean,
    collapsed: Boolean,
    expanded: AbstractTree.props.expanded
  },
  data () {
    return {
      localOverlayOptions: {
        position: 'right-start'
      },
      hoverItem: null,
      outsideRefs: ['tree']
    }
  },
  computed: {
    hasIcon () {
      return !!some(this.items, ({ icon }) => !!icon)
    },
    treeMatches () {
      return (val, item) => val === item.name
    }
  },
  watch: {
    exactActiveItem: {
      handler (value) {
        if (!this.realCollapsed) {
          if (value) {
            this.showActiveItems()
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    itemClass (item) {
      let { name, disabled } = item
      return {
        [this.$c('disabled')]: disabled,
        [this.$c('menu-item-exact-active')]: this.exactActiveItem
          ? this.exactActiveItem.name === name
          : false,
        [this.$c('menu-item-active')]: this.activeItems.some(
          i => i.name === name
        )
      }
    },
    show (item) {
      if (this.realCollapsed) {
        this.hoverItem = item
      }
    },
    close () {
      this.hoverItem = null
    },
    showActiveItems () {
      let names = this.activeItems.map(i => i.name)
      if (names) {
        this.setReal('expanded', uniq([...this.realExpanded, ...names]))
      }
    },
    toggleExpanded ({ name, children }, toExpand) {
      let index = this.realExpanded.indexOf(name)
      let included = index >= 0
      if (toExpand === included || !children || children.length === 0) {
        return
      }

      let expanded
      if (index === -1) {
        expanded = uniq([...this.realExpanded, name])
      } else {
        expanded = [...this.realExpanded]
        expanded.splice(index, 1)
      }
      this.setReal('expanded', expanded)
    },
    toggleCollapsed () {
      let oldCollapsed = this.realCollapsed
      this.setReal('collapsed', !this.realCollapsed)
      // 原来是展开的，那么如果最终折叠了就要调整下 tabIndex
      if (!oldCollapsed) {
        this.$nextTick(() => {
          if (this.realCollapsed) {
            let els = this.$el.querySelectorAll(this.getFocusSelector())
            forEach(els, el => {
              el.tabIndex = -1
            })
            // 切换到 collapsed 状态，将 tabIndex=0 还原到第一层
            let first = find(
              this.normalizedItems,
              ({ tabIndex }) => tabIndex === '0'
            )
            if (first) {
              this.$refs[first.name].querySelector(
                `.${this.$c('menu-link')}`
              ).tabIndex = 0
            }
          }
        })
      }
    },
    postNormalize (item) {
      if (item.children) {
        item.position = 'popup'
        item.options = item.children
      }
      return item
    },
    handleItemClick (item) {
      let { to, children, disabled } = item
      if (disabled) return

      // 1. all tree items: activate or toggleExpanded
      // 2. top items on being collapsed: activate + close dropdown
      // 3. options: activate + close dropdown

      // collapsed 时在可以跳转时也把 popout 给关了
      this.activateItem(item, this.realCollapsed)
      // tree + 不能跳转 + 有 children 则 toggle children
      if (!this.realCollapsed && !to && children && children.length) {
        this.toggleExpanded(item)
      }

      this.$emit('click', item)
    },
    handleKeydown (e, item, root) {
      // 有 root 表示来自第一级 popout（只有第一级的）
      let passive = false
      let items
      switch (e.key) {
        case 'Enter':
          passive = true
          if (!root) {
            if (item.to) {
              this.activateItem(item, false)
            }
          }
          break
        case 'Esc':
        case 'Escape':
          if (root || this.hoverItem) {
            this.close()
          }
          break
        case 'Left':
        case 'ArrowLeft':
          if (root || this.hoverItem) {
            this.close()
          } else {
            if (includes(this.realExpanded, item.value)) {
              this.toggleExpanded(item, false)
            } else {
              this.focusLevel(e.target)
            }
          }
          break
        case 'Right':
        case 'ArrowRight':
          // 仅仅处理 tree item 中的和打开一级 popout 的情况
          if (!root) {
            if (this.realCollapsed) {
              this.show(item)
            } else {
              if (includes(this.realExpanded, item.value)) {
                this.focusLevel(e.target, false)
              } else {
                this.toggleExpanded(item, true)
                this.focusLevel(e.target, false)
              }
            }
          }
          break
        case 'Up':
        case 'ArrowUp':
          if (this.realCollapsed && !root && this.hoverItem) {
            this.close()
          } else {
            items = root
              ? getFocusable(this.$refs[`dropdown-${root.name}`].$el)
              : this.$el.querySelectorAll(this.getFocusSelector())
            this.navigate(e.target, items, false, !root)
          }
          break
        case 'Down':
        case 'ArrowDown':
          if (this.realCollapsed && !root && this.hoverItem) {
            this.close()
          } else {
            items = root
              ? getFocusable(this.$refs[`dropdown-${root.name}`].$el)
              : this.$el.querySelectorAll(this.getFocusSelector())
            this.navigate(e.target, items, true, !root)
          }
          break
        case 'Home':
          if (!root) {
            items = this.$el.querySelectorAll(this.getFocusSelector())
            this.navigate(e.target, items, false, true, true)
          }
          break
        case 'End':
          if (!root) {
            items = this.$el.querySelectorAll(this.getFocusSelector())
            this.navigate(e.target, items, true, true, true)
          }
          break
        default:
          passive = true
          break
      }
      if (!passive) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    getFocusSelector () {
      return `.${this.$c('menu-tree-item')}:not(.${this.$c(
        'disabled'
      )}) .${this.$c('menu-link')}`
    },
    focusLevel (current, up = true) {
      let el
      if (up) {
        el = closest(closest(document.activeElement, 'li').parentNode, 'li')
      } else {
        el = document.activeElement.nextElementSibling
      }
      if (!el) {
        return
      }

      let itemEl = el.querySelector(this.getFocusSelector())
      if (itemEl) {
        this.$nextTick(() => {
          current.tabIndex = -1
          itemEl.tabIndex = 0
          itemEl.focus()
        })
      }
    }
  }
}
</script>
