<template>
<veui-filter-panel
  :class="$c('transfer-candidate-panel')"
  :datasource="datasource"
  :searchable="searchable"
  :filter="realFilter"
  :placeholder="placeholder"
  :disabled="!isSelectable"
  :ui="ui"
>
  <template #head="{ items }">
    <slot
      name="head"
      v-bind="slotApi"
    >
      <slot
        name="title"
        v-bind="slotApi"
      >
        {{ t('@transfer.available') }}
      </slot>
      <veui-button
        :ui="uiParts.selectAll"
        :class="$c('transfer-select-all')"
        :disabled="!isSelectable"
        @click="selectAll(items)"
      >
        {{ t('@transfer.selectAll') }}
      </veui-button>
    </slot>
  </template>

  <template slot-scope="{ items, keyword }">
    <veui-tree
      ref="tree"
      :datasource="items"
      :expanded.sync="expanded"
      :merge-checked="mergeChecked"
      :include-indeterminate="includeIndeterminate"
      checkable
      :checked="realSelected"
      :ui="uiParts.tree"
      :disabled="!isSelectable"
      @check="handleSelect"
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
          v-bind="{ ...props, keyword }"
        />
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
import prefix from '../../mixins/prefix'
import i18n from '../../mixins/i18n'
import useTree from '../../mixins/tree'
import useControllable from '../../mixins/controllable'
import { getLeaves } from '../../utils/datasource'

export default {
  name: 'veui-candidate-panel',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-tree': Tree,
    'veui-button': Button
  },
  mixins: [
    prefix,
    i18n,
    useControllable({
      prop: 'selected',
      event: 'select',
      get (val) {
        return val || []
      }
    })
  ],
  props: {
    datasource: Array,
    searchable: Boolean,
    filter: Function,
    placeholder: String,
    isSelectable: Boolean,
    selected: Array,
    ...useTree().props,
    uiParts: Object,
    ui: String
  },
  data () {
    return {
      expanded: []
    }
  },
  computed: {
    leavesCount () {
      return getLeaves(this.datasource).length
    },
    slotApi () {
      return {
        count: this.leavesCount
      }
    }
  },
  methods: {
    realFilter (keyword, option) {
      return this.filter('candidate', keyword, option, this.datasource)
    },
    selectAll (items) {
      this.$emit('selectall', items)
    },
    select (...args) {
      this.$emit('select', ...args)
    },
    handleSelect (selected) {
      this.commit('selected', selected)
    }
  }
}
</script>
