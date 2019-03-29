<template>
<veui-tree-node
  role="tree"
  :datasource="localDatasource"
  :item-click="itemClick"
  :icons="icons"
  :ui="realUi"
  @toggle="toggle"
  @click="handleItemClick"
  @focusin.native="focused = true"
  @focusout.native="focused = false"
>
  <template
    v-if="$scopedSlots.item"
    slot="item"
    slot-scope="props"
  >
    <slot
      name="item"
      v-bind="props"
    />
  </template>
  <template
    v-else-if="$scopedSlots['item-label']"
    slot="item-label"
    slot-scope="props"
  >
    <slot
      name="item-label"
      v-bind="props"
    />
  </template>
</veui-tree-node>
</template>

<script>
import TreeNode from './_TreeNode'
import { includes, remove, clone, omit, filter, uniq } from 'lodash'
import ui from '../../mixins/ui'
import warn from '../../utils/warn'

export default {
  name: 'veui-tree',
  uiTypes: ['tree'],
  components: {
    'veui-tree-node': TreeNode
  },
  mixins: [ui],
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    // 点击整个 item 区域，是否触发展开/收起
    itemClick: {
      type: String,
      default: 'none',
      validator (value) {
        return includes(['toggle', 'none'], value)
      }
    },
    /**
     * @deprecated
     */
    expands: {
      type: Array,
      validator (val) {
        if (val != null) {
          warn(
            '[veui-tree] `expands` is deprecated and will be removed in `1.0.0`. Use `expanded` instead.',
            this
          )
        }
        return true
      }
    },
    // 当前有哪些节点是展开的
    expanded: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localDatasource: [],
      focused: false
    }
  },
  computed: {
    realExpanded () {
      return this.expands || this.expanded
    }
  },
  watch: {
    realExpanded () {
      this.parseExpanded()
    },
    datasource: {
      handler () {
        this.parseExpanded()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    parseExpanded (expanded = this.realExpanded) {
      let walk = (items, expanded) => {
        return items.map(item => {
          let localOption = omit(item, 'children')
          if (item.children && item.children.length) {
            localOption.expanded =
              remove(expanded, value => value === item.value).length !== 0
            localOption.children = walk(item.children, expanded)
          }
          return localOption
        })
      }
      this.localDatasource = walk(this.datasource, clone(expanded))
    },
    toggle (item, index, depth, val) {
      if (
        val === item.expanded ||
        !item.children ||
        item.children.length === 0
      ) {
        return
      }
      item.expanded = !item.expanded

      let expanded = item.expanded
        ? uniq([...this.realExpanded, item.value])
        : filter(this.realExpanded, value => value !== item.value)
      this.$emit('update:expanded', expanded)

      /**
       * TODO: remove on 1.0
       */
      this.$emit('update:expands', expanded)

      this.$emit(item.expanded ? 'expand' : 'collapse', item, index, depth)
    },
    handleItemClick (...args) {
      this.$emit('click', ...args)
    }
  }
}
</script>
