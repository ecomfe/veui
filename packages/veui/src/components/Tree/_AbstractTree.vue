<template>
<ul :class="$c('abstract-tree')" role="tree">
  <li
    v-for="(item, index) in items"
    :key="getKey(item, index)"
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
        v-if="isExpanded(item)"
        :items="item[childrenKey]"
        :depth="depth + 1"
        :children-key="childrenKey"
        :expanded="expanded"
        :expand="expand"
        :parents="[...parents, item]"
        :group-class="groupClass"
        :class="realGroupClass"
      >
        <template slot="item" slot-scope="props">
          <slot name="item" v-bind="props"/>
        </template>
      </abstract-tree>
    </veui-expand-transition>
  </li>
</ul>
</template>

<script>
import prefix from '../../mixins/prefix'
import ExpandTransition from '../_ExpandTransition'
import { hasChildren } from '../../utils/datasource'

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
    // 更加通用的控制何时渲染subtree
    expand: Function,
    groupClass: {
      type: [String, Object]
    }
  },
  computed: {
    realGroupClass () {
      return [this.$c('abstract-tree-item-group'), this.groupClass]
    }
  },
  methods: {
    isExpanded (item) {
      // 先用 name 再用 value 来控制 expanded（父节点没有 value 的情况也能展开）
      let hasCh = hasChildren(item, this.childrenKey)
      if (!hasCh) {
        return false
      }
      return typeof this.expand === 'function'
        ? this.expand(item, this.expanded)
        : includesItem(this.expanded, item)
    },
    getKey ({ value }, fallback) {
      return ['string', 'number'].indexOf(typeof value) >= 0
        ? value
        : `__tree_key_${fallback}__`
    }
  }
}

export function includesItem (collection, { name, value }) {
  return (collection || []).some((i) => {
    return name != null ? i === name : value != null ? i === value : false
  })
}
</script>
