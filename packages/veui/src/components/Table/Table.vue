<template>
<div
  class="veui-table"
  :ui="realUi"
>
  <div
    v-if="scrollableY"
    class="veui-table-fixed-header"
    aria-hidden="true"
  >
    <table>
      <col-group gutter/>
      <table-head
        ref="head"
        @sort="sort"
      />
    </table>
  </div>
  <div
    ref="main"
    class="veui-table-main"
    :style="{
      maxHeight: scrollableY ? realScroll.y : null
    }"
  >
    <table>
      <slot/>
      <col-group/>
      <table-head
        v-if="!scrollableY"
        ref="head"
        @sort="sort"
      />
      <table-body>
        <template slot="no-data">
          <slot name="no-data">
            {{ t("noData") }}
          </slot>
        </template>
      </table-body>
      <table-foot
        v-if="!scrollableY && hasFoot"
        ref="foot"
      >
        <slot name="foot"/>
      </table-foot>
    </table>
  </div>
  <div
    v-if="scrollableY"
    class="veui-table-fixed-footer"
    aria-hidden="true"
  >
    <table>
      <col-group gutter/>
      <table-foot
        v-if="hasFoot"
        ref="foot"
      >
        <slot name="foot"/>
      </table-foot>
    </table>
  </div>
</div>
</template>

<script>
import warn from '../../utils/warn'
import { normalizeLength } from '../../utils/helper'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import {
  map,
  mapValues,
  intersection,
  includes,
  keys as objectKeys,
  find
} from 'lodash'
import Body from './_TableBody'
import Head from './_TableHead'
import Foot from './_TableFoot'
import ColGroup from './_ColGroup'
import { getElementScrollbarWidth } from '../../utils/browser'
import '../../common/uiTypes'
import { isEqualSet } from '../../utils/lang'

export default {
  name: 'veui-table',
  uiTypes: ['table'],
  components: {
    'table-body': Body,
    'table-head': Head,
    'table-foot': Foot,
    'col-group': ColGroup
  },
  mixins: [ui, i18n],
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    scroll: [Number, String, Object],
    keys: [String, Array],
    keyField: String,
    selectable: Boolean,
    expandable: Boolean,
    selectMode: {
      type: String,
      default: 'multiple',
      validator (val) {
        return val === 'single' || val === 'multiple'
      }
    },
    /* eslint-disable vue/require-prop-types */
    selected: {
      default () {
        return []
      }
    },
    /* eslint-enable vue/require-prop-types */
    expanded: {
      type: Array,
      default () {
        return []
      }
    },
    order: {
      type: [String, Boolean],
      default: false,
      validator (val) {
        return val === false || includes(['asc', 'desc'], val)
      }
    },
    orderBy: String,
    columnFilter: Array
  },
  data () {
    return {
      columns: [],
      localSelected: normalizeArray(this.selected),
      localExpanded: [...this.expanded],
      gutterWidth: 0
    }
  },
  computed: {
    columnIds () {
      return this.columns.map(({ id }) => id)
    },
    realSelected () {
      return this.selectMode === 'multiple'
        ? this.localSelected
        : this.localSelected[0] || null
    },
    realColumns () {
      if (!this.columnFilter) {
        return this.columns
      }
      return this.columns.filter(col => includes(this.columnFilter, col.field))
    },
    realScroll () {
      let { scroll } = this
      if (typeof scroll === 'number' || typeof scroll === 'string') {
        return {
          y: normalizeLength(scroll)
        }
      }
      return mapValues(scroll || {}, normalizeLength)
    },
    columnWidths () {
      return this.realColumns.map(({ width }) => normalizeLength(width))
    },
    viewColumnCount () {
      return (
        this.realColumns.length +
        (this.selectable ? 1 : 0) +
        (this.expandable ? 1 : 0)
      )
    },
    realKeys () {
      if (this.keyField) {
        let { span } =
          find(this.columns, ({ field }) => field === this.keyField) || {}
        if (typeof span === 'function') {
          return objectKeys(this.data)
            .map(index => {
              return {
                index,
                span: span(index)
              }
            })
            .filter(({ span: { row = 1, col = 1 } }) => row >= 1 && col >= 1)
            .map(({ index }) => this.data[index][this.keyField])
        }
        return map(this.data, this.keyField)
      }
      let keys = this.keys
      if (!keys) {
        keys = objectKeys(this.data)
      }
      if (typeof keys === 'string') {
        keys = map(this.data, keys)
      }
      return keys.map(String)
    },
    selectedItems () {
      return this.localSelected.reduce((selectedItems, key) => {
        selectedItems[key] = this.getItems(key)
        return selectedItems
      }, {})
    },
    selectStatus () {
      let keys = this.realKeys
      let inter = intersection(keys, this.localSelected)
      if (!inter.length) {
        return 'none'
      }
      if (inter.length === keys.length) {
        return 'all'
      }
      return 'partial'
    },
    hasFoot () {
      return (
        this.$scopedSlots.foot ||
        this.$slots.foot ||
        this.columns.some(col => col.hasFoot())
      )
    },
    scrollableY () {
      return this.realScroll.y && this.data.length
    },
    staleHead () {
      return this.realColumns.some(({ hasStaleHead }) => hasStaleHead())
    },
    staleFoot () {
      return this.realColumns.some(({ hasStaleFoot }) => hasStaleFoot())
    }
  },
  watch: {
    selected (val) {
      if (this.validateSelected(val)) {
        this.localSelected = normalizeArray(val)
      }
    },
    expanded (val) {
      this.localExpanded = val
    },
    localExpanded (val, oldVal) {
      if (val === oldVal || !isEqualSet(val, oldVal)) {
        this.$emit('update:expanded', val)
      }
    },
    realKeys (val) {
      this.localSelected = intersection(this.localSelected, val)
    },
    realSelected (val, oldVal) {
      if (val === oldVal || !isEqualSet(val, oldVal)) {
        this.$emit('update:selected', val)
      }
    }
  },
  created () {
    this.validateSelected()
  },
  mounted () {
    if (this.scrollableY) {
      this.updateLayout()
    }
  },
  updated () {
    if (this.staleHead) {
      this.$refs.head.$forceUpdate()
    }
    if (this.hasFoot && this.staleFoot) {
      this.$refs.foot.$forceUpdate()
    }
    if (this.scrollableY) {
      this.updateLayout()
    }
  },
  methods: {
    add (col) {
      let length = this.columns.length
      let index = col.index
      if (index >= length) {
        this.columns.push(col)
      } else {
        this.columns.splice(index, 0, col)
      }
    },
    removeById (id) {
      this.columns.splice(this.columnIds.indexOf(id), 1)
    },
    select (selected, index) {
      let item = null
      if (index !== undefined) {
        item = this.data[index]
        let key = this.getKeyByIndex(index)
        if (selected) {
          if (this.selectMode === 'multiple') {
            this.localSelected.push(key)
          } else {
            this.localSelected = [key]
          }
        } else {
          this.localSelected.splice(this.localSelected.indexOf(key), 1)
        }
      } else {
        if (selected) {
          this.localSelected = [...this.realKeys]
        } else {
          this.localSelected = []
        }
      }
      this.$emit('select', selected, item, this.selectedItems)
    },
    expand (expanded, index) {
      let key = this.getKeyByIndex(index)
      if (expanded) {
        this.localExpanded.push(key)
      } else {
        this.localExpanded.splice(this.localExpanded.indexOf(key), 1)
      }
    },
    getKeyByIndex (index) {
      let item = this.data[index]
      return this.keyField ? item[this.keyField] : this.realKeys[index]
    },
    getItems (key) {
      if (this.keyField) {
        let items = this.data.filter(item => item[this.keyField] === key)
        return items.length === 1 ? items[0] : items
      }
      return this.data[this.realKeys.indexOf(key)]
    },
    sort (field, order) {
      this.$emit('sort', field, order)
    },
    validateSelected (val = this.selected) {
      if (this.selectMode === 'single' && Array.isArray(this.selected)) {
        warn(
          '`selected` should not be an array when `select-mode` is `single`.',
          this
        )
        return false
      } else if (
        this.selectMode === 'multiple' &&
        !Array.isArray(this.selected)
      ) {
        warn(
          '`selected` should be an array when `select-mode` is `multiple`.',
          this
        )
        return false
      }
      return true
    },
    updateLayout () {
      this.gutterWidth = getElementScrollbarWidth(this.$refs.main)
    }
  }
}

function normalizeArray (val) {
  if (val == null) {
    return []
  }

  return Array.isArray(val) ? val : [val]
}
</script>
