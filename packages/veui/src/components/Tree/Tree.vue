<template>
  <veui-tree-inner :datasource="datasource"
    :item-click="itemClick"
    :expand-map="expandMap"
    :icons="icons"
    @toggle="toggle"
    @click="handleItemClick"
    v-if="this.$scopedSlots.item">
    <template slot="item" scope="props">
      <slot name="item" v-bind="props"></slot>
    </template>
  </veui-tree-inner>
  <veui-tree-inner :datasource="datasource"
    :item-click="itemClick"
    :expand-map="expandMap"
    :icons="icons"
    @toggle="toggle"
    @click="handleItemClick"
    v-else-if="this.$scopedSlots['item-label']">
    <template slot="item-label" scope="props">
      <slot name="item-label" v-bind="props"></slot>
    </template>
  </veui-tree-inner>
  <veui-tree-inner :datasource="datasource"
    :item-click="itemClick"
    :expand-map="expandMap"
    :icons="icons"
    @toggle="toggle"
    @click="handleItemClick"
    v-else></veui-tree-inner>
</template>

<script>
import TreeInner from './_TreeInner'
import { includes, remove, clone, each } from 'lodash'
import { icons } from '../../mixins'

export default {
  name: 'veui-tree',
  components: {
    'veui-tree-inner': TreeInner
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
      validate (value) {
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
      expandMap: {}
    }
  },
  created () {
    this.parseExpands()
  },
  watch: {
    expands () {
      this.parseExpands()
    },
    datasource () {
      this.parseExpands()
    }
  },
  methods: {
    parseExpands (expands = this.expands) {
      let walk = (options, expands) => {
        options.forEach(option => {
          if (option.children && option.children.length) {
            if (!this.expandMap[option.value]) {
              this.$set(this.expandMap, option.value, {})
            }

            let expanded = !!remove(expands, value => value === option.value).length
            this.$set(
              this.expandMap[option.value],
              'expanded',
              expanded
            )

            walk(option.children, expands)
          }
        })
      }
      walk(this.datasource, clone(expands))
    },
    toggle (option, index, depth) {
      this.expandMap[option.value].expanded = !this.expandMap[option.value].expanded

      let keys = []
      each(this.expandMap, ({ expanded }, key) => {
        if (expanded) {
          keys.push(key)
        }
      })
      this.$emit('update:expands', keys)

      if (this.expandMap[option.value].expanded) {
        this.$emit('expand', option, index, depth)
      } else {
        this.$emit('collapse', option, index, depth)
      }
    },
    handleItemClick (option, parents, index, depth) {
      this.$emit('click', option, parents, index, depth)
    }
  }
}
</script>
