<template>
<abstract-tree
  :class="{
    [$c('tree')]: true,
    [$c('disabled')]: realDisabled || realReadonly
  }"
  :group-class="$c('tree-item-group')"
  :ui="realUi"
  :items="normalizedItems"
  :expanded="realExpanded"
  @focusin.native="focused = true"
  @focusout.native="focused = false"
>
  <template
    slot="item"
    slot-scope="{ item, index, depth, expanded: itemExpanded, parents }"
  >
    <div
      ref="item"
      :class="{
        [$c('tree-item')]: true,
        [$c('tree-item-expanded')]: itemExpanded,
        [$c('tree-item-selected')]: selectable && isSelected(item),
        [$c('tree-item-clickable')]: isClickable(item),
        [$c('tree-item-hidden')]: item.hidden,
        [$c('disabled')]: isDisabled(item, parents)
      }"
      :tabindex="depth === 1 ? item.tabIndex : item.disabled ? null : '-1'"
      @click="handleItemClick(item, parents, index, depth)"
      @keydown="handleKeydown($event, item, index, depth)"
    >
      <slot
        name="item"
        v-bind="item"
        :item="item"
        :index="index"
        :depth="depth"
        :expanded="itemExpanded"
        :parents="parents"
      >
        <button
          v-if="item.children && item.children.length"
          type="button"
          :class="$c('tree-item-expand-switcher')"
          tabindex="-1"
          @click.stop="toggleExpanded(item, index, depth)"
        >
          <veui-icon :name="icons.collapse"/>
        </button>
        <slot
          name="item-before"
          v-bind="item"
          :item="item"
          :index="index"
          :depth="depth"
          :expanded="itemExpanded"
          :parents="parents"
        >
          <veui-checkbox
            v-if="checkable"
            :class="$c('tree-item-check')"
            :checked="item.checked"
            :indeterminate="item.partialChecked"
            :disabled="realReadonly || isDisabled(item, parents)"
            :ui="realUi"
            tabindex="-1"
            @click.native.stop
            @change="handleItemCheck(item, parents)"
          />
        </slot>
        <div :class="$c('tree-item-label')">
          <slot
            name="item-label"
            v-bind="item"
            :item="item"
            :index="index"
            :depth="depth"
            :expanded="itemExpanded"
            :parents="parents"
          >
            {{ item.label }}
          </slot>
        </div>
        <slot
          name="item-after"
          v-bind="item"
          :item="item"
          :index="index"
          :depth="depth"
          :expanded="itemExpanded"
          :parents="parents"
        />
      </slot>
    </div>
  </template>
</abstract-tree>
</template>

<script>
import AbstractTree, { includesItem } from './_AbstractTree'
import Checkbox from '../Checkbox'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import useControllable from '../../mixins/controllable'
import useTree from '../../mixins/tree'
import { map, filter, uniq } from 'lodash'
import { focusIn, closest } from '../../utils/dom'
import { isEqualSet } from '../../utils/lang'
import { mapDatasource, hasChildren } from '../../utils/datasource'

export default {
  name: 'veui-tree',
  components: {
    'veui-checkbox': Checkbox,
    'veui-icon': Icon,
    AbstractTree
  },
  mixins: [
    prefix,
    ui,
    input,
    useControllable([
      { prop: 'checked', event: 'check' },
      'selected',
      'expanded'
    ]),
    useTree()
  ],
  model: {
    prop: 'checked',
    event: 'check'
  },
  props: {
    checkable: Boolean,
    checked: {
      type: Array,
      default () {
        return []
      }
    },
    selectable: Boolean,
    /* eslint-disable vue/require-prop-types */
    selected: {},
    /* eslint-ensable vue/require-prop-types */
    datasource: AbstractTree.props.items,
    expanded: AbstractTree.props.expanded
  },
  data () {
    return {
      focused: false,
      focusVisible: map(this.datasource, _ => false)
    }
  },
  computed: {
    // 不在 normalize 中复制的目的：仅仅 checked 发生变化无需重新复制
    realItems () {
      let datasource = mapDatasource(
        this.datasource,
        (item, { parentIndices, index }) => {
          let { name, value, label } = item
          let nameOrValue = name != null ? name : value
          // 没有 name/value 直接用 ${label}${depth}} 来生成 name 更稳定一点，反正 datasource 变化 uniqueId 也是在变化
          return {
            ...item,
            ...(nameOrValue == null
              ? {
                name: `veui-${label}-${parentIndices.concat(index).join('-')}`
              }
              : {})
          }
        }
      )

      let firstTabable
      // 在 topLevel 找下第一个可以用 tab 获取焦点的
      datasource.forEach(item => {
        item.tabIndex = item.disabled ? null : firstTabable ? '-1' : '0'
        firstTabable = item.tabIndex === '0' ? item : firstTabable
      })
      return datasource
    },
    normalizedItems () {
      return this.checkable
        ? this.markChecked(this.realItems, this.realChecked)
        : this.realItems
    }
  },
  methods: {
    isSelected (item) {
      let selected = this.realSelected != null ? [this.realSelected] : null
      return includesItem(selected, item)
    },
    isClickable (item) {
      return this.selectable || this.checkable || hasChildren(item)
    },
    toggleExpanded (item, index, depth, expand) {
      let isExpanded = includesItem(this.realExpanded, item)
      let { name, value } = item
      if (expand === isExpanded || !hasChildren(item)) {
        return
      }
      let nameOrValue = name != null ? name : value
      let expanded = isExpanded
        ? filter(this.realExpanded, expand => expand !== nameOrValue)
        : uniq([...this.realExpanded, nameOrValue])

      this.commit('expanded', expanded)
      this.$emit(isExpanded ? 'collapse' : 'expand', item, index, depth)
    },
    handleKeydown (e, item, index, depth) {
      let passive = false
      let expanded = includesItem(this.realExpanded, item)
      switch (e.key) {
        case 'Enter':
          this.toggleExpanded(item, index, depth)
          break
        case 'Left':
        case 'ArrowLeft':
          if (expanded) {
            this.toggleExpanded(item, index, depth, false)
          } else {
            this.focusLevel(e.target)
          }
          break
        case 'Right':
        case 'ArrowRight':
          if (expanded) {
            this.focusLevel(e.target, false)
          } else {
            this.toggleExpanded(item, index, depth, true)
            this.focusLevel(e.target, false)
          }
          break
        case 'Up':
        case 'ArrowUp':
          this.navigate(e.target, false)
          break
        case 'Down':
        case 'ArrowDown':
          this.navigate(e.target, true)
          break
        case 'Home':
          this.navigate(e.target, false, true)
          break
        case 'End':
          this.navigate(e.target, true, true)
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
      return `.${this.$c('tree-item')}:not(.${this.$c('disabled')})`
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
    },
    focus () {
      focusIn(this.$el)
    },
    navigate (current, forward = false, hitBoundary = false) {
      let context = this.$el
      current.tabIndex = -1
      let items = [...context.querySelectorAll(this.getFocusSelector())]
      let index = items.indexOf(current)

      let next
      if (hitBoundary) {
        next = items[forward ? items.length - 1 : 0]
        next.tabIndex = 0
        next.focus()
        return
      }

      let targetIndex =
        index === -1
          ? 0
          : ((forward ? index + 1 : index - 1) + items.length) % items.length
      next = items[targetIndex]
      next.tabIndex = 0
      next.focus()
    },
    handleItemClick (item, parents, ...extraArgs) {
      if (item.disabled) {
        return
      }

      let { name, value } = item
      let nameOrValue = name != null ? name : value
      if (this.selectable) {
        this.commit('selected', this.isSelected(item) ? null : nameOrValue)
      } else if (this.checkable && !this.realDisabled && !this.realReadonly) {
        this.handleItemCheck(item, parents)
      } else if (hasChildren(item)) {
        this.toggleExpanded(item, ...extraArgs)
      }
      this.$emit('click', item, parents, ...extraArgs)
    },
    isDisabled (item, parents) {
      return (
        !!this.realDisabled ||
        !!item.disabled ||
        parents.some(i => !!i.disabled)
      )
    },
    handleItemCheck (item, parents) {
      let newChecked = this.toggleItem(
        this.realChecked,
        item,
        parents,
        this.normalizedItems
      )
      if (!isEqualSet(newChecked, this.realChecked)) {
        this.commit('checked', newChecked)
      }
    }
  }
}
</script>
