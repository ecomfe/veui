<template>
  <ul :class="{'veui-tree-item-group': depth > 1, 'veui-tree': depth === 1}">
    <li v-for="(option, index) in datasource"
      :key="option.value">
      <div class="veui-tree-item"
        :class="itemClasses[index]"
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

      <veui-tree v-if="option.children && option.children.length"
        :datasource="option.children"
        :depth="depth + 1"
        @click="handleChildClick(option, ...arguments)"
        @expand="handleChildExpand"
        @collapse="handleChildCollapse"
        :item-click="itemClick">
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
          'veui-tree-item-expanded': option.expanded
        }
      })
    }
  },
  methods: {
    toggle (option, index, depth) {
      this.$set(option, 'expanded', !option.expanded)
      this.$emit(option.expanded ? 'collapse' : 'expand', option, index, depth)
    },
    click (option, parents, index, depth) {
      this.$emit('click', option, parents, index, depth)

      if (this.itemClick === 'toggle' && option.children && option.children.length) {
        this.toggle(option, index, depth)
      }
    },
    handleChildClick (parentOption, currentOption, parents, index, depth) {
      this.$emit('click', currentOption, [...parents, parentOption], index, depth)
    },
    handleChildExpand (option, index, depth) {
      this.$emit('expand', option, index, depth)
    },
    handleChildCollapse (option, index, depth) {
      this.$emit('collapse', option, index, depth)
    }
  }
}
</script>
