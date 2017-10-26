<template>
  <veui-filter-panel
    :datasource="showMode === 'flat' ? flattenOptions : datasource"
    :searchable="searchable"
    :filter="realFilter"
    class="veui-transfer-selected-panel"
    :class="{'veui-transfer-selected-flat': showMode === 'flat'}"
    :placeholder="placeholder"
    ref="selected">

    <template slot="head">
      <slot name="head">
        <slot name="title">已选列表</slot>
        <veui-button ui="link"
          class="veui-transfer-remove-all"
          @click="removeAll"
          :disabled="!isSelectable">删除全部</veui-button>
      </slot>
    </template>

    <template scope="props">
      <template v-if="showMode === 'tree'">
        <veui-tree v-if="$scopedSlots['selected-item']"
          class="veui-transfer-selected-tree"
          :datasource="props.options"
          :expands.sync="localExpands"
          @click="remove">
          <template slot="item" scope="item">
            <slot name="selected-item" v-bind="item"></slot>
          </template>
        </veui-tree>
        <veui-tree v-else
          :datasource="props.options"
          :expands.sync="localExpands"
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
      <slot name="no-data">请从左侧选择</slot>
    </template>
  </veui-filter-panel>
</template>

<script>
import FilterPanel from '../FilterPanel'
import Icon from '../Icon'
import Button from '../Button'
import Tree from '../Tree'
import { get, clone } from 'lodash'

export default {
  name: 'veui-selected-panel',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-tree': Tree
  },
  props: {
    datasource: Array,
    showMode: String,
    searchable: Boolean,
    filter: Function,
    placeholder: String,
    isSelectable: Boolean,
    expands: Array,
    icons: Object
  },
  data () {
    return {
      flattenOptions: [],
      localExpands: []
    }
  },
  watch: {
    expands: {
      handler () {
        this.localExpands = clone(this.expands)
      },
      immediate: true
    },
    localExpands (val) {
      this.$emit('update:expands', val)
    },
    datasource: {
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
          let option = get(this.flattenOptions, [index, 'items'])
          if (
            !option ||
            !path.length === option.length ||
            path.some((pathItem, index) => option[index].value !== pathItem.value)
          ) {
            this.flattenOptions[index] = { items: path }
          }
        })
        this.flattenOptions.splice(
          paths.length,
          this.flattenOptions.length - paths.length
        )
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    realFilter (keyword, option) {
      let isFlat = this.showMode === 'flat'
      option = isFlat ? option.items[option.items.length - 1] : option
      return this.filter(
        'selected',
        keyword,
        option,
        isFlat ? this.flattenOptions : this.datasource
      )
    },
    removeAll () {
      this.$emit('removeall')
    },
    remove (...args) {
      this.$emit('remove', ...args)
    }
  }
}
</script>
