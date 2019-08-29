<template>
<veui-tree-node
  role="tree"
  :datasource="localDatasource"
  :item-click="itemClick"
  :icons="icons"
  :ui="realUi"
  :class="{
    'veui-tree-disabled': realDisabled || realReadonly
  }"
  @toggle="toggle"
  @click="handleItemClick"
  @focusin.native="focused = true"
  @focusout.native="focused = false"
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
  <template
    slot="item-label"
    slot-scope="props"
  >
    <slot
      name="item-label"
      v-bind="props"
    />
  </template>
  <template
    slot="item-prepend"
    slot-scope="props"
  >
    <slot
      name="item-prepend"
      v-bind="props"
    >
      <veui-checkbox
        v-if="selectable"
        class="veui-tree-item-select"
        :checked="props.item.visuallySelected"
        :indeterminate="props.item.partialSelected"
        :disabled="props.item.disabled || realDisabled || realReadonly"
        :ui="realUi"
        @change="checked => handleItemSelect(checked, props.item)"
      />
    </slot>
  </template>
  <template
    slot="item-append"
    slot-scope="props"
  >
    <slot
      name="item-append"
      v-bind="props"
    />
  </template>
</veui-tree-node>
</template>

<script>
import TreeNode from './_TreeNode'
import {
  includes,
  remove,
  clone,
  omit,
  filter,
  uniq,
  xor,
  isString
} from 'lodash'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import warn from '../../utils/warn'
import Checkbox from '../Checkbox'
import { focusIn } from '../../utils/dom'

export default {
  name: 'veui-tree',
  uiTypes: ['tree'],
  components: {
    'veui-tree-node': TreeNode,
    'veui-checkbox': Checkbox
  },
  mixins: [ui, input],
  model: {
    prop: 'selected',
    event: 'select'
  },
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
    },
    selectable: {
      type: Boolean
    },
    selected: {
      type: Array,
      default () {
        return []
      }
    },
    keys: {
      type: [String, Function],
      default: 'value'
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
    },
    realKeys () {
      if (isString(this.keys)) {
        return source => source[this.keys]
      }

      return this.keys
    }
  },
  watch: {
    realExpanded () {
      this.parseExpanded()
    },
    datasource: {
      handler (val) {
        this.localDatasource = []
        let walk = (datasource, items, expanded) => {
          datasource.forEach((source, index) => {
            let item = omit(source, 'children')
            item.value = this.realKeys(source)
            if (this.hasChild(source)) {
              item.expanded =
                remove(expanded, value => value === item.value).length !== 0

              this.$set(item, 'children', [])
              walk(source.children, item.children, expanded)
            }
            this.$set(items, index, item)
          })
        }
        walk(val, this.localDatasource, clone(this.realExpanded))

        if (this.selectable) {
          this.correct()
        }
      },
      deep: true,
      immediate: true
    },

    selected (val, oldVal) {
      if (
        xor(val, oldVal).length ||
        xor(val, this.getSelectedValuesFromDatasource()).length
      ) {
        this.correct()
      }
    }
  },
  methods: {
    // 判断节点是否被选中：
    // 1、如果是叶子节点，直接根据 selected 属性判断。
    // 2、如果是非叶子节点，则该节点下所有子级节点都全部选择了，当前节点才算被选中了。
    isSelected (item) {
      return this.hasChild(item)
        ? item.allCount === item.children.length
        : item.selected
    },
    // 判断节点是否被部分选中：
    isPartialSelected (item) {
      return (
        this.hasChild(item) &&
        (item.allCount < item.children.length &&
          item.allCount + item.partCount > 0)
      )
    },
    getSelectedValuesFromDatasource () {
      let values = []
      let walk = (items = this.localDatasource) => {
        items.forEach(item => {
          if (item.partCount || item.allCount || item.selected) {
            if (this.hasChild(item)) {
              walk(item.children)
            } else if (item.selected) {
              values.push(item.value)
            }
          }
        })
      }
      walk()
      return values
    },
    emitSelect () {
      this.$emit('select', this.getSelectedValuesFromDatasource())
    },
    parseExpanded (expanded = this.realExpanded) {
      let walk = (items, expanded) => {
        items.forEach(item => {
          if (item.children && item.children.length) {
            this.$set(
              item,
              'expanded',
              remove(expanded, value => value === item.value).length !== 0
            )

            walk(item.children, expanded)
          }
        })
      }
      walk(this.localDatasource, clone(expanded))
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
    },
    handleItemSelect (checked, item) {
      if (checked) {
        this.select(item)
      } else {
        this.remove(item)
      }
    },

    // 从左侧添加选中项
    //
    // 接收的参数为：
    //  item ：当前被选中的节点
    //
    // 注意： parents 来自于 this.localDatasource ，内部的节点数据和 this.localDatasource 中的节点数据是相等的。
    //
    // 执行步骤为：
    // 1、以 this.localDatasource 为主要标记目标。
    // 2、如果当前选中节点 item 是叶子节点，则设置其被选中（ item.selected=true ）。
    // 3、如果当前选中节点 item 是非叶子节点，则在 item 中标记“全选（ item.allCount=item.children.length, item.partCount=0 ）”。
    // 4、依次标记祖先节点，刷新祖先节点中的 allCount 和 partCount 计数。
    // 5、如果 item 是非叶子节点，则标记所有子孙节点为“全选（ allCount=children.length, partCount=0, selected=true ）”。
    // 6、从之前选中的节点树中（ this.selectedItems ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 7、从 this.localDatasource 中剥离出选中的节点及其父节点，并与6步中解析出的状态进行合并，得到新的 this.selectedItems 。
    // 8、抛出 select 事件，带上一维的选中的节点的 value 值数组。
    select (item) {
      if (!this.selectable) {
        return
      }

      let chain = this.findChain(this.localDatasource, item.value)
      item = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(item)) {
        this.setItemCount(item, item.children.length, 0)
        this.$set(item, 'partialSelected', this.isPartialSelected(item))
      } else {
        this.setLeafSelected(item, true)
      }
      this.$set(item, 'visuallySelected', true)

      this.markParentsChain(parents)
      this.selectAllChildren(item, true)

      this.emitSelect()
    },

    selectAll () {
      if (!this.selectable) {
        return
      }

      let walk = items => {
        items.forEach(item => {
          if (this.hasChild(item)) {
            this.setItemCount(item, item.children.length, 0)
            walk(item.children)
          } else {
            this.setLeafSelected(item, true)
          }

          this.$set(item, 'visuallySelected', true)
        })
      }
      walk(this.localDatasource)
      this.emitSelect()
    },

    removeAll () {
      if (!this.selectable) {
        return
      }

      let walk = items => {
        items.forEach(item => {
          if (this.hasChild(item)) {
            this.setItemCount(item, 0, 0)
            walk(item.children)
          } else {
            this.setLeafSelected(item, false)
          }

          this.$set(item, 'visuallySelected', false)
        })
      }
      walk(this.localDatasource)
      this.emitSelect()
    },

    // 更新祖先节点中的选择标记（ selected 、 allCount 、 partCount ）
    markParentsChain (parents) {
      parents.forEach(parent => {
        let allCount = 0
        let partCount = 0
        parent.children.forEach(child => {
          if (this.hasChild(child)) {
            if (child.allCount === child.children.length) {
              allCount += 1
            } else if (child.allCount > 0 || child.partCount > 0) {
              partCount += 1
            }
          } else if (child.selected) {
            allCount += 1
          }
        })
        this.setItemCount(parent, allCount, partCount)
        this.$set(parent, 'visuallySelected', this.isSelected(parent))
        this.$set(parent, 'partialSelected', this.isPartialSelected(parent))
      })
    },

    setLeafSelected (item, selected) {
      this.$set(item, 'selected', selected)
      if (this.checkOwnProperty(item, 'allCount')) {
        this.$set(item, 'allCount', undefined)
      }
      if (this.checkOwnProperty(item, 'partCount')) {
        this.$set(item, 'partCount', undefined)
      }
    },
    setItemCount (item, allCount, partCount) {
      this.$set(item, 'allCount', allCount)
      this.$set(item, 'partCount', partCount)
      if (this.checkOwnProperty(item, 'selected')) {
        this.$set(item, 'selected', undefined)
      }
    },
    hasChild (item) {
      return item.children && item.children.length
    },
    selectAllChildren (item, selected) {
      if (this.hasChild(item)) {
        item.children.forEach(child => {
          if (this.hasChild(child)) {
            this.setItemCount(child, selected ? child.children.length : 0, 0)
            this.selectAllChildren(child, selected)
          } else {
            this.setLeafSelected(child, selected)
          }

          this.$set(child, 'visuallySelected', this.isSelected(child))
          this.$set(child, 'partialSelected', this.isPartialSelected(child))
        })
      }
    },

    // 从右侧移除选中项。
    //
    // 接收的参数为：
    //  item :待移除的节点
    //
    // 注意：parents 来自于 this.selectedItems ，内部的节点数据和 this.localDatasource 中的节点数据是完全不相等的。
    //
    // 执行步骤为：
    // 1、以 this.localDatasource 为主要标记目标。
    // 2、按照 parents 的最右侧开始遍历（即从树根开始），找到 parents 对应到 this.localDatasource 中的 parents 祖先节点数组 candidateParents。
    // 3、找到 item 对应到 this.localDatasource 中的节点 candidateItem。
    // 4、如果 candidateItem 没有子孙节点，就直接标记 candidateItem 上的选中状态（ selected ）为 false 。
    // 5、如果 candidateItem 有子孙节点，则标记 candidateItem 上的“子级中全选的节点总数（ allCount ）”为 0，“子级中部分选择的节点总数（ partCount ）”为0。
    // 6、依次刷新 candidateParents 中的 allCount 和 partCount 标记。
    // 7、如果 candidateItem 有子孙节点的话，则将其子孙节点全部设为未选中状态（ allCount=0 、 partCount=0 、 selected=false ）。
    // 8、从之前选中的节点树中（ this.selectedItems ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 9、从 this.localDatasource 中剥离出选中的节点及其父节点，并与8步中解析出的状态进行合并，得到新的 this.selectedItems 。
    // 10、抛出 select 事件，带上一维的选中的节点的 value 值数组。
    remove (item) {
      if (!this.selectable) {
        return
      }

      // 先找到在 this.localDatasource 里面对应的 item 和 parents 数组
      let chain = this.findChain(this.localDatasource, item.value)
      item = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(item)) {
        this.setItemCount(item, 0, 0)
        this.$set(item, 'partialSelected', this.isPartialSelected(item))
      } else {
        this.setLeafSelected(item, false)
      }
      this.$set(item, 'visuallySelected', false)

      this.markParentsChain(parents)
      this.selectAllChildren(item, false)

      this.emitSelect()
    },

    // 有可能用户传进来的 selected 没有在 datasource 里面，所以此处要处理一下
    correct (items = this.localDatasource) {
      let allCount = 0
      let partCount = 0
      items.forEach(item => {
        if (this.hasChild(item)) {
          let { allCount: all, partCount: part } = this.correct(item.children)
          this.setItemCount(item, all, part)

          if (all === item.children.length) {
            allCount += 1
          } else if (all > 0 || part > 0) {
            partCount += 1
          }
          this.$set(item, 'partialSelected', this.isPartialSelected(item))
        } else {
          this.setLeafSelected(
            item,
            this.selected.some(val => val === item.value)
          )
          allCount += item.selected ? 1 : 0
        }

        this.$set(item, 'visuallySelected', this.isSelected(item))
      })

      return { allCount, partCount }
    },
    checkOwnProperty (obj, property) {
      return Object.prototype.hasOwnProperty.call(obj, property)
    },
    findChain (items, value) {
      let walk = (items, chain = []) => {
        let currentChain = []
        let result = items.some(item => {
          if (item.value === value) {
            currentChain.push(item)
            return true
          }

          if (this.hasChild(item)) {
            currentChain.push(item)
            return walk(item.children, currentChain)
          }
        })

        // 找到了目标 value ，说明这条链路是正确的
        if (result) {
          chain.push(...currentChain)
        }

        return result
      }

      let chain = []
      walk(items, chain)
      return chain
    },

    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
