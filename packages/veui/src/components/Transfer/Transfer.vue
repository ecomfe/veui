<script>
import CandidatePanel from './_CandidatePanel'
import SelectedPanel from './_SelectedPanel'
import { find, xor, includes, omit, uniq, remove, isString } from 'lodash'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import { focusIn } from '../../utils/dom'

function defaultFilter (type, keyword, item, datasource) {
  return includes(item.label, keyword)
}

export default {
  name: 'veui-transfer',
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
    searchable: {
      type: Boolean,
      default: true
    },
    filter: {
      type: Function,
      default: defaultFilter
    },
    selected: {
      type: Array,
      default () {
        return []
      }
    },
    candidatePlaceholder: String,
    selectedPlaceholder: String,
    selectedShowMode: {
      type: String,
      default: 'tree',
      validator (value) {
        return includes(['tree', 'flat'], value)
      }
    },
    keys: {
      type: [String, Function],
      default: 'value'
    }
  },
  data () {
    return {
      candidateItems: [],
      selectedItems: [],
      rootAllCount: 0,
      rootPartCount: 0,

      candidateExpanded: [],
      selectedExpanded: []
    }
  },
  computed: {
    isSelectable () {
      return !this.realDisabled && !this.realReadonly
    },
    realKeys () {
      if (isString(this.keys)) {
        return source => source[this.keys]
      }

      return this.keys
    }
  },
  watch: {
    datasource: {
      handler (val) {
        this.candidateItems = []
        let walk = (datasource, items) => {
          datasource.forEach((source, index) => {
            let item = omit(source, 'children')
            item.value = this.realKeys(source)
            if (this.hasChild(source)) {
              this.$set(item, 'children', [])
              walk(source.children, item.children)
            }
            this.$set(items, index, item)
          })
        }
        walk(val, this.candidateItems)

        this.correct()
        this.setSelectedItems(this.cloneSelectedItems())
      },
      immediate: true
    },
    selected (val, oldVal) {
      if (
        xor(val, oldVal).length ||
        xor(val, this.getSelectedValuesFromSelectedItems()).length
      ) {
        this.correct()
        this.setSelectedItems(this.cloneSelectedItems())
      }
    }
  },
  created () {
    this.correct()
    this.setSelectedItems(this.cloneSelectedItems())
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

    // 取出 this.selectedItems 中的 values 值，返回一个一维数组。
    getSelectedValuesFromSelectedItems () {
      let values = []
      let walk = (items = this.selectedItems) => {
        items.forEach(item => {
          if (this.hasChild(item)) {
            walk(item.children)
          } else {
            values.push(item.value)
          }
        })
      }
      walk()
      return values
    },
    emitSelect () {
      this.$emit('select', this.getSelectedValuesFromSelectedItems())
    },
    selectAll () {
      if (!this.isSelectable) {
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
      walk(this.candidateItems)
      this.setSelectedItems(this.cloneSelectedItems())
      this.emitSelect()
    },
    removeAll () {
      if (!this.isSelectable) {
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
      walk(this.candidateItems)
      this.setSelectedItems([])
      this.emitSelect()
    },

    // 从左侧添加选中项
    //
    // 接收的参数为：
    //  item ：当前被选中的节点
    //
    // 注意： parents 来自于 this.candidateItems ，内部的节点数据和 this.candidateItems 中的节点数据是相等的。
    //
    // 执行步骤为：
    // 1、以 this.candidateItems 为主要标记目标。
    // 2、如果当前选中节点 item 是叶子节点，则设置其被选中（ item.selected=true ）。
    // 3、如果当前选中节点 item 是非叶子节点，则在 item 中标记“全选（ item.allCount=item.children.length, item.partCount=0 ）”。
    // 4、依次标记祖先节点，刷新祖先节点中的 allCount 和 partCount 计数。
    // 5、如果 item 是非叶子节点，则标记所有子孙节点为“全选（ allCount=children.length, partCount=0, selected=true ）”。
    // 6、从之前选中的节点树中（ this.selectedItems ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 7、从 this.candidateItems 中剥离出选中的节点及其父节点，并与6步中解析出的状态进行合并，得到新的 this.selectedItems 。
    // 8、抛出 select 事件，带上一维的选中的节点的 value 值数组。
    select (item) {
      if (!this.isSelectable) {
        return
      }

      let chain = this.findChain(this.candidateItems, item.value)
      item = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(item)) {
        this.setItemCount(item, item.children.length, 0)
      } else {
        this.setLeafSelected(item, true)
      }
      this.$set(item, 'visuallySelected', true)

      this.markParentsChain(parents)
      this.selectAllChildren(item, true)
      this.setSelectedItems(this.cloneSelectedItems())

      this.emitSelect()
    },

    // 从右侧移除选中项。
    //
    // 接收的参数为：
    //  item :待移除的节点
    //
    // 注意：parents 来自于 this.selectedItems ，内部的节点数据和 this.candidateItems 中的节点数据是完全不相等的。
    //
    // 执行步骤为：
    // 1、以 this.candidateItems 为主要标记目标。
    // 2、按照 parents 的最右侧开始遍历（即从树根开始），找到 parents 对应到 this.candidateItems 中的 parents 祖先节点数组 candidateParents。
    // 3、找到 item 对应到 this.candidateItems 中的节点 candidateItem。
    // 4、如果 candidateItem 没有子孙节点，就直接标记 candidateItem 上的选中状态（ selected ）为 false 。
    // 5、如果 candidateItem 有子孙节点，则标记 candidateItem 上的“子级中全选的节点总数（ allCount ）”为 0，“子级中部分选择的节点总数（ partCount ）”为0。
    // 6、依次刷新 candidateParents 中的 allCount 和 partCount 标记。
    // 7、如果 candidateItem 有子孙节点的话，则将其子孙节点全部设为未选中状态（ allCount=0 、 partCount=0 、 selected=false ）。
    // 8、从之前选中的节点树中（ this.selectedItems ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 9、从 this.candidateItems 中剥离出选中的节点及其父节点，并与8步中解析出的状态进行合并，得到新的 this.selectedItems 。
    // 10、抛出 select 事件，带上一维的选中的节点的 value 值数组。
    remove (item) {
      if (!this.isSelectable) {
        return
      }

      // 先找到在 this.candidateItems 里面对应的 item 和 parents 数组
      let chain = this.findChain(this.candidateItems, item.value)
      item = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(item)) {
        this.setItemCount(item, 0, 0)
      } else {
        this.setLeafSelected(item, false)
      }
      this.$set(item, 'visuallySelected', false)

      this.markParentsChain(parents)
      this.selectAllChildren(item, false)

      this.setSelectedItems(this.cloneSelectedItems())
      this.emitSelect()
    },
    setSelectedItems (items) {
      this.selectedItems.splice(0, this.selectedItems.length, ...items)
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
      })
    },
    checkOwnProperty (obj, property) {
      return Object.prototype.hasOwnProperty.call(obj, property)
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
    // 从 this.candidateItems 中深克隆一份 selectedItems 。
    cloneSelectedItems () {
      let walk = (candidateItems, selectedItems) => {
        let newSelectedItems = []
        candidateItems.forEach(candidateItem => {
          if (
            candidateItem.allCount ||
            candidateItem.partCount ||
            candidateItem.selected
          ) {
            let relatedSelectedItem = find(
              selectedItems,
              selectedItem => selectedItem.value === candidateItem.value
            )

            let newSelectedItem = omit(candidateItem, 'children')
            if (this.hasChild(candidateItem)) {
              newSelectedItem.children = walk(
                candidateItem.children,
                relatedSelectedItem && relatedSelectedItem.children
              )

              // 如果右侧没有相同的 item ，说明当前这个 item 是新选中的。
              // 对于新选中的 item ，要保持左侧的展开收起状态。
              if (!relatedSelectedItem) {
                let expanded = includes(
                  this.candidateExpanded,
                  newSelectedItem.value
                )
                if (expanded) {
                  this.selectedExpanded.push(newSelectedItem.value)
                  uniq(this.selectedExpanded)
                } else {
                  remove(this.selectedExpanded, newSelectedItem.value)
                }
              }
            }

            newSelectedItems.push(newSelectedItem)
          }
        })
        return newSelectedItems
      }
      return walk(this.candidateItems, this.selectedItems)
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
        })
      }
    },
    // 有可能用户传进来的 selected 没有在 datasource 里面，所以此处要处理一下
    correct (items = this.candidateItems) {
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
        } else {
          this.setLeafSelected(
            item,
            this.selected.some(val => val === item.value)
          )
          allCount += item.selected ? 1 : 0
        }

        this.$set(item, 'visuallySelected', this.isSelected(item))
      })

      if (items === this.candidateItems) {
        this.rootAllCount = allCount
        this.rootPartCount = partCount
      }

      return { allCount, partCount }
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
  },
  render (h) {
    function generateHead (type) {
      let headSlotName = `${type}-head`
      let head = this.$slots[headSlotName]
        ? h('template', { slot: 'head' }, this.$slots[headSlotName])
        : null

      let titleSlotName = `${type}-title`
      let title =
        !head && this.$slots[titleSlotName]
          ? h('template', { slot: 'title' }, this.$slots[titleSlotName])
          : null

      return [head, title]
    }

    function generateItem (type) {
      let itemSlotName = `${type}-item`
      let item = this.$scopedSlots[itemSlotName]
        ? props => this.$scopedSlots[itemSlotName](props)
        : null

      let itemLabelSlotName = `${type}-item-label`
      let itemLabel =
        !item && this.$scopedSlots[itemLabelSlotName]
          ? props => this.$scopedSlots[itemLabelSlotName](props)
          : null

      return {
        item,
        'item-label': itemLabel
      }
    }

    function generateNoData (type) {
      let slotName = `${type}-no-data`
      return this.$slots[slotName]
        ? h('template', { slot: 'no-data' }, this.$slots[slotName])
        : null
    }

    return h(
      'div',
      {
        class: {
          'veui-input-invalid': this.realInvalid,
          'veui-transfer': true,
          'veui-transfer-disabled': !this.isSelectable
        },
        props: {
          ui: this.ui
        }
      },
      [
        h(
          CandidatePanel,
          {
            props: {
              datasource: this.candidateItems,
              searchable: this.searchable,
              filter: this.filter,
              placeholder: this.candidatePlaceholder,
              isSelectable: this.isSelectable,
              icons: this.icons,
              expanded: this.candidateExpanded
            },
            on: {
              'update:expanded': val => {
                this.candidateExpanded = val
              },
              select: (...args) => {
                this.select(...args)
              },
              selectall: (...args) => {
                this.selectAll(...args)
              }
            },
            scopedSlots: generateItem.call(this, 'candidate')
          },
          [
            ...generateHead.call(this, 'candidate'),
            generateNoData.call(this, 'candidate')
          ]
        ),
        h(
          SelectedPanel,
          {
            props: {
              datasource: this.selectedItems,
              showMode: this.selectedShowMode,
              searchable: this.searchable,
              filter: this.filter,
              placeholder: this.selectedPlaceholder,
              isSelectable: this.isSelectable,
              expanded: this.selectedExpanded,
              icons: this.icons
            },
            on: {
              'update:expanded': val => {
                this.selectedExpanded = val
              },
              remove: (...args) => {
                this.remove(...args)
              },
              removeall: (...args) => {
                this.removeAll(...args)
              }
            },
            scopedSlots: generateItem.call(this, 'selected')
          },
          [
            ...generateHead.call(this, 'selected'),
            generateNoData.call(this, 'selected')
          ]
        )
      ]
    )
  }
}
</script>
