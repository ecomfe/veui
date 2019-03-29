<template>
<veui-filter-panel
  class="veui-transfer-candidate-panel"
  :datasource="datasource"
  :searchable="searchable"
  :filter="realFilter"
  :placeholder="placeholder"
>
  <template slot="head">
    <slot name="head">
      <slot name="title">
        {{ t('@transfer.available') }}
      </slot>
      <veui-button
        ui="link"
        class="veui-transfer-select-all"
        :disabled="!isSelectable"
        @click="selectAll"
      >
        {{ t('@transfer.selectAll') }}
      </veui-button>
    </slot>
  </template>

  <template slot-scope="{ items }">
    <veui-tree
      :datasource="items"
      :expanded.sync="expanded"
      @click="select"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        <slot
          name="item"
          v-bind="props"
        >
          <div
            class="veui-transfer-candidate-item"
            :class="{'veui-transfer-candidate-item-hidden': props.item.hidden}"
          >
            <!-- 控制展开收起的图标 -->
            <button
              v-if="props.item.children && props.item.children.length"
              class="veui-tree-item-expand-switcher"
              tabindex="-1"
              @click.stop="toggle(props.item)"
            >
              <veui-icon
                :name="props.expanded ? icons.collapse : icons.expand"
                :label="t(props.expanded ? '@transfer.collapse' : '@transfer.expand')"
              />
            </button>

            <div
              class="veui-transfer-item-label"
              :class="{
                'veui-transfer-candidate-item-label-selected': props.item.visuallySelected
              }"
            >
              <span class="veui-transfer-item-text">
                <slot
                  name="item-label"
                  v-bind="props"
                >
                  {{ props.item.label }}
                </slot>
              </span>

              <!-- 未选中的时候， hover 上去应该展示的图标 -->
              <veui-icon
                v-if="!props.item.visuallySelected"
                class="veui-transfer-candidate-icon-unselected"
                :name="icons.select"
              />
              <!-- 选中的时候， hover 上去应该展示的图标 -->
              <veui-icon
                v-else
                class="veui-transfer-candidate-icon-selected"
                :name="icons.checked"
              />
            </div>
          </div>
        </slot>
      </template>
    </veui-tree>
  </template>

  <template slot="no-data">
    <slot name="no-data">
      {{ t('@transfer.noData') }}
    </slot>
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
  name: 'veui-candidate-panel',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-tree': Tree,
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [i18n],
  props: {
    datasource: Array,
    searchable: Boolean,
    filter: Function,
    placeholder: String,
    isSelectable: Boolean,
    expanded: Array,
    icons: Object
  },
  data () {
    return {
      localExpanded: []
    }
  },
  watch: {
    expanded: {
      handler (val, oldVal) {
        if (!isEqual(val, oldVal)) {
          this.localExpanded = clone(this.expanded)
        }
      },
      immediate: true
    },
    localExpanded (val, oldVal) {
      if (!isEqual(val, oldVal)) {
        this.$emit('update:expanded', val)
      }
    }
  },
  methods: {
    realFilter (keyword, option) {
      return this.filter('candidate', keyword, option, this.datasource)
    },
    toggle (option) {
      let expanded = clone(this.localExpanded)
      let index = expanded.indexOf(option.value)
      if (index > -1) {
        expanded.splice(index, 1)
      } else {
        expanded.push(option.value)
      }
      this.localExpanded = expanded
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
