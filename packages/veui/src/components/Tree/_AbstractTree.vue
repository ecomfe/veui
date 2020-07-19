<template>
<ul
  :class="$c('abstract-tree')"
  role="tree"
>
  <li
    v-for="(item, index) in items"
    :key="index"
    role="treeitem"
    :class="$c('abstract-tree-item-wrapper')"
  >
    <slot
      name="item"
      :depth="depth"
      :item="item"
      :index="index"
      :expanded="isExpanded(item)"
      :parents="parents"
    />
    <veui-expand-transition :name="$c('sub-tree')">
      <abstract-tree
        v-if="
          isExpanded(item) && item[childrenKey] && item[childrenKey].length
        "
        :items="item[childrenKey]"
        :depth="depth + 1"
        :children-key="childrenKey"
        :expanded="expanded"
        :matches="matches"
        :parents="[...parents, item]"
        :group-class="groupClass"
        :class="realGroupClass"
      >
        <template
          slot="item"
          slot-scope="props"
        >
          <slot
            name="item"
            v-bind="props"
          />
        </template>
      </abstract-tree>
    </veui-expand-transition>
  </li>
</ul>
</template>

<script>
import prefix from '../../mixins/prefix'
import ExpandTransition from '../_ExpandTransition'
import { mergeClasses } from '../../utils/helper'

export default {
  name: 'abstract-tree',
  components: {
    'veui-expand-transition': ExpandTransition
  },
  mixins: [prefix],
  uiTypes: ['transparent'],
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    // depth, parents 是递归时的内部状态，外部不要传递
    depth: {
      type: Number,
      default: 1
    },
    parents: {
      type: Array,
      default () {
        return []
      }
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    expanded: {
      type: Array,
      default () {
        return []
      }
    },
    matches: {
      type: Function,
      default (val, item) {
        return val === item.value
      }
    },
    groupClass: {
      type: [String, Object]
    }
  },
  computed: {
    realGroupClass () {
      return mergeClasses(this.$c('abstract-tree-item-group'), this.groupClass)
    }
  },
  methods: {
    isExpanded (item) {
      return (this.expanded || []).some(i => this.matches(i, item))
    }
  }
}
</script>
