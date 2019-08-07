<template>
<veui-filter-panel
  class="veui-transfer-candidate-panel"
  :datasource="datasource"
  :searchable="searchable"
  :filter="realFilter"
  :placeholder="placeholder"
  :ui="realUi"
>
  <template slot="head">
    <slot name="head">
      <slot name="title">
        {{ t("@transfer.available") }}
      </slot>
      <veui-button
        ui="text"
        class="veui-transfer-select-all"
        :disabled="!isSelectable"
        @click="selectAll"
      >
        {{ t("@transfer.selectAll") }}
      </veui-button>
    </slot>
  </template>

  <template slot-scope="{ items, keyword }">
    <veui-tree
      ref="tree"
      :datasource="items"
      :expanded.sync="expanded"
      selectable
      :selected="localSelected"
      :ui="uiParts.tree"
      :disabled="!isSelectable"
      @select="handleSelect"
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
      {{ t("@transfer.noData") }}
    </slot>
  </template>
</veui-filter-panel>
</template>

<script>
import FilterPanel from '../FilterPanel'
import Tree from '../Tree'
import Button from '../Button'
import i18n from '../../mixins/i18n'
import { clone } from 'lodash'

export default {
  name: 'veui-candidate-panel',
  components: {
    'veui-filter-panel': FilterPanel,
    'veui-tree': Tree,
    'veui-button': Button
  },
  mixins: [i18n],
  props: {
    datasource: Array,
    searchable: Boolean,
    filter: Function,
    placeholder: String,
    isSelectable: Boolean,
    selected: Array,
    uiParts: Object,
    realUi: String
  },
  data () {
    return {
      expanded: [],
      localSelected: this.selected ? clone(this.selected) : []
    }
  },
  watch: {
    selected (v) {
      this.localSelected = v ? clone(v) : []
    }
  },
  methods: {
    realFilter (keyword, option) {
      return this.filter('candidate', keyword, option, this.datasource)
    },
    selectAll () {
      this.$emit('selectall')
    },
    select (...args) {
      this.$emit('select', ...args)
    },
    handleSelect (selected) {
      this.localSelected = selected
      this.$emit('select', this.localSelected)
    }
  }
}
</script>
