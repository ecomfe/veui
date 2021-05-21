import Button from '../Button'
import Select from '../Select'
import Icon from '../Icon'
import Sorter from './_Sorter'
import Popover from '../Popover'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'
import { isInsideFocusable, contains } from '../../utils/dom'

export default {
  name: 'veui-table-head-cell',
  uiTypes: ['transparent'],
  mixins: [prefix, table, i18n],
  props: {
    leaf: Boolean,
    col: {
      type: Object,
      requried: true
    }
  },
  data () {
    return {
      descOpen: false,
      sortHover: false,
      filterOpen: false,
      filterValue: this.col.filterValue
    }
  },
  computed: {
    filterActive () {
      let { filterMultiple, filterValue } = this.col
      return filterMultiple
        ? (filterValue || []).length > 0
        : filterValue != null
    },
    isLeaf () {
      let { columns } = this.col
      return !columns || columns.length === 0
    }
  },
  watch: {
    'col.filterValue' (val) {
      this.resetFilterValue(val)
    }
  },
  methods: {
    handleMouseover (hasDesc, sortable, e) {
      if (!sortable && !hasDesc) {
        return
      }

      let head = this.$refs.self
      let unfocusable = !isInsideFocusable(e.target, head)

      if (sortable) {
        this.sortHover = unfocusable
      }
      if (hasDesc && !this.filterOpen) {
        this.descOpen = unfocusable
      }
    },
    handleMouseout (hasDesc, sortable, e) {
      if (!sortable && !hasDesc) {
        return
      }

      let head = this.$refs.self
      if (e.target === head && !contains(head, e.relatedTarget)) {
        if (sortable) {
          this.sortHover = false
        }
      }
    },
    handleSort (order) {
      this.$emit('sort', order)
    },
    handleToggleDesc (open) {
      if (!this.filterOpen) {
        this.descOpen = open
      }
    },
    handleFilterToggle (open) {
      if (!open) {
        this.filterValue = this.col.filterValue
      }
      this.filterOpen = open
    },
    handleFilterChange (val) {
      this.filterValue = val
    },
    handleFilterSubmit (val) {
      this.filterValue = val
      this.col.handleFilterChange(val)
    },
    handleClick (e) {
      let { col, isLeaf } = this

      if (!col.sortable || !isLeaf) {
        return
      }

      if (!isInsideFocusable(e.target, this.$refs.self)) {
        this.$refs.sort.sort()
      }
    },
    handleClose () {
      this.descOpen = false
    },
    resetFilterValue (val = this.col.filterValue) {
      this.filterValue = Array.isArray(val) ? [...val] : val
    }
  },
  render () {
    let { col, isLeaf, table } = this
    let desc = col.renderDesc({
      close: this.handleClose
    })

    return (
      <th
        class={{
          [this.$c('table-cell-center')]: !isLeaf,
          [this.$c(`table-cell-${col.align}`)]: !!col.align && isLeaf,
          [this.$c('table-cell-interactive')]: !!col.sortable && isLeaf,
          [this.$c('table-cell-sortable')]: !!col.sortable && isLeaf,
          [this.$c(`table-cell-sticky-${col.fixed}`)]:
            table.scrollableX && col.fixed,
          [this.$c(`table-cell-sticky-edge`)]: table.scrollableX && col.edge,
          [this.$c('table-cell-first')]: col.first,
          [this.$c('table-cell-last')]: col.last
        }}
        style={
          table.scrollableX
            ? {
              [col.fixed]: col.offset
            }
            : null
        }
        scope="col"
        role="columnheader"
        aria-sort={
          table.orderBy === col.field && table.order
            ? `${table.order}ending`
            : null
        }
        colspan={col.colspan > 1 ? col.colspan : null}
        rowspan={col.rowspan > 1 ? col.rowspan : null}
        ref="self"
        onMouseover={e => {
          this.handleMouseover(!!desc, !!col.sortable, e)
        }}
        onMouseout={e => {
          this.handleMouseout(!!desc, !!col.sortable, e)
        }}
        onClick={this.handleClick}
      >
        <div class={this.$c('table-cell')}>
          <div class={this.$c('table-cell-content')}>{col.renderHead()}</div>
          {col.sortable && isLeaf ? (
            <Sorter
              class={{
                [this.$c('table-header-op')]: true,
                [this.$c('hover')]: this.sortHover
              }}
              order={table.orderBy === col.field ? table.order : false}
              allowedOrders={col.allowedOrders || table.allowedOrders}
              onSort={this.handleSort}
              ref="sort"
            />
          ) : null}
          {col.hasFilter() && isLeaf ? (
            <Select
              class={[
                this.$c('table-header-op'),
                this.$c('table-header-filter')
              ]}
              {...{
                props: {
                  options: col.filterOptions,
                  expanded: this.filterOpen || false,
                  multiple: col.filterMultiple,
                  value: this.filterValue || null,
                  overlayClass: this.$c('table-header-filter-overlay')
                },
                on: {
                  toggle: this.handleFilterToggle,
                  change: col.filterMultiple
                    ? this.handleFilterChange
                    : this.handleFilterSubmit
                }
              }}
              scopedSlots={{
                trigger: ({ handlers, attrs }) => (
                  <Button
                    {...{
                      on: handlers,
                      attrs: {
                        ...attrs,
                        ui: this.table.uiParts.icon
                      }
                    }}
                  >
                    <Icon
                      name={this.table.icons.filter}
                      class={{
                        [this.$c('table-header-icon')]: true,
                        [this.$c('table-header-icon-active')]: this.filterActive
                      }}
                    />
                  </Button>
                ),
                before: col.hasFilterSlot()
                  ? props => (
                    <div class={this.$c('table-filter-custom')}>
                      {col.renderFilter(props)}
                    </div>
                  )
                  : null,
                after: col.filterMultiple
                  ? () => (
                    <div class={this.$c('table-filter-actions')}>
                      <Button
                        ui="strong text"
                        onClick={() => {
                          this.handleFilterSubmit(this.filterValue)
                          this.handleFilterToggle(false)
                        }}
                      >
                        {this.t('@table.apply')}
                      </Button>
                      <Button
                        ui="text"
                        onClick={() => {
                          this.handleFilterSubmit(null)
                          this.handleFilterToggle(false)
                        }}
                      >
                        {this.t('@table.clear')}
                      </Button>
                    </div>
                  )
                  : null
              }}
            />
          ) : null}
        </div>
        {desc ? (
          <Popover
            ui={this.ui}
            target="self"
            open={this.descOpen}
            onToggle={this.handleToggleDesc}
            position="bottom"
          >
            {desc}
          </Popover>
        ) : null}
      </th>
    )
  }
}
