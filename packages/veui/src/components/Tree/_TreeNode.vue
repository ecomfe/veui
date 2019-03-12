<template>
<ul :class="{'veui-tree-item-group': depth > 1, 'veui-tree': depth === 1}">
  <li
    v-for="(item, index) in datasource"
    :key="item.value"
  >
    <div
      ref="item"
      :class="{
        'veui-tree-item': true,
        'veui-tree-item-expanded': item.expanded,
        'veui-tree-item-clickable': clickable,
        'focus-visible': focusVisible[index]
      }"
      tabindex="0"
      @click="click(item, [], index, depth)"
      @keydown="handleKeydown($event, item, index, depth)"
      @focus="handleFocus(index)"
      @blur="handleBlur(index)"
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
          class="veui-tree-item-expand-switcher"
          @click.stop="toggle(item, index, depth)"
        >
          <veui-icon :name="icons.collapse"/>
        </button>
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
      </slot>
    </div>

    <veui-tree-node
      v-if="item.expanded && item.children && item.children.length"
      :datasource="item.children"
      :depth="depth + 1"
      :item-click="itemClick"
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
            class="veui-tree-item-expand-switcher"
            @click.stop="toggle(props.item, props.index, depth + 1)"
          >
            <veui-icon :name="icons.collapse"/>
          </button>
          <div class="veui-tree-item-label">
            <slot
              name="item-label"
              v-bind="props"
            >
              {{ props.item.label }}
            </slot>
          </div>
        </slot>
      </template>
    </veui-tree-node>
  </li>
</ul>
</template>

<script>
import Icon from '../Icon'
import { includes } from 'lodash'
import { closest, hasClass } from '../../utils/dom'
import { getTypedAncestor } from '../../utils/helper'

const ITEM_SELECTOR = '.veui-tree-item'

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
    itemClick: {
      type: String,
      default: 'none',
      validator (value) {
        return includes(['toggle', 'none'], value)
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
      return this.itemClick !== 'none'
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

      if (
        this.itemClick === 'toggle' &&
        item.children &&
        item.children.length
      ) {
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
    navigate (current, forward = false) {
      let context = (getTypedAncestor(this, 'tree') || this).$el
      let items = [...context.querySelectorAll(ITEM_SELECTOR)]
      let index = items.indexOf(current)
      let targetIndex =
        index === -1 ? 0 : (forward ? index + 1 : index - 1) % items.length
      items[targetIndex].focus()
    },
    handleKeydown (e, item, index, depth) {
      let passive = false
      switch (e.key) {
        case 'Left':
        case 'ArrowLeft':
          if (item.expanded) {
            this.toggle(item, index, depth, false)
            this.fixFocus(index)
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
            this.fixFocus(index)
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
    handleFocus (i) {
      this.$nextTick(() => {
        if (hasClass(this.$refs.item[i], 'focus-visible')) {
          this.$set(this.focusVisible, i, true)
        }
      })
    },
    handleBlur (i) {
      this.$set(this.focusVisible, i, false)
    },
    fixFocus (i) {
      this.$nextTick(() => {
        this.$set(this.focusVisible, i, true)
      })
    }
  }
}
</script>
