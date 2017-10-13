<template>
  <ul :class="{'veui-tree-item-group': depth > 1, 'veui-tree': depth === 1}">
    <li v-for="(option, index) in options" :key="option.value" v-show="!option.hidden">
      <div class="veui-tree-item"
        :class="itemClasses[index]"
        ref="items"
        @click="select(option, [], index, depth)">
        <slot name="item" :option="option" :index="index" :depth="depth">
          <span class="veui-tree-item-expand-switcher"
            :class="{expanded: option.expanded}"
            v-if="option.children && option.children.length"
            @click.stop="() => option.expanded ? collapse(option, index) : expand(option, index)">
            <slot name="item-expand-icon" :option="option" :index="index" :depth="depth">
              <veui-icon :name="icons.expand"></veui-icon>
            </slot>
          </span>
          <span class="veui-tree-item-label">
            <slot name="item-label" :option="option" :index="index" :depth="depth">{{ option.label }}</slot>
          </span>
          <span class="veui-tree-item-right">
            <slot name="item-right" :option="option" :index="index" :depth="depth"></slot>
          </span>
        </slot>
      </div>

      <veui-tree :class="{expanded: option.expanded}"
        v-if="option.children && option.children.length"
        :options="option.children"
        :offset-left="offsetLeft"
        :depth="depth + 1"
        @select="(opt, parents, ...extra) => emit('select', opt, [...parents, option], ...extra)"
        @expand="(...args) => emit('expand', ...args)"
        @collapse="(...args) => emit('collapse', ...args)"
        :item-expandable="itemExpandable">
        <template slot="item" scope="props">
          <slot name="item" v-bind="props">
            <span class="veui-tree-item-expand-switcher"
              :class="{expanded: props.option.expanded}"
              v-if="props.option.children && props.option.children.length"
              @click.stop="() => props.option.expanded ? collapse(props.option, props.index) : expand(props.option, props.index)">
              <slot name="item-expand-switcher" v-bind="props">
                <veui-icon :name="icons.expand"></veui-icon>
              </slot>
            </span>
            <span class="veui-tree-item-label">
              <slot name="item-label" v-bind="props">{{ props.option.label }}</slot>
            </span>
            <span class="veui-tree-item-right">
              <slot name="item-right" v-bind="props"></slot>
            </span>
          </slot>
        </template>
      </veui-tree>

    </li>
  </ul>
</template>

<script>
import Icon from './Icon'
import { each } from 'lodash'
import { icons } from '../mixins'

export default {
  name: 'veui-tree',
  components: {
    'veui-icon': Icon
  },
  mixins: [icons],
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    offsetLeft: {
      type: Number,
      default () {
        return 18
      }
    },
    depth: {
      type: Number,
      default () {
        return 1
      }
    },
    // 点击整个 item 区域，是否触发展开/收起
    itemExpandable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    itemClasses () {
      return this.options.map(option => {
        return {
          selected: option.selected ||
            (
              option.children &&
              option.children.length &&
              option.allCount === option.children.length
            )
        }
      })
    },
    itemPaddingLeft () {
      return (this.depth - 1) * this.offsetLeft
    }
  },
  methods: {
    emit (...args) {
      this.$emit(...args)
    },
    expand (option, index, depth = this.depth) {
      this.$set(option, 'expanded', true)
      this.emit('expand', option, index, depth)
    },
    collapse (option, index, depth = this.depth) {
      this.$set(option, 'expanded', false)
      this.emit('collapse', option, index, depth)
    },
    select (option, parents, index, depth) {
      this.emit('select', option, parents, index, depth)

      if (this.itemExpandable && option.children && option.children.length) {
        option.expanded ? this.collapse(option, index, depth) : this.expand(option, index, depth)
      }
    },
    setItemsPaddingLeft () {
      this.$nextTick(() => {
        each(this.$refs.items, item => {
          if (!item.style.paddingLeft) {
            item.style.paddingLeft = (parseFloat(getComputedStyle(item).paddingLeft) + this.itemPaddingLeft) + 'px'
          }
        })
      })
    }
  },
  mounted () {
    this.setItemsPaddingLeft()
  },
  updated () {
    this.setItemsPaddingLeft()
  }
}
</script>
