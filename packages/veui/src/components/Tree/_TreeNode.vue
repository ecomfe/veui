<template>
<ul
  :class="{
    [$c('tree-item-group')]: depth > 1,
    [$c('tree')]: depth === 1
  }"
  role="group"
>
  <li
    v-for="(item, index) in datasource"
    :key="item.value"
    role="treeitem"
    :aria-expanded="item.expanded"
  >
    <div
      ref="item"
      :class="{
        [$c('tree-item')]: true,
        [$c('tree-item-expanded')]: item.expanded,
        [$c('tree-item-selected')]: selectable && isSelected(item),
        [$c('tree-item-clickable')]: isClickable(item),
        [$c('tree-item-hidden')]: item.hidden,
        [$c('tree-item-disabled')]: item.disabled
      }"
      :tabindex="
        (focusVisible[index] ||
          (!tree.focused && depth === 1 && index === 0)) &&
          !item.disabled
          ? '0'
          : '-1'
      "
      @click="click(item, [], index, depth)"
      @keydown="handleKeydown($event, item, index, depth)"
    >
      <slot
        name="item"
        v-bind="item"
        :item="item"
        :index="index"
        :depth="depth"
      >
        <button
          v-if="item.children && item.children.length"
          type="button"
          :class="$c('tree-item-expand-switcher')"
          tabindex="-1"
          :disabled="item.disabled"
          @click.stop="toggle(item, index, depth)"
        >
          <veui-icon :name="icons.collapse"/>
        </button>
        <slot
          name="item-prepend"
          v-bind="item"
          :item="item"
          :index="index"
          :depth="depth"
        />
        <div :class="$c('tree-item-label')">
          <slot
            name="item-label"
            v-bind="item"
            :item="item"
            :index="index"
            :depth="depth"
          >
            {{ item.label }}
          </slot>
        </div>
        <slot
          name="item-append"
          v-bind="item"
          :item="item"
          :index="index"
          :depth="depth"
        />
      </slot>
    </div>
    <veui-expand-transition :name="$c('tree-item-group')">
      <veui-tree-node
        v-if="item.expanded && item.children && item.children.length"
        :datasource="item.children"
        :depth="depth + 1"
        :icons="icons"
        :selectable="selectable"
        :selected="selected"
        :checkable="checkable"
        @click="handleChildClick(item, ...arguments)"
        @toggle="handleChildToggle"
      >
        <template
          v-for="(_, name) in allSlots"
          :slot="name"
          slot-scope="props"
        >
          <slot
            :name="name"
            v-bind="props"
          />
        </template>
      </veui-tree-node>
    </veui-expand-transition>
  </li>
</ul>
</template>

<script>
import Icon from '../Icon'
import ExpandTransition from '../_ExpandTransition'
import { closest } from '../../utils/dom'
import { getTypedAncestor } from '../../utils/helper'
import prefix from '../../mixins/prefix'
import '../../common/uiTypes'

export default {
  name: 'veui-tree-node',
  uiTypes: ['transparent'],
  components: {
    'veui-icon': Icon,
    'veui-expand-transition': ExpandTransition
  },
  mixins: [prefix],
  props: {
    icons: Object,
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    depth: {
      type: Number,
      default: 1
    },
    checkable: {
      type: Boolean
    },
    selectable: {
      type: Boolean
    },
    /* eslint-disable vue/require-prop-types */
    selected: {}
    /* eslint-ensable vue/require-prop-types */
  },
  data () {
    return {
      focusVisible: this.datasource.map(_ => false)
    }
  },
  computed: {
    allSlots () {
      return {
        ...this.$slots,
        ...this.$scopedSlots
      }
    },
    tree () {
      return getTypedAncestor(this, 'tree')
    }
  },
  watch: {
    datasource (val) {
      this.focusVisible = val.map(_ => false)
    }
  },
  methods: {
    toggle (item, index, ...args) {
      this.$emit('toggle', item, index, ...args)
    },
    click (item, parents, ...extraArgs) {
      if (item.disabled) {
        return
      }

      this.$emit('click', item, parents, ...extraArgs)
    },
    isClickable (item) {
      return (
        this.selectable ||
        this.checkable ||
        (item.children && item.children.length)
      )
    },
    isSelected ({ value }) {
      return this.selected === value
    },
    handleChildToggle (...args) {
      this.$emit('toggle', ...args)
    },
    handleChildClick (parentItem, currentItem, parents, ...extraArgs) {
      this.$emit('click', currentItem, [...parents, parentItem], ...extraArgs)
    },
    getFocusSelector () {
      return `.${this.$c('tree-item')}:not(.${this.$c('tree-item-disabled')})`
    },
    focusLevel (up = true) {
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
          itemEl.focus()
        })
      }
    },
    navigate (current, forward = false, hitBoundary = false) {
      let context = (this.tree || this).$el
      let items = [...context.querySelectorAll(this.getFocusSelector())]
      let index = items.indexOf(current)

      if (hitBoundary) {
        items[forward ? items.length - 1 : 0].focus()
        return
      }

      let targetIndex =
        index === -1
          ? 0
          : ((forward ? index + 1 : index - 1) + items.length) % items.length
      items[targetIndex].focus()
    },
    handleKeydown (e, item, index, depth) {
      let passive = false
      switch (e.key) {
        case 'Enter':
          this.toggle(item, index, depth)
          break
        case 'Left':
        case 'ArrowLeft':
          if (item.expanded) {
            this.toggle(item, index, depth, false)
          } else {
            this.focusLevel()
          }
          break
        case 'Right':
        case 'ArrowRight':
          if (item.expanded) {
            this.focusLevel(false)
          } else {
            this.toggle(item, index, depth, true)
            this.focusLevel(false)
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
    /**
     * Special hack to prevent state lost
     * upon component rerender
     */
    fixFocus (i) {
      this.$nextTick(() => {
        this.$set(this.focusVisible, i, true)
      })
    }
  }
}
</script>
