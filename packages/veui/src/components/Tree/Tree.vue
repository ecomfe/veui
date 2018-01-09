<template>
  <veui-tree-node :datasource="localDatasource"
    :item-click="itemClick"
    :icons="icons"
    @toggle="toggle"
    @click="handleItemClick"
    v-if="this.$scopedSlots.item">
    <template slot="item" scope="props">
      <slot name="item" v-bind="props"></slot>
    </template>
  </veui-tree-node>
  <veui-tree-node :datasource="localDatasource"
    :item-click="itemClick"
    :icons="icons"
    @toggle="toggle"
    @click="handleItemClick"
    v-else-if="this.$scopedSlots['item-label']">
    <template slot="item-label" scope="props">
      <slot name="item-label" v-bind="props"></slot>
    </template>
  </veui-tree-node>
  <veui-tree-node :datasource="localDatasource"
    :item-click="itemClick"
    :icons="icons"
    @toggle="toggle"
    @click="handleItemClick"
    v-else></veui-tree-node>
</template>

<script>
import TreeNode from './_TreeNode'
import { includes, remove, clone, omit, filter, uniq } from 'lodash'
import { icons } from '../../mixins'

export default {
  name: 'veui-tree',
  components: {
    'veui-tree-node': TreeNode
  },
  mixins: [icons],
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
      let walk = (options, expands) => {
        return options.map(option => {
          let localOption = omit(option, 'children')
          if (option.children && option.children.length) {
            let expanded = !!remove(expands, value => value === option.value).length
            localOption.expanded = expanded
            localOption.children = walk(option.children, expands)
          }
          return localOption
        })
      }
      this.localDatasource = walk(this.datasource, clone(expands))
    },
    toggle (option, index, depth) {
      option.expanded = !option.expanded

      let expands = option.expanded
        ? uniq([...this.expands, option.value])
        : filter(
          this.expands,
          value => value !== option.value
        )
      this.$emit('update:expands', expands)

      this.$emit(option.expanded ? 'expand' : 'collapse', option, index, depth)
    },
    handleItemClick (...args) {
      this.$emit('click', ...args)
    }
  }
}
</script>
