<template>
<veui-tree-node
  role="tree"
  :datasource="localDatasource"
  :action="action"
  :icons="icons"
  :ui="realUi"
  :class="{
    [$c('tree-disabled')]: realDisabled || realReadonly
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
        v-if="checkable"
        :class="$c('tree-item-check')"
        :checked="props.item.checked"
        :indeterminate="props.item.indeterminate"
        :disabled="props.item.disabled || realDisabled || realReadonly"
        :ui="realUi"
        tabindex="-1"
        @change="checked => handleItemCheck(checked, props.item)"
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
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import Checkbox from '../Checkbox'
import { focusIn } from '../../utils/dom'
import '../../common/uiTypes'

export default {
  name: 'veui-tree',
  uiTypes: ['tree'],
  components: {
    'veui-tree-node': TreeNode,
    'veui-checkbox': Checkbox
  },
  mixins: [prefix, ui, input],
  model: {
    prop: 'checked',
    event: 'check'
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
      validator (value) {
        if (!value == null) {
          return true
        }
        return includes(['toggle', 'check', 'none'], value)
      }
    },
    // 当前有哪些节点是展开的
    expanded: {
      type: Array,
      default () {
        return []
      }
    },
    checkable: {
      type: Boolean
    },
    checked: {
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
    realKeys () {
      if (isString(this.keys)) {
        return source => source[this.keys]
      }

      return this.keys
    },
    action () {
      return this.itemClick || (this.checkable ? 'check' : 'toggle')
    }
  },
  watch: {
    expanded () {
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
        walk(val, this.localDatasource, clone(this.expanded))

        if (this.checkable) {
          this.manageNodeStatus(this.localDatasource, null, true)
        }
      },
      deep: true,
      immediate: true
    },

    checked (val, oldVal) {
      if (xor(val, this.getCheckedValuesFromDatasource()).length) {
        this.manageNodeStatus(this.localDatasource, null, true)
      }
    }
  },
  methods: {
    // 每个非叶节点记录四个数字：
    // allCount：被全部选中（checked=true）并且没有被禁用的子节点数
    // partCount：部分被选中的子节点数
    // disabledCount：被禁用但是没有被选中的子节点数
    // disabledCheckedCount：被全部选中同时被禁用的子节点数
    //
    // 被全部选中是指能选的子节点全被选了，如果部分子节点被禁用了无法被选中，这个节点依然算被全部选中
    // 被全部选中的节点，如果有被禁用的子节点，这个节点同时也属于部分被选中，因为checkbox需要显示成中间状态
    //
    // A(-)(√):
    //   a0(√)
    //   a1(×)
    //   a2(√×)
    //   a3(√)
    // 例如A节点的四个子节点，allCount=2，disabledCount=1，disabledCheckedCount=1
    // A节点既是被部分选中状态（有部分子节点没有实际被选中，checkbox显示中间态）
    // 也是被选中状态（checkbox的checked与节点的checked绑定，所以点击A的checkbox可以触发remove操作）
    // 否则点击A的checkbox，只会把checkbox的checked改成true，不会触发remove，点了没反应，再点一次才会触发remove

    // 判断节点是不是被全部选中
    isChecked (item) {
      if (this.hasChild(item)) {
        let { allCount = 0, disabledCount = 0, disabledCheckedCount = 0 } = item
        return (
          disabledCount < item.children.length &&
          allCount + disabledCount + disabledCheckedCount ===
            item.children.length
        )
      }
      return item.checked
    },
    // 判断该节点是不是被部分选中
    isPartialChecked (item) {
      if (this.hasChild(item)) {
        let { allCount = 0, partCount = 0, disabledCheckedCount = 0 } = item
        let checkedCount = allCount + disabledCheckedCount
        return (
          (checkedCount > 0 && checkedCount < item.children.length) ||
          partCount > 0
        )
      }
      return false
    },
    getCheckedValuesFromDatasource () {
      let values = []
      let walk = (items = this.localDatasource) => {
        items.forEach(item => {
          if (
            item.partCount ||
            item.allCount ||
            item.checked ||
            item.disabledCheckedCount
          ) {
            if (this.hasChild(item)) {
              walk(item.children)
            } else if (item.checked) {
              values.push(item.value)
            }
          }
        })
      }
      walk()
      return values
    },
    emitCheck () {
      this.$emit('check', this.getCheckedValuesFromDatasource())
    },
    parseExpanded (expanded = this.expanded) {
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
        ? uniq([...this.expanded, item.value])
        : filter(this.expanded, value => value !== item.value)
      this.$emit('update:expanded', expanded)
      this.$emit(item.expanded ? 'expand' : 'collapse', item, index, depth)
    },
    handleItemClick (...args) {
      this.$emit('click', ...args)
    },
    handleItemCheck (checked, item) {
      if (checked) {
        this.check(item)
      } else {
        this.remove(item)
      }
    },

    check (item) {
      if (!this.checkable) {
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
          disabledCheckedCount
        ] = this.manageNodeStatus(item.children, true)
        this.setItemCount(
          item,
          allCount,
          partCount,
          disabledCount,
          disabledCheckedCount
        )
        this.$set(item, 'indeterminate', this.isPartialChecked(item))
      } else {
        this.setLeafChecked(item, true)
      }
      this.$set(item, 'checked', true)

      this.markParentsChain(parents)

      this.emitCheck()
    },

    // 设置子节点们的计数、状态，并且统计它们的状态并返回
    // isSettingDisabledNode：只有在初始化（datasource发生变化时）以及checked变化时可以改变被禁用的节点的选择状态
    manageNodeStatus (items, checked, isSettingDisabledNode) {
      let allCount = 0
      let partCount = 0
      let disabledCount = 0
      let disabledCheckedCount = 0

      items.forEach(child => {
        if (this.hasChild(child)) {
          let [
            childAllCount,
            childPartCount,
            childDisabledCount,
            childDisabledCheckedCount
          ] = this.manageNodeStatus(
            child.children,
            checked,
            isSettingDisabledNode
          )

          this.setItemCount(
            child,
            checked || checked == null ? childAllCount : 0,
            checked || checked == null ? childPartCount : 0,
            childDisabledCount,
            childDisabledCheckedCount
          )

          this.$set(child, 'indeterminate', this.isPartialChecked(child))
        } else {
          this.setLeafChecked(
            child,
            checked == null
              ? this.checked.some(val => val === child.value)
              : checked,
            isSettingDisabledNode
          )
        }

        this.$set(child, 'checked', this.isChecked(child))

        if (child.checked) {
          if (child.disabled) {
            disabledCheckedCount++
          } else {
            allCount++
          }
        }
        if (child.indeterminate) {
          partCount++
        }
        if (!child.checked && !child.indeterminate && child.disabled) {
          disabledCount++
        }
      })

      return [allCount, partCount, disabledCount, disabledCheckedCount]
    },

    // 更新祖先节点中的选择标记
    markParentsChain (parents) {
      parents.forEach(parent => {
        let allCount = 0
        let partCount = 0
        let disabledCount = 0
        let disabledCheckedCount = 0

        parent.children.forEach(child => {
          let isChecked = this.isChecked(child)
          let isPartialChecked = this.isPartialChecked(child)

          if (isChecked) {
            if (child.disabled) {
              disabledCheckedCount++
            } else {
              allCount++
            }
          }
          if (isPartialChecked) {
            partCount++
          }
          if (!isChecked && !isPartialChecked && child.disabled) {
            disabledCount++
          }
        })
        this.setItemCount(
          parent,
          allCount,
          partCount,
          disabledCount,
          disabledCheckedCount
        )
        this.$set(parent, 'checked', this.isChecked(parent))
        this.$set(parent, 'indeterminate', this.isPartialChecked(parent))
      })
    },

    setLeafChecked (item, checked, isSettingDisabledNode) {
      if (item.disabled && !isSettingDisabledNode) {
        return
      }

      this.$set(item, 'checked', checked)
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
      disabledCheckedCount
    ) {
      this.$set(item, 'allCount', allCount)
      this.$set(item, 'partCount', partCount)
      this.$set(item, 'disabledCount', disabledCount)
      this.$set(item, 'disabledCheckedCount', disabledCheckedCount)
      if (this.checkOwnProperty(item, 'checked')) {
        this.$set(item, 'checked', undefined)
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
    // 注意：parents 来自于 this.checkedItems ，内部的节点数据和 this.localDatasource 中的节点数据是完全不相等的。
    //
    // 执行步骤为：
    // 1、以 this.localDatasource 为主要标记目标。
    // 2、按照 parents 的最右侧开始遍历（即从树根开始），找到 parents 对应到 this.localDatasource 中的 parents 祖先节点数组 candidateParents。
    // 3、找到 item 对应到 this.localDatasource 中的节点 candidateItem。
    // 4、如果 candidateItem 没有子孙节点，就直接标记 candidateItem 上的选中状态（ checked ）为 false 。
    // 5、如果 candidateItem 有子孙节点，则标记 candidateItem 上的“子级中全选的节点总数（ allCount ）”为 0，“子级中部分选择的节点总数（ partCount ）”为0。
    // 6、依次刷新 candidateParents 中的 allCount 和 partCount 标记。
    // 7、如果 candidateItem 有子孙节点的话，则将其子孙节点全部设为未选中状态（ allCount=0 、 partCount=0 、 checked=false ）。
    // 8、从之前选中的节点树中（ this.checkedItems ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 9、从 this.localDatasource 中剥离出选中的节点及其父节点，并与8步中解析出的状态进行合并，得到新的 this.checkedItems 。
    // 10、抛出 check 事件，带上一维的选中的节点的 value 值数组。
    remove (item) {
      if (!this.checkable) {
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
          disabledCheckedCount
        ] = this.manageNodeStatus(item.children, false)
        this.setItemCount(
          item,
          allCount,
          partCount,
          disabledCount,
          disabledCheckedCount
        )
        this.$set(item, 'indeterminate', this.isPartialChecked(item))
      } else {
        this.setLeafChecked(item, false)
      }

      this.$set(item, 'checked', false)

      this.markParentsChain(parents)

      this.emitCheck()
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
