<template>
<ul
  :class="{
    'veui-tree-item-group': depth > 1,
    'veui-tree': depth === 1
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
        'veui-tree-item': true,
        'veui-tree-item-expanded': item.expanded,
        'veui-tree-item-clickable': clickable,
        'veui-tree-item-hidden': item.hidden,
        'veui-tree-item-disabled': item.disabled
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
          class="veui-tree-item-expand-switcher"
          tabindex="-1"
          @click.stop="toggle(item, index, depth)"
        >
          <veui-icon :name="icons.collapse"/>
        </button>
        <slot
          name="item-prepend"
          :item="item"
          :index="index"
          :depth="depth"
        />
        <div class="veui-tree-item-label">
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
          :item="item"
          :index="index"
          :depth="depth"
        />
      </slot>
    </div>

    <veui-tree-node
      v-if="item.expanded && item.children && item.children.length"
      :datasource="item.children"
      :depth="depth + 1"
      :action="action"
      :icons="icons"
      @click="handleChildClick(item, ...arguments)"
      @toggle="handleChildToggle"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        <slot
          name="item"
          v-bind="props"
        >
          <button
            v-if="props.item.children && props.item.children.length"
            type="button"
            class="veui-tree-item-expand-switcher"
            tabindex="-1"
            @click.stop="toggle(props.item, props.index, depth + 1)"
          >
            <veui-icon :name="icons.collapse"/>
          </button>
          <slot
            name="item-prepend"
            :item="props.item"
            :index="props.index"
            :depth="depth + 1"
          />
          <div class="veui-tree-item-label">
            <slot
              name="item-label"
              v-bind="props"
            >
              {{ props.item.label }}
            </slot>
          </div>
          <slot
            name="item-append"
            :item="props.item"
            :index="props.index"
            :depth="depth + 1"
          />
        </slot>
      </template>
    </veui-tree-node>
  </li>
</ul>
</template>

<script>
import Icon from '../Icon'
import { includes } from 'lodash'
import { closest } from '../../utils/dom'
import { getTypedAncestor } from '../../utils/helper'

const ITEM_SELECTOR = '.veui-tree-item:not(.veui-tree-item-disabled)'

export default {
  name: 'veui-tree-node',
  components: {
    'veui-icon': Icon
  },
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
    // 点击整个 item 区域，是否触发展开/收起
    action: {
      type: String,
      validator (value) {
        if (!value == null) {
          return true
        }
        return includes(['toggle', 'check', 'none'], value)
      }
    }
  },
  data () {
    return {
      focusVisible: this.datasource.map(_ => false)
    }
  },
  computed: {
    clickable () {
      return this.action !== 'none'
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
      this.$emit('click', item, parents, ...extraArgs)

      if (this.action === 'toggle' && item.children && item.children.length) {
        this.toggle(item, ...extraArgs)
      }
    },
    handleChildToggle (...args) {
      this.$emit('toggle', ...args)
    },
    handleChildClick (parentItem, currentItem, parents, ...extraArgs) {
      this.$emit('click', currentItem, [...parents, parentItem], ...extraArgs)
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

      let itemEl = el.querySelector(ITEM_SELECTOR)
      if (itemEl) {
        this.$nextTick(() => {
          itemEl.focus()
        })
      }
    },
    navigate (current, forward = false, hitBoundary = false) {
      let context = (this.tree || this).$el
      let items = [...context.querySelectorAll(ITEM_SELECTOR)]
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
