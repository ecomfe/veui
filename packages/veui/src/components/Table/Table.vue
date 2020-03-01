<template>
<div
  v-resize="updateLayout"
  :class="{
    [$c('table')]: true,
    [$c('table-bordered')]: realBordered,
    [$c('table-hit-top')]: hit.top,
    [$c('table-hit-right')]: hit.right,
    [$c('table-hit-bottom')]: hit.bottom,
    [$c('table-hit-left')]: hit.left
  }"
  :ui="realUi"
>
  <div v-show="false">
    <slot/>
  </div>
  <div
    v-if="scrollableY"
    ref="fixedHeader"
    :class="$c('table-fixed-header')"
  >
    <table
      :style="{
        minWidth: scrollableX
          ? `calc(${realScroll.x} + ${gutterWidth}px)`
          : null
      }"
    >
      <col-group gutter/>
      <table-head
        ref="head"
        @sort="sort"
      />
    </table>
  </div>
  <div
    ref="main"
    :class="$c('table-main')"
    :style="{
      maxHeight: scrollableY ? realScroll.y : null
    }"
  >
    <table
      ref="table"
      v-resize="updateLayout"
      :style="{
        minWidth: scrollableX ? realScroll.x : null
      }"
    >
      <col-group/>
      <table-head
        v-if="!scrollableY"
        ref="head"
        @sort="sort"
      />
      <table-body>
        <template slot="no-data">
          <slot name="no-data">{{ t('noData') }}</slot>
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
    v-if="scrollableY && hasFoot"
    ref="fixedFooter"
    :class="$c('table-fixed-footer')"
  >
    <table
      :style="{
        minWidth: scrollableX
          ? `calc(${realScroll.x} + ${gutterWidth}px)`
          : null
      }"
    >
      <col-group gutter/>
      <table-foot ref="foot">
        <slot name="foot"/>
      </table-foot>
    </table>
  </div>
  <div
    v-if="scrollableX"
    aria-hidden="true"
  >
    <div
      :class="{
        [$c('table-overflow-shadow-left')]: true,
        [$c('table-overflow-shadow-edge')]:
          !hasFixedLeft && !selectable && !expandable
      }"
      :style="{
        width: shadowOffset.left
      }"
    />
    <div
      :class="{
        [$c('table-overflow-shadow-right')]: true,
        [$c('table-overflow-shadow-edge')]: !hasFixedRight
      }"
      :style="{
        width: shadowOffset.right
      }"
    />
  </div>
</div>
</template>

<script>
import warn from '../../utils/warn'
import config from '../../managers/config'
import { normalizeLength } from '../../utils/helper'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import i18n from '../../mixins/i18n'
import colgroup from '../../mixins/colgroup'
import resize from '../../directives/resize'
import {
  map,
  mapValues,
  intersection,
  includes,
  find,
  findIndex,
  findLastIndex,
  omit
} from 'lodash'
import Body from './_TableBody'
import Head from './_TableHead'
import Foot from './_TableFoot'
import ColGroup from './_ColGroup'
import { getElementScrollbarWidth } from '../../utils/browser'
import '../../common/uiTypes'
import { isEqualSet } from '../../utils/lang'
import { walk } from '../../utils/datasource'
import { cssSupports, preventBackForward } from '../../utils/dom'

config.defaults(
  {
    allowedOrders: ['desc', 'asc']
  },
  'table'
)

const FIXED_PRIORITY = {
  left: 0,
  false: 1,
  right: 2
}

const DEFAULT_FIXED_COL_WIDTH = 120

export default {
  name: 'veui-table',
  uiTypes: ['table'],
  components: {
    'table-body': Body,
    'table-head': Head,
    'table-foot': Foot,
    'col-group': ColGroup
  },
  directives: {
    resize
  },
  mixins: [prefix, ui, i18n, colgroup],
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
    bordered: Boolean,
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
      localSelected: normalizeArray(this.selected),
      localExpanded: [...this.expanded],
      gutterWidth: 0,
      selectColumnWidth: 0,
      expandColumnWidth: 0,
      overflow: {
        x: false,
        y: false
      },
      hit: {
        top: true,
        right: false,
        left: true,
        bottom: false
      },
      width: null,
      supportSticky: true
    }
  },
  computed: {
    realSelected () {
      return this.selectMode === 'multiple'
        ? this.localSelected
        : this.localSelected[0] || null
    },
    filteredColumns () {
      return this.filterColumns(this.columns)
    },
    sortedColumns () {
      return this.filteredColumns.sort(
        (col1, col2) => FIXED_PRIORITY[col1.fixed] - FIXED_PRIORITY[col2.fixed]
      )
    },
    realColumns () {
      return this.headerGrid[this.headerGrid.length - 1]
    },
    headerDepth () {
      return getDepth(this.sortedColumns)
    },
    headerGrid () {
      let rows = [...Array(this.headerDepth + 1)].map(() => [])

      walk(
        this.sortedColumns,
        {
          exit: (col, { depth }) => {
            let leaves = getLeaves(col)

            if (col.columns.length === 0) {
              // leaf columns are used to calculate sticky offsets
              let cell = { ...col, width: col.width }
              if (col.fixed) {
                if (!col.width) {
                  cell.width = DEFAULT_FIXED_COL_WIDTH
                  warn(
                    `[veui-table] Lacking specified width for column "${col.field}". Fixed leaf columns must have specified width. Default to \`${DEFAULT_FIXED_COL_WIDTH}\` when not specified and this may change in future versions.`,
                    this
                  )
                }

                let row = rows[depth]
                if (col.fixed === 'left') {
                  cell.offset = sumWidths([
                    this.offsetLeft,
                    ...row.map(({ width }) => width)
                  ])
                }
              }

              let rowspan = this.headerDepth - depth + 1
              cell.rowspan = rowspan

              for (let i = 0; i < rowspan; i++) {
                rows[depth + i].push({
                  ...cell,
                  placeholder: i > 0
                })
              }
            } else {
              let row = rows[depth]
              let index = row.length

              let colspan = leaves.length

              for (let i = 0; i < colspan; i++) {
                let cell = {
                  ...col,
                  colspan,
                  width: rows[rows.length - 1][index + i].width,
                  placeholder: i > 0
                }
                if (col.fixed === 'left') {
                  cell.offset = sumWidths([
                    this.offsetLeft,
                    ...row.map(({ width }) => width)
                  ])
                }
                row.push(cell)
              }
            }
          }
        },
        'columns'
      )

      let colCount = rows[0].length
      rows.forEach(row => {
        for (let i = 0; i < colCount; i++) {
          let prev = row[i - 1]
          let cell = row[i]
          let next = row[i + 1]

          if (cell.fixed === 'left') {
            if (next && !next.fixed) {
              cell.edge = true
            }
          } else if (cell.fixed === 'right') {
            let { colspan } = cell
            let rightEdge = i + (colspan > 1 ? colspan - 1 : 0) + 1
            let widths = row.slice(rightEdge).map(({ width }) => width)
            cell.offset = sumWidths(widths.concat(this.gutterWidth))
            cell.bodyOffset = sumWidths(widths)

            if (prev && !prev.fixed) {
              cell.edge = true
            }
          }
        }
      })

      return rows
    },
    headerRows () {
      return this.headerGrid.map(row =>
        row.filter(({ placeholder }) => !placeholder)
      )
    },
    shadowOffset () {
      if (!this.supportSticky) {
        return {
          left: 20,
          right: 20
        }
      }
      let row = this.headerGrid[this.headerGrid.length - 1]
      let leftEnd = findLastIndex(row, cell => cell.fixed === 'left')
      let rightStart = findIndex(row, cell => cell.fixed === 'right')
      rightStart = rightStart === -1 ? row.length : rightStart

      // make shadow placeholders at least 20px width because
      // box-shadow will be affected by element size when
      // either width or height is smaller than blur radius
      return {
        left: sumWidths(
          row
            .slice(0, leftEnd + 1)
            .map(({ width }) => width)
            .concat(this.offsetLeft, 20)
        ),
        right: sumWidths(
          row
            .slice(rightStart)
            .map(({ width }) => width)
            .concat(this.hasFixedRight ? this.gutterWidth : [], 20)
        )
      }
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
    hasSpan () {
      return this.realColumns.some(({ span }) => span)
    },
    hasFixedLeft () {
      return this.realColumns.some(({ fixed }) => fixed === 'left')
    },
    hasFixedRight () {
      return this.realColumns.some(({ fixed }) => fixed === 'right')
    },
    realBordered () {
      return this.bordered || this.hasSpan
    },
    realKeys () {
      if (this.keyField) {
        let { span } =
          find(this.realColumns, ({ field }) => field === this.keyField) || {}
        if (typeof span === 'function') {
          return Object.keys(this.data)
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
        keys = Object.keys(this.data)
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
        this.filteredColumns.some(col => col.hasFoot())
      )
    },
    scrollableX () {
      return this.realScroll.x && this.data.length
    },
    scrollableY () {
      return this.realScroll.y && this.data.length
    },
    staleHead () {
      return this.realColumns.some(({ hasStaleHead }) => hasStaleHead())
    },
    staleFoot () {
      return this.realColumns.some(({ hasStaleFoot }) => hasStaleFoot())
    },
    offsetLeft () {
      return this.selectColumnWidth + this.expandColumnWidth
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
    this.supportSticky = cssSupports('position', 'sticky')

    if (this.scrollableX || this.scrollableY) {
      this.updateLayout()
      this.$refs.main.addEventListener('scroll', this.updateScrollState)
    }

    if (this.scrollableX) {
      this.removeBackForwardPreventer = preventBackForward(this.$refs.main)
    }

    if (this.selectable && this.scrollableX) {
      this.selectColumnWidth = this.$el.querySelector(
        `.${this.$c('table-cell-select')}`
      ).offsetWidth
    }
    if (this.expandable && this.scrollableX) {
      this.expandColumnWidth = this.$el.querySelector(
        `.${this.$c('table-cell-expand')}`
      ).offsetWidth
    }
  },
  beforeDestroy () {
    if (this.scrollableY) {
      this.$refs.main.removeEventListener('scroll', this.updateScrollState)
    }

    if (this.removeBackForwardPreventer) {
      this.removeBackForwardPreventer()
    }
  },
  updated () {
    if (this.staleHead) {
      this.$refs.head.$forceUpdate()
    }
    if (this.hasFoot && this.staleFoot) {
      this.$refs.foot.$forceUpdate()
    }
  },
  methods: {
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
      let { main, table } = this.$refs
      this.overflow = {
        x: table.offsetWidth > main.clientWidth,
        y: table.offsetHeight > main.clientHeight
      }
      if (this.overflow.y) {
        this.gutterWidth = getElementScrollbarWidth(main)
      }
      this.width = main.clientWidth

      this.updateScrollState()
    },
    updateScrollState () {
      let { main, fixedHeader, fixedFooter } = this.$refs

      if (this.scrollableX) {
        this.hit.right = main.scrollLeft + main.clientWidth >= main.scrollWidth
        this.hit.left = main.scrollLeft === 0
      }

      if (this.scrollableY) {
        this.hit.top = main.scrollTop === 0
        this.hit.bottom =
          main.scrollTop + main.clientHeight >= main.scrollHeight
      }

      if (fixedHeader) {
        fixedHeader.scrollLeft = main.scrollLeft
      }

      if (fixedFooter) {
        fixedFooter.scrollLeft = main.scrollLeft
      }
    },
    filterColumns (columns) {
      let cols = []
      columns.forEach(col => {
        let c = omit(col, 'columns')
        c.columns = this.filterColumns(col.columns)
        if (
          c.columns.length > 0 ||
          (c.field &&
            (!this.columnFilter || this.columnFilter.indexOf(c.field) !== -1))
        ) {
          cols.push(c)
        }
      })
      return cols
    }
  }
}

function normalizeArray (val) {
  if (val == null) {
    return []
  }

  return Array.isArray(val) ? val : [val]
}

function getLeaves (col) {
  let leaves = []
  walk(
    col.columns,
    column => {
      if (column.columns.length === 0) {
        leaves.push(column)
      }
    },
    'columns'
  )
  return leaves
}

function getDepth (cols) {
  let max = 0
  walk(
    cols,
    (_, { depth }) => {
      if (depth > max) {
        max = depth
      }
    },
    'columns'
  )
  return max
}

function sumWidths (widths) {
  let normalized = widths.map(normalizeLength).filter(w => w)
  return normalized.length === 0
    ? 0
    : normalized.length === 1
      ? normalized[0]
      : `calc(${normalized.join(' + ')})`
}
</script>
