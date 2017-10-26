<template>
  <div class="veui-transfer" :class="{'veui-transfer-disabled': !isSelectable}">
    <veui-candidate-panel
      :datasource="candidateOptions"
      :searchable="searchable"
      :filter="filter"
      :placeholder="candidatePlaceholder"
      :is-selectable="isSelectable"
      :icons="icons"
      :expands="candidateExpands"
      @select="select"
      @selectall="selectAll">
    </veui-candidate-panel>

    <veui-selected-panel
      :datasource="selectedOptions"
      :show-mode="selectedShowMode"
      :searchable="searchable"
      :filter="filter"
      :placeholder="selectedPlaceholder"
      :is-selectable="isSelectable"
      :expands.sync="selectedExpands"
      :icons="icons"
      @remove="remove"
      @removeall="removeAll">
    </veui-selected-panel>
    <!-- <veui-filter-panel :datasource="candidateOptions"
      :searchable="searchable"
      @click="select"
      :filter="candidateFilter"
      class="veui-transfer-candidate-panel"
      :placeholder="candidatePlaceholder"
      ref="candidate">

      <template slot="head">
        <slot name="candidate-head">
          <slot name="candidate-title">备选列表</slot>
          <veui-button ui="link"
            class="veui-transfer-select-all"
            @click="selectAll"
            :disabled="!isSelectable">全选</veui-button>
        </slot>
      </template>

      <template scope="props">
        <veui-tree v-if="$scopedSlots['candidate-item']"
          :datasource="props.options"
          :expands.sync="candidateExpands"
          @click="select">
          <template slot="item" scope="item">
            <slot name="candidate-item" v-bind="item"></slot>
          </template>
        </veui-tree>
        <veui-tree v-else
          :datasource="props.options"
          :expands.sync="candidateExpands"
          @click="select">

          <template slot="item" scope="props">
            <div class="veui-transfer-candidate-item"
              :class="{'veui-transfer-candidate-item-hidden': props.option.hidden}">
              <span class="veui-tree-item-expand-switcher"
                v-if="props.option.children && props.option.children.length"
                @click.stop="toggle('candidate', props.option)">
                <veui-icon :name="icons.collapsed"></veui-icon>
              </span>
              <div class="veui-transfer-item-label"
                :class="{'veui-transfer-candidate-item-label-selected': props.option.visuallySelected}">
                <span class="veui-transfer-item-text">
                  <slot name="candidate-item-label" v-bind="props">{{ props.option.label }}</slot>
                </span>

                <veui-icon class="veui-transfer-candidate-icon-unselected"
                  :name="icons.select"
                  v-if="!props.option.visuallySelected"></veui-icon>
                <veui-icon class="veui-transfer-candidate-icon-selected"
                  :name="icons.check"
                  v-else></veui-icon>
              </div>
            </div>
          </template>

        </veui-tree>
      </template>

      <template slot="no-data">
        <slot name="candidate-no-data">没有备选项</slot>
      </template>

    </veui-filter-panel> -->

    <!-- <veui-filter-panel :datasource="selectedShowMode === 'flat' ? selectedFlattenOptions : selectedOptions"
      :searchable="searchable"
      :filter="selectedFilter"
      class="veui-transfer-selected-panel"
      :class="{'veui-transfer-selected-flat': selectedShowMode === 'flat'}"
      :placeholder="selectedPlaceholder"
      ref="selected">

      <template slot="head">
        <slot name="selected-head">
          <slot name="selected-title">已选列表</slot>
          <veui-button ui="link"
            class="veui-transfer-remove-all"
            @click="removeAll"
            :disabled="!isSelectable">删除全部</veui-button>
        </slot>
      </template>

      <template scope="props">
        <template v-if="selectedShowMode === 'tree'">
          <veui-tree v-if="$scopedSlots['selected-item']"
            class="veui-transfer-selected-tree"
            :datasource="props.options"
            :expands.sync="selectedExpands"
            @click="remove">
            <template slot="item" scope="item">
              <slot name="selected-item" v-bind="item"></slot>
            </template>
          </veui-tree>
          <veui-tree v-else
            :datasource="props.options"
            :expands.sync="selectedExpands"
            @click="remove"
            class="veui-transfer-selected-tree">
            <template slot="item-label" scope="props">
              <div class="veui-transfer-item-label">
                <span class="veui-transfer-item-text">
                  <slot name="selected-item-label" v-bind="props">{{ props.option.label }}</slot>
                </span>
                <veui-icon v-if="icons.remove"
                  :name="icons.remove"
                  class="veui-transfer-selected-icon-remove"></veui-icon>
              </div>
            </template>
          </veui-tree>
        </template>
        <ul v-else class="veui-transfer-selected-flat-items">
          <li v-for="(options, index) in props.options"
            :key="options.items[options.items.length - 1].value"
            class="veui-transfer-selected-flat-item"
            :class="{'veui-transfer-selected-flat-item-hidden': options.hidden}"
            @click="remove(options.items[options.items.length - 1], options.items.slice(0, options.items.length - 1).reverse())">
            <slot name="selected-item" :option="options.items" :index="index">
              <div class="veui-transfer-selected-flat-item-label">
                <template v-for="(opt, index) in options.items">
                  <span :key="opt.value" class="veui-transfer-selected-flat-option-label">{{ opt.label }}</span>
                  <span :key="opt.value"
                    class="veui-transfer-selected-flat-option-separator"
                    v-if="index < options.items.length - 1">
                    <veui-icon :name="icons.separator"></veui-icon>
                  </span>
                </template>
                <veui-icon class="veui-transfer-selected-flat-icon-remove" :name="icons.remove"></veui-icon>
              </div>
            </slot>
          </li>
        </ul>
      </template>

      <template slot="no-data">
        <slot name="selected-no-data">请从左侧选择</slot>
      </template>
    </veui-filter-panel> -->
  </div>
</template>

<script>
import FilterPanel from '../FilterPanel'
import Tree from '../Tree'
import Button from '../Button'
import { cloneDeep, isEqual, find, difference, includes, omit, uniq, remove, get } from 'lodash'
import Icon from '../Icon'
import { icons, input } from '../../mixins'
import CandidatePanel from './_CandidatePanel'
import SelectedPanel from './_SelectedPanel'

function defaultFilter (type, keyword, option, datasource) {
  return includes(option.label, keyword)
}

export default {
  name: 'veui-transfer',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-icon': Icon,
    'veui-tree': Tree,
    'veui-button': Button,
    'veui-candidate-panel': CandidatePanel,
    'veui-selected-panel': SelectedPanel
  },
  mixins: [input, icons],
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
      validate (value) {
        return includes(['tree', 'flat'], value)
      }
    }
  },
  model: {
    prop: 'selected',
    event: 'select'
  },
  data () {
    return {
      candidateOptions: cloneDeep(this.datasource),
      selectedOptions: [],
      rootAllCount: 0,
      rootPartCount: 0,

      candidateExpands: [],
      selectedExpands: [],

      selectedFlattenOptions: []
    }
  },
  created () {
    this.correct()
    this.setSelectedOptions(this.cloneSelectedOptions())
  },
  computed: {
    isSelectable () {
      return !this.realDisabled && !this.realReadonly
    }
  },
  watch: {
    selectedOptions: {
      handler (selectedOptions) {
        let walk = (option, path, paths) => {
          if (!option.children || !option.children.length) {
            paths.push([...path, option])
            return
          }

          option.children.forEach(child => {
            walk(child, [...path, option], paths)
          })
        }

        let paths = []
        selectedOptions.forEach(option => {
          let itemPaths = []
          walk(option, [], itemPaths)
          paths.push(...itemPaths)
        })

        paths.forEach((path, index) => {
          let option = get(this.selectedFlattenOptions, [index, 'items'])
          if (
            !option ||
            !path.length === option.length ||
            path.some((pathItem, index) => option[index].value !== pathItem.value)
          ) {
            this.selectedFlattenOptions[index] = { items: path }
          }
        })
        this.selectedFlattenOptions.splice(paths.length, this.selectedFlattenOptions.length - paths.length)
      },
      deep: true,
      immediate: true
    },
    datasource (v, oldV) {
      if (!isEqual(v, oldV)) {
        this.candidateOptions = cloneDeep(v)
        this.correct()
        this.setSelectedOptions(this.cloneSelectedOptions())
      }
    },
    selected (v, oldV) {
      if (difference(v, oldV).length || difference(v, this.getSelectedValuesFromSelectedOptions()).length) {
        this.correct()
        this.setSelectedOptions(this.cloneSelectedOptions())
      }
    }
  },
  methods: {
    toggle (type, option) {
      let expands = this[`${type}Expands`]
      let index = expands.indexOf(option.value)
      if (index > -1) {
        expands.splice(index, 1)
      } else {
        expands.push(option.value)
      }
    },
    candidateFilter (keyword, option) {
      return this.filter('candidate', keyword, option, this.candidateOptions)
    },
    selectedFilter (keyword, option) {
      let isFlat = this.selectedShowMode === 'flat'
      option = isFlat ? option.items[option.items.length - 1] : option
      return this.filter('selected', keyword, option, isFlat ? this.selectedFlattenOptions : this.selectedOptions)
    },
    // 判断节点是否被选中：
    // 1、如果是叶子节点，直接根据 selected 属性判断。
    // 2、如果是非叶子节点，则该节点下所有子级节点都全部选择了，当前节点才算被选中了。
    isSelected (option) {
      return this.hasChild(option) ? option.allCount === option.children.length : option.selected
    },

    // 取出 this.selectedOptions 中的 values 值，返回一个一维数组。
    getSelectedValuesFromSelectedOptions () {
      let values = []
      let walk = (options = this.selectedOptions) => {
        options.forEach(option => {
          if (this.hasChild(option)) {
            walk(option.children)
          } else {
            values.push(option.value)
          }
        })
      }
      walk()
      return values
    },
    emitSelect () {
      this.$emit('select', this.getSelectedValuesFromSelectedOptions())
    },
    selectAll () {
      if (!this.isSelectable) {
        return
      }

      let walk = (options) => {
        options.forEach(option => {
          if (this.hasChild(option)) {
            this.setOptionCount(option, option.children.length, 0)
            walk(option.children)
          } else {
            this.setLeafSelected(option, true)
          }
        })
      }
      walk(this.candidateOptions)
      this.setSelectedOptions(this.cloneSelectedOptions())
      this.emitSelect()
    },
    removeAll () {
      if (!this.isSelectable) {
        return
      }

      let walk = (options) => {
        options.forEach(option => {
          if (this.hasChild(option)) {
            this.setOptionCount(option, 0, 0)
            walk(option.children)
          } else {
            this.setLeafSelected(option, false)
          }
        })
      }
      walk(this.candidateOptions)
      this.setSelectedOptions([])
      this.emitSelect()
    },

    // 从左侧添加选中项
    //
    // 接收的参数为：
    //  option ：当前被选中的节点
    //  parents ：当前被选中节点的祖先节点数组（第一个元素是离 option 最近的祖先节点）
    //
    // 注意： parents 来自于 this.candidateOptions ，内部的节点数据和 this.candidateOptions 中的节点数据是相等的。
    //
    // 执行步骤为：
    // 1、以 this.candidateOptions 为主要标记目标。
    // 2、如果当前选中节点 option 是叶子节点，则设置其被选中（ option.selected=true ）。
    // 3、如果当前选中节点 option 是非叶子节点，则在 option 中标记“全选（ option.allCount=option.children.length, option.partCount=0 ）”。
    // 4、依次标记祖先节点，刷新祖先节点中的 allCount 和 partCount 计数。
    // 5、如果 option 是非叶子节点，则标记所有子孙节点为“全选（ allCount=children.length, partCount=0, selected=true ）”。
    // 6、从之前选中的节点树中（ this.selectedOptions ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 7、从 this.candidateOptions 中剥离出选中的节点及其父节点，并与6步中解析出的状态进行合并，得到新的 this.selectedOptions 。
    // 8、抛出 select 事件，带上一维的选中的节点的 value 值数组。
    select (option) {
      if (!this.isSelectable) {
        return
      }

      let chain = this.findChain(this.candidateOptions, option.value)
      option = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(option)) {
        this.setOptionCount(option, option.children.length, 0)
      } else {
        this.setLeafSelected(option, true)
      }
      this.$set(option, 'visuallySelected', true)

      this.markParentsChain(parents)
      this.selectAllChildren(option, true)
      this.setSelectedOptions(this.cloneSelectedOptions())

      this.emitSelect()
    },

    // 从右侧移除选中项。
    //
    // 接收的参数为：
    //  option :待移除的节点
    //  parents ：待移除节点的祖先节点数组（第一个元素是离 option 最近的祖先节点）
    //
    // 注意：parents 来自于 this.selectedOptions ，内部的节点数据和 this.candidateOptions 中的节点数据是完全不相等的。
    //
    // 执行步骤为：
    // 1、以 this.candidateOptions 为主要标记目标。
    // 2、按照 parents 的最右侧开始遍历（即从树根开始），找到 parents 对应到 this.candidateOptions 中的 parents 祖先节点数组 candidateParents。
    // 3、找到 option 对应到 this.candidateOptions 中的节点 candidateOption。
    // 4、如果 candidateOption 没有子孙节点，就直接标记 candidateOption 上的选中状态（ selected ）为 false 。
    // 5、如果 candidateOption 有子孙节点，则标记 candidateOption 上的“子级中全选的节点总数（ allCount ）”为 0，“子级中部分选择的节点总数（ partCount ）”为0。
    // 6、依次刷新 candidateParents 中的 allCount 和 partCount 标记。
    // 7、如果 candidateOption 有子孙节点的话，则将其子孙节点全部设为未选中状态（ allCount=0 、 partCount=0 、 selected=false ）。
    // 8、从之前选中的节点树中（ this.selectedOptions ）中解析出每个节点的状态（目前只有展开/收起状态 expanded ）。
    // 9、从 this.candidateOptions 中剥离出选中的节点及其父节点，并与8步中解析出的状态进行合并，得到新的 this.selectedOptions 。
    // 10、抛出 select 事件，带上一维的选中的节点的 value 值数组。
    remove (option) {
      if (!this.isSelectable) {
        return
      }

      // 先找到在 this.candidateOptions 里面对应的 option 和 parents 数组
      let chain = this.findChain(this.candidateOptions, option.value)
      option = chain[chain.length - 1]
      let parents = chain.slice(0, chain.length - 1).reverse()

      if (this.hasChild(option)) {
        this.setOptionCount(option, 0, 0)
      } else {
        this.setLeafSelected(option, false)
      }
      this.$set(option, 'visuallySelected', false)

      this.markParentsChain(parents)
      this.selectAllChildren(option, false)

      this.setSelectedOptions(this.cloneSelectedOptions())
      this.emitSelect()
    },
    setSelectedOptions (options) {
      this.selectedOptions.splice(0, this.selectedOptions.length, ...options)
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
        this.setOptionCount(parent, allCount, partCount)
        this.$set(parent, 'visuallySelected', this.isSelected(parent))
      })
    },
    checkOwnProperty (obj, property) {
      return Object.prototype.hasOwnProperty.call(obj, property)
    },
    setLeafSelected (option, selected) {
      this.$set(option, 'selected', selected)
      if (this.checkOwnProperty(option, 'allCount')) {
        this.$set(option, 'allCount', undefined)
      }
      if (this.checkOwnProperty(option, 'partCount')) {
        this.$set(option, 'partCount', undefined)
      }
    },
    setOptionCount (option, allCount, partCount) {
      this.$set(option, 'allCount', allCount)
      this.$set(option, 'partCount', partCount)
      if (this.checkOwnProperty(option, 'selected')) {
        this.$set(option, 'selected', undefined)
      }
    },
    hasChild (option) {
      return option.children && option.children.length
    },
    // 从 this.candidateOptions 中深克隆一份 selectedOptions 。
    cloneSelectedOptions () {
      let walk = (candidateOptions, selectedOptions) => {
        let newSelectedOptions = []
        candidateOptions.forEach(candidateOption => {
          if (
            candidateOption.allCount ||
            candidateOption.partCount ||
            candidateOption.selected
          ) {
            let relatedSelectedOption = find(
              selectedOptions,
              selectedOption => selectedOption.value === candidateOption.value
            )

            let newSelectedOption = omit(candidateOption, 'children')
            if (this.hasChild(candidateOption)) {
              newSelectedOption.children = walk(
                candidateOption.children,
                relatedSelectedOption && relatedSelectedOption.children
              )

              // 如果右侧没有相同的 option ，说明当前这个 option 是新选中的。
              // 对于新选中的 option ，要保持左侧的展开收起状态。
              if (!relatedSelectedOption) {
                let expanded = includes(this.candidateExpands, newSelectedOption.value)
                if (expanded) {
                  this.selectedExpands.push(newSelectedOption.value)
                  uniq(this.selectedExpands)
                } else {
                  remove(this.selectedExpands, newSelectedOption.value)
                }
              }
            }

            newSelectedOptions.push(newSelectedOption)
          }
        })
        return newSelectedOptions
      }
      return walk(this.candidateOptions, this.selectedOptions)
    },
    selectAllChildren (option, selected) {
      if (this.hasChild(option)) {
        option.children.forEach(child => {
          if (this.hasChild(child)) {
            this.setOptionCount(child, selected ? child.children.length : 0, 0)
            this.selectAllChildren(child, selected)
          } else {
            this.setLeafSelected(child, selected)
          }

          this.$set(child, 'visuallySelected', this.isSelected(child))
        })
      }
    },
    // 有可能用户传进来的 selected 没有在 datasource 里面，所以此处要处理一下
    correct (options = this.candidateOptions) {
      let allCount = 0
      let partCount = 0
      options.forEach(option => {
        if (this.hasChild(option)) {
          let { allCount: all, partCount: part } = this.correct(option.children)
          this.setOptionCount(option, all, part)

          if (all === option.children.length) {
            allCount += 1
          } else if (all > 0 || part > 0) {
            partCount += 1
          }
        } else {
          this.setLeafSelected(option, this.selected.some(v => v === option.value))
          allCount += option.selected ? 1 : 0
        }
      })

      if (options === this.candidateOptions) {
        this.rootAllCount = allCount
        this.rootPartCount = partCount
      }

      return { allCount, partCount }
    },
    findOptionByValue (options, value) {
      let targetOption
      find(options, option => {
        if (option.value === value) {
          targetOption = option
        } else if (option.children && option.children.length) {
          targetOption = this.findOptionByValue(option.children, value)
        }

        return targetOption
      })
      return targetOption
    },
    findChain (options, value) {
      let walk = (options, chain = []) => {
        let currentChain = []
        let result = options.some(option => {
          if (option.value === value) {
            currentChain.push(option)
            return true
          }

          if (this.hasChild(option)) {
            currentChain.push(option)
            return walk(option.children, currentChain)
          }
        })

        // 找到了目标 value ，说明这条链路是正确的
        if (result) {
          chain.push(...currentChain)
        }

        return result
      }

      let chain = []
      walk(options, chain)
      return chain
    },
    syncFields (fromOptions, toOptions, fields) {
      let set = (fromOption, toOption, key) => {
        if (fromOption.hasOwnProperty(key)) {
          this.$set(toOption, key, fromOption[key])
        }
      }
      find(fromOptions, (fromOption, index) => {
        if (!toOptions[index]) {
          return true
        }

        let toOption = toOptions[index]
        fields.forEach(field => {
          set(fromOption, toOption, field)
        })

        if (this.hasChild(fromOption) && this.hasChild(toOption)) {
          this.syncFields(fromOption.children, toOption.children, fields)
        }
      })
    }
  }
}
</script>
