<template>
  <veui-filter-panel
    class="veui-transfer-candidate-panel"
    :datasource="datasource"
    :searchable="searchable"
    :filter="realFilter"
    :placeholder="placeholder">

    <template slot="head">
      <slot name="head">
        <slot name="title">备选列表</slot>
        <veui-button ui="link"
          class="veui-transfer-select-all"
          @click="selectAll"
          :disabled="!isSelectable">全选</veui-button>
      </slot>
    </template>

    <template slot-scope="props">
      <veui-tree
        :datasource="props.options"
        :expands.sync="expands"
        @click="select">

        <template slot="item" slot-scope="props">
          <slot name="item" v-bind="props">
            <div class="veui-transfer-candidate-item"
              :class="{'veui-transfer-candidate-item-hidden': props.option.hidden}">

              <!-- 控制展开收起的图标 -->
              <span class="veui-tree-item-expand-switcher"
                v-if="props.option.children && props.option.children.length"
                @click.stop="toggle(props.option)">
                <veui-icon :name="icons.collapsed"/>
              </span>

              <div class="veui-transfer-item-label"
                :class="{'veui-transfer-candidate-item-label-selected': props.option.visuallySelected}">
                <span class="veui-transfer-item-text">
                  <slot name="item-label" v-bind="props">{{ props.option.label }}</slot>
                </span>

                <!-- 未选中的时候， hover 上去应该展示的图标 -->
                <veui-icon
                  class="veui-transfer-candidate-icon-unselected"
                  :name="icons.select"
                  v-if="!props.option.visuallySelected"/>
                <!-- 选中的时候， hover 上去应该展示的图标 -->
                <veui-icon
                  class="veui-transfer-candidate-icon-selected"
                  :name="icons.check"
                  v-else/>
              </div>
            </div>
          </slot>
        </template>

      </veui-tree>
    </template>

    <template slot="no-data">
      <slot name="no-data">没有备选项</slot>
    </template>

  </veui-filter-panel>
</template>

<script>
import FilterPanel from '../FilterPanel'
import Tree from '../Tree'
import Button from '../Button'
import Icon from '../Icon'
import { isEqual, clone } from 'lodash'

export default {
  name: 'veui-candidate-panel',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-tree': Tree,
    'veui-button': Button,
    'veui-icon': Icon
  },
  props: {
    datasource: Array,
    searchable: Boolean,
    filter: Function,
    placeholder: String,
    isSelectable: Boolean,
    expands: Array,
    icons: Object
  },
  data () {
    return {
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
    }
  },
  methods: {
    realFilter (keyword, option) {
      return this.filter('candidate', keyword, option, this.datasource)
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
    selectAll () {
      this.$emit('selectall')
    },
    select (...args) {
      this.$emit('select', ...args)
    }
  }
}
</script>
