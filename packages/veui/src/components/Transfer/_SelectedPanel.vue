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

    <template slot-scope="props">
      <veui-tree
        :datasource="props.options"
        :expands.sync="localExpands"
        @click="remove"
        class="veui-transfer-selected-tree"
        v-if="showMode === 'tree'">
        <template slot="item" slot-scope="props">
          <slot name="item" v-bind="props">
            <div class="veui-transfer-selected-item"
              :class="{'veui-transfer-selected-item-hidden': props.option.hidden}">

              <!-- 控制展开收起的图标 -->
              <span class="veui-tree-item-expand-switcher"
                v-if="props.option.children && props.option.children.length"
                @click.stop="toggle(props.option)">
                <veui-icon :name="icons.collapsed"/>
              </span>

              <div class="veui-transfer-item-label">
                <span class="veui-transfer-item-text">
                  <slot name="item-label" v-bind="props">{{ props.option.label }}</slot>
                </span>

                <veui-icon
                  class="veui-transfer-selected-icon-remove"
                  :name="icons.remove"/>
              </div>

            </div>
          </slot>
        </template>
      </veui-tree>
      <ul v-else class="veui-transfer-selected-flat-items">
        <li v-for="(options, index) in props.options"
          :key="options.items[options.items.length - 1].value"
          class="veui-transfer-selected-flat-item"
          :class="{'veui-transfer-selected-flat-item-hidden': options.hidden}"
          @click="remove(options.items[options.items.length - 1], options.items.slice(0, options.items.length - 1).reverse())">
          <slot name="item" :option="options.items" :index="index">
            <div class="veui-transfer-selected-flat-item-label">
              <template v-for="(opt, index) in options.items">
                <span :key="'l-' + opt.value" class="veui-transfer-selected-flat-option-label">{{ opt.label }}</span>
                <span :key="'s-' + opt.value"
                  class="veui-transfer-selected-flat-option-separator"
                  v-if="index < options.items.length - 1">
                  <veui-icon :name="icons.separator"/>
                </span>
              </template>
              <veui-icon class="veui-transfer-selected-flat-icon-remove" :name="icons.remove"/>
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
import { get, clone, isEqual } from 'lodash'

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
      handler (val, oldVal) {
        if (!isEqual(val, oldVal)) {
          this.localExpands = clone(this.expands)
        }
      },
      immediate: true
    },
    localExpands (val, oldVal) {
      if (!isEqual(val, oldVal)) {
        this.$emit('update:expands', val)
      }
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
    toggle (option) {
      let expands = clone(this.localExpands)
      let index = expands.indexOf(option.value)
      if (index > -1) {
        expands.splice(index, 1)
      } else {
        expands.push(option.value)
      }
      this.localExpands = expands
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
