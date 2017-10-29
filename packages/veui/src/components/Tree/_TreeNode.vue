<template>
  <ul :class="{'veui-tree-item-group': depth > 1, 'veui-tree': depth === 1}">
    <li v-for="(option, index) in datasource"
      :key="option.value">
      <div class="veui-tree-item"
        :class="{'veui-tree-item-expanded': option.expanded}"
        @click="click(option, [], index, depth)">
        <slot name="item" :option="option" :index="index" :depth="depth">
          <span class="veui-tree-item-expand-switcher"
            v-if="option.children && option.children.length"
            @click.stop="toggle(option, index, depth)">
            <veui-icon :name="icons.collapsed"></veui-icon>
          </span>
          <div class="veui-tree-item-label">
            <slot name="item-label" :option="option" :index="index" :depth="depth">{{ option.label }}</slot>
          </div>
        </slot>
      </div>

      <veui-tree-node v-if="option.children && option.children.length"
        :datasource="option.children"
        :depth="depth + 1"
        @click="handleChildClick(option, ...arguments)"
        @toggle="handleChildToggle"
        :item-click="itemClick"
        :icons="icons">
        <template slot="item" scope="props">
          <slot name="item" v-bind="props">
            <span class="veui-tree-item-expand-switcher"
              v-if="props.option.children && props.option.children.length"
              @click.stop="toggle(props.option, props.index, depth + 1)">
              <veui-icon :name="icons.collapsed"></veui-icon>
            </span>
            <div class="veui-tree-item-label">
              <slot name="item-label" v-bind="props">{{ props.option.label }}</slot>
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
      validate (value) {
        return includes(['toggle', 'none'], value)
      }
    }
  },
  methods: {
    toggle (...args) {
      this.$emit('toggle', ...args)
    },
    click (option, parents, ...extraArgs) {
      this.$emit('click', option, parents, ...extraArgs)

      if (this.itemClick === 'toggle' && option.children && option.children.length) {
        this.toggle(option, ...extraArgs)
      }
    },
    handleChildToggle (...args) {
      this.$emit('toggle', ...args)
    },
    handleChildClick (parentOption, currentOption, parents, ...extraArgs) {
      this.$emit('click', currentOption, [...parents, parentOption], ...extraArgs)
    }
  }
}
</script>
