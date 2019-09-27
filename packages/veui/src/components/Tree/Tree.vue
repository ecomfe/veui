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
        let walk = (datasource, items, expanded, isBranchDisabled) => {
          datasource.forEach((source, index) => {
            let item = omit(source, 'children')
            item.value = this.realKeys(source)
            let disabled = isBranchDisabled || item.disabled
            if (disabled) {
              item.disabled = disabled
            }

            if (this.hasChild(source)) {
              item.expanded =
                remove(expanded, value => value === item.value).length !== 0

              this.$set(item, 'children', [])
              walk(source.children, item.children, expanded, disabled)
            }
            this.$set(items, index, item)
          })
        }
        walk(val, this.localDatasource, clone(this.realExpanded))

        if (this.selectable) {
          this.manageNodeStatus(this.localDatasource, null, true)
        }
      },
      deep: true,
      immediate: true
    },

    selected (val, oldVal) {
      if (xor(val, this.getSelectedValuesFromDatasource()).length) {
        this.manageNodeStatus(this.localDatasource, null, true)
      }
    }
  },
  methods: {
    // 每个非叶节点记录四个数字：
    // allCount：被全部选中（selected=true）并且没有被禁用的子节点数
    // partCount：部分被选中的子节点数
    // disabledCount：被禁用但是没有被选中的子节点数
    // disabledSelectedCount：被全部选中同时被禁用的子节点数
    //
    // 被全部选中是指能选的子节点全被选了，如果部分子节点被禁用了无法被选中，这个节点依然算被全部选中
    // 被全部选中的节点，如果有被禁用的子节点，这个节点同时也属于部分被选中，因为checkbox需要显示成中间状态
    //
    // A(-)(√):
    //   a0(√)
    //   a1(×)
    //   a2(√×)
    //   a3(√)
    // 例如A节点的四个子节点，allCount=2，disabledCount=1，disabledSelectedCount=1
    // A节点既是被部分选中状态（有部分子节点没有实际被选中，checkbox显示中间态）
    // 也是被选中状态（checkbox的checked与节点的selected绑定，所以点击A的checkbox可以触发remove操作）
    // 否则点击A的checkbox，只会把checkbox的checked改成true，不会触发remove，点了没反应，再点一次才会触发remove

    // 判断节点是不是被全部选中
    isSelected (item) {
      if (this.hasChild(item)) {
        let {
          allCount = 0,
          disabledCount = 0,
          disabledSelectedCount = 0
        } = item
        return (
          disabledCount < item.children.length &&
          allCount + disabledCount + disabledSelectedCount ===
            item.children.length
        )
      }
      return item.selected
    },
    // 判断该节点是不是被部分选中
    isPartialSelected (item) {
      if (this.hasChild(item)) {
        let { allCount = 0, partCount = 0, disabledSelectedCount = 0 } = item
        let selectedCount = allCount + disabledSelectedCount
        return (
          (selectedCount > 0 && selectedCount < item.children.length) ||
          partCount > 0
        )
      }
      return false
    },
    getSelectedValuesFromDatasource () {
      let values = []
      let walk = (items = this.localDatasource) => {
        items.forEach(item => {
          if (
            item.partCount ||
            item.allCount ||
            item.selected ||
            item.disabledSelectedCount
          ) {
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

    select (item) {
      if (!this.selectable) {
        return
      }

      let chain = this.findChain(this.localDatasource, item.value)
      item = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(item)) {
        let [
          allCount,
          partCount,
          disabledCount,
          disabledSelectedCount
        ] = this.manageNodeStatus(item.children, true)
        this.setItemCount(
          item,
          allCount,
          partCount,
          disabledCount,
          disabledSelectedCount
        )
        this.$set(item, 'partialSelected', this.isPartialSelected(item))
      } else {
        this.setLeafSelected(item, true)
      }
      this.$set(item, 'visuallySelected', true)

      this.markParentsChain(parents)

      this.emitSelect()
    },

    // 设置子节点们的计数、状态，并且统计它们的状态并返回
    // isSettingDisabledNode：只有在初始化（datasource发生变化时）以及selected变化时可以改变被禁用的节点的选择状态
    manageNodeStatus (items, selected, isSettingDisabledNode) {
      let allCount = 0
      let partCount = 0
      let disabledCount = 0
      let disabledSelectedCount = 0

      items.forEach(child => {
        if (this.hasChild(child)) {
          let [
            childAllCount,
            childPartCount,
            childDisabledCount,
            childDisabledSelectedCount
          ] = this.manageNodeStatus(
            child.children,
            selected,
            isSettingDisabledNode
          )

          this.setItemCount(
            child,
            selected || selected == null ? childAllCount : 0,
            selected || selected == null ? childPartCount : 0,
            childDisabledCount,
            childDisabledSelectedCount
          )

          this.$set(child, 'partialSelected', this.isPartialSelected(child))
        } else {
          this.setLeafSelected(
            child,
            selected == null
              ? this.selected.some(val => val === child.value)
              : selected,
            isSettingDisabledNode
          )
        }

        this.$set(child, 'visuallySelected', this.isSelected(child))

        if (child.visuallySelected) {
          if (child.disabled) {
            disabledSelectedCount++
          } else {
            allCount++
          }
        }
        if (child.partialSelected) {
          partCount++
        }
        if (
          !child.visuallySelected &&
          !child.partialSelected &&
          child.disabled
        ) {
          disabledCount++
        }
      })

      return [allCount, partCount, disabledCount, disabledSelectedCount]
    },

    // 更新祖先节点中的选择标记
    markParentsChain (parents) {
      parents.forEach(parent => {
        let allCount = 0
        let partCount = 0
        let disabledCount = 0
        let disabledSelectedCount = 0

        parent.children.forEach(child => {
          let isSelected = this.isSelected(child)
          let isPartialSelected = this.isPartialSelected(child)

          if (isSelected) {
            if (child.disabled) {
              disabledSelectedCount++
            } else {
              allCount++
            }
          }
          if (isPartialSelected) {
            partCount++
          }
          if (!isSelected && !isPartialSelected && child.disabled) {
            disabledCount++
          }
        })
        this.setItemCount(
          parent,
          allCount,
          partCount,
          disabledCount,
          disabledSelectedCount
        )
        this.$set(parent, 'visuallySelected', this.isSelected(parent))
        this.$set(parent, 'partialSelected', this.isPartialSelected(parent))
      })
    },

    setLeafSelected (item, selected, isSettingDisabledNode) {
      if (item.disabled && !isSettingDisabledNode) {
        return
      }

      this.$set(item, 'selected', selected)
      if (this.checkOwnProperty(item, 'allCount')) {
        this.$set(item, 'allCount', undefined)
      }
      if (this.checkOwnProperty(item, 'partCount')) {
        this.$set(item, 'partCount', undefined)
      }
    },
    setItemCount (
      item,
      allCount,
      partCount,
      disabledCount,
      disabledSelectedCount
    ) {
      this.$set(item, 'allCount', allCount)
      this.$set(item, 'partCount', partCount)
      this.$set(item, 'disabledCount', disabledCount)
      this.$set(item, 'disabledSelectedCount', disabledSelectedCount)
      if (this.checkOwnProperty(item, 'selected')) {
        this.$set(item, 'selected', undefined)
      }
    },
    hasChild (item) {
      return item.children && item.children.length
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
        let [
          allCount,
          partCount,
          disabledCount,
          disabledSelectedCount
        ] = this.manageNodeStatus(item.children, false)
        this.setItemCount(
          item,
          allCount,
          partCount,
          disabledCount,
          disabledSelectedCount
        )
        this.$set(item, 'partialSelected', this.isPartialSelected(item))
      } else {
        this.setLeafSelected(item, false)
      }

      this.$set(item, 'visuallySelected', false)

      this.markParentsChain(parents)

      this.emitSelect()
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
