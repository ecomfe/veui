<template>
  <veui-filter-panel
    class="veui-transfer-candidate-panel"
    :datasource="datasource"
    :searchable="searchable"
    :filter="realFilter"
    :placeholder="placeholder">

    <template slot="head">
      <slot name="head">
        <slot name="title">{{ t('transfer.available') }}</slot>
        <veui-button ui="link"
          class="veui-transfer-select-all"
          @click="selectAll"
          :disabled="!isSelectable">{{ t('transfer.selectAll') }}</veui-button>
      </slot>
    </template>

    <template slot-scope="props">
      <veui-tree
        :datasource="props.items"
        :expands.sync="expands"
        @click="select">

        <template slot="item" slot-scope="props">
          <slot name="item" v-bind="props">
            <div class="veui-transfer-candidate-item"
              :class="{'veui-transfer-candidate-item-hidden': props.item.hidden}">

              <!-- 控制展开收起的图标 -->
              <span class="veui-tree-item-expand-switcher"
                v-if="props.item.children && props.item.children.length"
                @click.stop="toggle(props.item)">
                <veui-icon
                  :name="icons.collapsed"
                  :label="t(props.expanded ? 'transfer.collapse' : 'transfer.expand')"/>
              </span>

              <div class="veui-transfer-item-label"
                :class="{
                  'veui-transfer-candidate-item-label-selected': props.item.visuallySelected
                }">
                <span class="veui-transfer-item-text">
                  <slot name="item-label" v-bind="props">{{ props.item.label }}</slot>
                </span>

                <!-- 未选中的时候， hover 上去应该展示的图标 -->
                <veui-icon
                  v-if="!props.item.visuallySelected"
                  class="veui-transfer-candidate-icon-unselected"
                  :name="icons.select"/>
                <!-- 选中的时候， hover 上去应该展示的图标 -->
                <veui-icon
                  v-else
                  class="veui-transfer-candidate-icon-selected"
                  :name="icons.checked"/>
              </div>
            </div>
          </slot>
        </template>

      </veui-tree>
    </template>

    <template slot="no-data">
      <slot name="no-data">{{ t('transfer.noData') }}</slot>
    </template>

  </veui-filter-panel>
</template>

<script>
import FilterPanel from '../FilterPanel'
import Tree from '../Tree'
import Button from '../Button'
import Icon from '../Icon'
import i18n from '../../mixins/i18n'
import { isEqual, clone } from 'lodash'

export default {
  name: 'veui_candidate-panel',
  mixins: [i18n],
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
