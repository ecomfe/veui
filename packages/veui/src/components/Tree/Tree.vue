<template>
<veui-tree-node
  v-if="this.$scopedSlots.item"
  :datasource="localDatasource"
  :item-click="itemClick"
  :icons="icons"
  :ui="realUi"
  @toggle="toggle"
  @click="handleItemClick"
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
</veui-tree-node>
<veui-tree-node
  v-else-if="this.$scopedSlots['item-label']"
  :datasource="localDatasource"
  :item-click="itemClick"
  :icons="icons"
  :ui="realUi"
  @toggle="toggle"
  @click="handleItemClick"
>
  <template
    slot="item-label"
    slot-scope="props"
  >
    <slot
      name="item-label"
      v-bind="props"
    />
  </template>
</veui-tree-node>
<veui-tree-node
  v-else
  :datasource="localDatasource"
  :item-click="itemClick"
  :icons="icons"
  :ui="realUi"
  @toggle="toggle"
  @click="handleItemClick"
/>
</template>

<script>
import TreeNode from './_TreeNode'
import { includes, remove, clone, omit, filter, uniq } from 'lodash'
import ui from '../../mixins/ui'

export default {
  name: 'veui-tree',
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
    // 当前有哪些节点是展开的
    expands: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localDatasource: []
    }
  },
  watch: {
    expands () {
      this.parseExpands()
    },
    datasource: {
      handler () {
        this.parseExpands()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    parseExpands (expands = this.expands) {
      let walk = (items, expands) => {
        return items.map(item => {
          let localOption = omit(item, 'children')
          if (item.children && item.children.length) {
            let expanded = !!remove(expands, value => value === item.value).length
            localOption.expanded = expanded
            localOption.children = walk(item.children, expands)
          }
          return localOption
        })
      }
      this.localDatasource = walk(this.datasource, clone(expands))
    },
    toggle (item, index, depth) {
      item.expanded = !item.expanded

      let expands = item.expanded
        ? uniq([...this.expands, item.value])
        : filter(
          this.expands,
          value => value !== item.value
        )
      this.$emit('update:expands', expands)

      this.$emit(item.expanded ? 'expand' : 'collapse', item, index, depth)
    },
    handleItemClick (...args) {
      this.$emit('click', ...args)
    }
  }
}
</script>
