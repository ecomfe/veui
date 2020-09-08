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
        [$c('disabled')]: item.disabled
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
          :disabled="item.disabled"
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
            :disabled="item.disabled || realDisabled || realReadonly"
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
import AbstractTree from './_AbstractTree'
import Checkbox from '../Checkbox'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import useControllable from '../../mixins/controllable'
import { includes, map, filter, uniq, cloneDeep } from 'lodash'
import { focusIn, closest } from '../../utils/dom'
import { walk } from '../../utils/datasource'

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
    useControllable([{ prop: 'checked', event: 'check' }, 'selected', 'expanded'])
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
    includeIndeterminate: Boolean,
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
      return cloneDeep(this.datasource)
    },
    normalizedItems () {
      return Array.isArray(this.realItems)
        ? this.normalizeItems(this.realItems, this.realChecked)
        : []
    },
    // 用来临时修改叶子节点的 checked 信息，然后递归下得到完整的 checked 数据
    itemsCopy () {
      return cloneDeep(this.datasource)
    }
  },
  methods: {
    /**
     * 关于 checked：
     *   1. group 实际是否 checked 完全取决于他的 children（写代码比较简单）
     *   2. 当非 includeIndeterminate，group 在 checked prop 中，那么表示所有子孙都是 checked
     *      在实际 normalize 过程中，这种 group 选中信息也是应用到 children 上，再由 children 推导出 group 的状态
     *   3. 当 includeIndeterminate，group 在 checked prop 中，仅仅表示子孙中有选中的，这个信息无法应用到 children 上
     *   4. group 是完全选中的，group 一定在 checked prop 中；group 是部分选中的，根据 includeIndeterminate 来决定是否在 checked 中
     *
     * 给 item 加上 checked 相关信息：
     *   checked: 所有子节点（包括禁用的）都是选中的
     *   partialChecked：至少一个子节点（包括禁用的）是选中的
     * @param {Array} items 数据数组
     * @param {Array} checked 选中的 value 数组
     * @param {Array} collect 递归的过程中收集 checked 到该数组中去，用来生成当前实际生效的 checked
     * @param {boolean} ancestorInChecked 祖先节点在 checked 中, 递归中变量，外部不要传递
     * @return {Array} 返回新的数据数组
     */
    normalizeItems (items, checked, collect, ancestorInChecked) {
      let isTopLevel = typeof ancestorInChecked === 'undefined'
      let firstTabable = null
      items.forEach(item => {
        let { value, children } = item
        let inChecked = includes(checked, value)
        if (item.children) {
          this.normalizeItems(
            item.children,
            checked,
            collect,
            ancestorInChecked || inChecked
          )
          item.checked = children.every(({ checked }) => checked)
          item.partialChecked =
            !item.checked &&
            children.some(
              ({ partialChecked, checked }) => !!partialChecked || checked
            )
        } else {
          // 如果中间态不同步进 checked，那么祖先选中，则下面的所有子孙节点都选中
          item.checked =
            inChecked || (!this.includeIndeterminate && !!ancestorInChecked)
        }

        // 第一个非 disabled 的顶层 item 是 tabindex = 0, collect 时这个数据是多余的，就不要计算了
        if (isTopLevel && !collect) {
          item.tabIndex = item.disabled ? null : firstTabable ? '-1' : '0'
          firstTabable = item.tabIndex === '0' ? item : firstTabable
        }

        if (
          collect &&
          item.value &&
          (item.checked || (this.includeIndeterminate && item.partialChecked))
        ) {
          collect.push(item.value)
        }
      })
      return items
    },
    isSelected (item) {
      return this.realSelected === item.value
    },
    isClickable (item) {
      return (
        this.selectable ||
        this.checkable ||
        (item.children && item.children.length)
      )
    },
    toggleExpanded (item, index, depth, expand) {
      let included = includes(this.realExpanded, item.value)
      if (expand === included || !item.children || item.children.length === 0) {
        return
      }

      let expanded = included
        ? filter(this.realExpanded, value => value !== item.value)
        : uniq([...this.realExpanded, item.value])

      this.commit('expanded', expanded)
      this.$emit(included ? 'collapse' : 'expand', item, index, depth)
    },
    handleKeydown (e, item, index, depth) {
      let passive = false
      let expanded = includes(this.realExpanded, item.value)
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

      if (this.selectable) {
        let { value } = item
        let newValue = this.isSelected(item) ? null : value
        this.commit('selected', newValue)
      } else if (this.checkable && !this.realDisabled && !this.realReadonly) {
        this.handleItemCheck(item, parents)
      } else if (item.children && item.children.length) {
        this.toggleExpanded(item, ...extraArgs)
      }
      this.$emit('click', item, parents, ...extraArgs)
    },
    handleItemCheck (item, parents) {
      let checked
      let isGroup = hasChildren(item)
      let inChecked = includes(this.realChecked, item.value)

      // 1. 尝试全部取消
      let willUncheck = isGroup ? getLeafs(item, true) : []
      if ((isGroup && willUncheck.length) || (!isGroup && inChecked)) {
        willUncheck = [
          ...willUncheck,
          item.value,
          // 下面两个是直接清掉父子链上的 group，后续在 normalizedChecked 中会得到最终生效的
          // 清掉的原因：
          //   1. 非 include 时无所谓，因为 group 的状态能从 children 上推导出来
          //   2. include 时，group 在 checked prop 中会将下面的所有后代都选中，所以先将父子链上的 group 都删了，然后重新从 children 上推导
          ...(isGroup ? getGroupChildren(item) : []),
          ...parents.map(i => i.value)
        ]
        checked = filter(this.realChecked, i => willUncheck.indexOf(i) === -1)
      } else {
        // 2. 尝试全部选中
        let willCheck = isGroup ? getLeafs(item, false) : [item.value]
        if ((isGroup && willCheck.length) || (!isGroup && !inChecked)) {
          checked = uniq([...(this.realChecked || []), ...willCheck])
        }
      }

      if (checked) {
        let normalizedChecked = []
        // 重新生成一份完整的 checked
        this.normalizeItems(this.itemsCopy, checked, normalizedChecked)
        this.commit('checked', normalizedChecked)
      }
    }
  }
}

function hasChildren (item) {
  return item.children && !!item.children.length
}

function getLeafs (item, checked) {
  let leafs = []
  walk(item.children, i => {
    if (!i.disabled) {
      if (!hasChildren(i) && i.checked === checked) {
        leafs.push(i.value)
      }
    }
    return !i.disabled
  })
  return leafs
}

function getGroupChildren (item) {
  let groups = []
  walk(item.children, i => {
    if (!i.disabled) {
      if (hasChildren(i)) {
        groups.push(i.value)
      }
    }
  })
  return groups
}
</script>
