<template>
  <ul :class="{'veui-tree-item-group': depth > 1, 'veui-tree': depth === 1}">
    <li v-for="(option, index) in datasource"
      :key="option.value"
      v-show="!option.hidden">
      <div class="veui-tree-item"
        :class="itemClasses[index]"
        @click="click(option, [], index, depth)">
        <slot name="item" :option="option" :index="index" :depth="depth">
          <span class="veui-tree-item-expand-switcher"
            v-if="option.children && option.children.length"
            @click.stop="() => option.expanded ? collapse(option, index) : expand(option, index)">
            <veui-icon :name="icons.collapsed"></veui-icon>
          </span>
          <div class="veui-tree-item-label">
            <slot name="item-label" :option="option" :index="index" :depth="depth">{{ option.label }}</slot>
          </div>
        </slot>
      </div>

      <veui-tree v-if="option.children && option.children.length"
        :datasource="option.children"
        :depth="depth + 1"
        @click="handleClick(option, ...arguments)"
        @expand="handleExpand"
        @collapse="handleCollapse"
        :item-click="itemClick">
        <template slot="item" scope="props">
          <slot name="item" v-bind="props">
            <span class="veui-tree-item-expand-switcher"
              v-if="props.option.children && props.option.children.length"
              @click.stop="() => props.option.expanded ? collapse(props.option, props.index) : expand(props.option, props.index)">
              <veui-icon :name="icons.collapsed"></veui-icon>
            </span>
            <div class="veui-tree-item-label">
              <slot name="item-label" v-bind="props">{{ props.option.label }}</slot>
            </div>
          </slot>
        </template>
      </veui-tree>

    </li>
  </ul>
</template>

<script>
import Icon from './Icon'
import { icons } from '../mixins'
import { includes } from 'lodash'

export default {
  name: 'veui-tree',
  components: {
    'veui-icon': Icon
  },
  mixins: [icons],
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    // 内部使用
    depth: {
      type: Number,
      default: 1
    },
    // 点击整个 item 区域，是否触发展开/收起
    itemClick: {
      type: String,
      default: 'none',
      validate (value) {
        return includes(['toggle', 'none'], value)
      }
    }
  },
  computed: {
    itemClasses () {
      return this.datasource.map(option => {
        return {
          'veui-tree-expanded': option.expanded
        }
      })
    }
  },
  methods: {
    expand (option, index, depth = this.depth) {
      this.$set(option, 'expanded', true)
      this.$emit('expand', option, index, depth)
    },
    collapse (option, index, depth = this.depth) {
      this.$set(option, 'expanded', false)
      this.$emit('collapse', option, index, depth)
    },
    click (option, parents, index, depth) {
      this.$emit('click', option, parents, index, depth)

      if (this.itemClick === 'toggle' && option.children && option.children.length) {
        option.expanded ? this.collapse(option, index, depth) : this.expand(option, index, depth)
      }
    },
    handleClick (parentOption, currentOption, parents, index, depth) {
      this.$emit('click', currentOption, [...parents, parentOption], index, depth)
    },
    handleExpand (option, index, depth) {
      this.$emit('expand', option, index, depth)
    },
    handleCollapse (option, index, depth) {
      this.$emit('collapse', option, index, depth)
    }
  }
}
</script>
