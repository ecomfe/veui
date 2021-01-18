import Checkbox from '../Checkbox'
import Button from '../Button'
import Dropdown from '../Dropdown'
import Icon from '../Icon'
import Sorter from './_Sorter'
import Popover from '../Popover'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'
import '../../common/uiTypes'
import { isFocusable, contains } from '../../utils/dom'

export default {
  name: 'veui-table-head',
  components: {
    'veui-popover': Popover
  },
  mixins: [prefix, table, i18n],
  uiTypes: ['transparent'],
  data () {
    return {
      descOpen: {},
      filterOpen: {},
      sortHover: {}
    }
  },
  methods: {
    handleMouseover (id, hasDesc, sortable, e) {
      if (!sortable && !hasDesc) {
        return
      }

      let head = this.$refs[id]
      let unfocusable = !isInsideFocusable(e.target, head)

      if (sortable) {
        this.$set(this.sortHover, id, unfocusable)
      }
      if (hasDesc && !this.filterOpen[id]) {
        this.$set(this.descOpen, id, unfocusable)
      }
    },
    handleMouseout (id, hasDesc, sortable, e) {
      if (!sortable && !hasDesc) {
        return
      }

      let head = this.$refs[id]
      if (e.target === head && !contains(head, e.relatedTarget)) {
        if (sortable) {
          this.$set(this.sortHover, id, false)
        }
      }
    },
    handleToggleDesc (open, id) {
      if (!this.filterOpen[id]) {
        this.$set(this.descOpen, id, open)
      }
    },
    handleToggleFilter (open, id) {
      this.$set(this.filterOpen, id, open)
    },
    handleClick (id, e) {
      if (!isInsideFocusable(e.target, this.$refs[id])) {
        this.$refs[`sort-${id}`].sort()
      }
    }
  },
  render () {
    let { table } = this
    let depth = table.headerRows.length
    return (
      <thead>
        {table.headerRows.map((row, i) => (
          <tr>
            {table.selectable && i === 0 ? (
              <th
                scope="col"
                role="columnheader"
                rowspan={depth}
                class={{
                  [this.$c('table-cell-select')]: true,
                  [this.$c('table-cell-sticky-left')]: table.needFixLeft
                }}
                style={
                  table.scrollableX
                    ? {
                      left: 0
                    }
                    : null
                }
              >
                {i === 0 ? (
                  <div class={this.$c('table-cell')}>
                    <div class={this.$c('table-cell-content')}>
                      {table.selectMode === 'multiple' ? (
                        <Checkbox
                          checked={table.selectStatus !== 'none'}
                          disabled={!table.enabledData.length}
                          indeterminate={table.selectStatus === 'partial'}
                          onChange={checked => {
                            table.select(checked)
                          }}
                          aria-label={this.t(
                            table.selectStatus !== 'none'
                              ? '@table.unselectAll'
                              : '@table.selectAll'
                          )}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </th>
            ) : null}
            {table.expandable ? (
              <th
                scope="col"
                role="columnheader"
                class={{
                  [this.$c('table-cell-expand')]: true,
                  [this.$c('table-cell-sticky-left')]: table.needFixLeft
                }}
                style={
                  table.needFixLeft
                    ? {
                      left: table.selectable
                        ? `${table.selectColumnWidth}px`
                        : 0
                    }
                    : null
                }
              />
            ) : null}
            {row.map(col => {
              let isLeaf = col.columns.length === 0
              let desc = col.renderDesc({
                close: () => {
                  this.descOpen[col.id] = false
                }
              })
              return (
                <th
                  class={{
                    [this.$c('table-cell-center')]: !isLeaf,
                    [this.$c(`table-cell-${col.align}`)]: !!col.align && isLeaf,
                    [this.$c('table-cell-interactive')]:
                      !!col.sortable && isLeaf,
                    [this.$c('table-cell-sortable')]: !!col.sortable && isLeaf,
                    [this.$c('table-cell-filterable')]:
                      !!col.hasFilter() && isLeaf,
                    [this.$c('table-cell-filter-active')]:
                      col.filterValue === true,
                    [this.$c('table-cell-filter-open')]: this.filterOpen[
                      col.id
                    ],
                    [this.$c(`table-cell-sticky-${col.fixed}`)]:
                      table.scrollableX && col.fixed,
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
                  ref={col.id}
                  onMouseover={e => {
                    this.handleMouseover(col.id, !!desc, !!col.sortable, e)
                  }}
                  onMouseout={e => {
                    this.handleMouseout(col.id, !!desc, !!col.sortable, e)
                  }}
                  onClick={e => {
                    if (!!col.sortable && isLeaf) {
                      this.handleClick(col.id, e)
                    }
                  }}
                >
                  <div class={this.$c('table-cell')}>
                    <div class={this.$c('table-cell-content')}>
                      {col.renderHead()}
                    </div>
                    {col.sortable && isLeaf ? (
                      <Sorter
                        class={{
                          [this.$c('table-header-op')]: true,
                          [this.$c('hover')]: this.sortHover[col.id]
                        }}
                        order={
                          table.orderBy === col.field ? table.order : false
                        }
                        allowedOrders={col.allowedOrders || table.allowedOrders}
                        onSort={order => {
                          this.$emit('sort', col.field, order)
                        }}
                        ref={`sort-${col.id}`}
                      />
                    ) : null}
                    {col.hasFilter() && isLeaf ? (
                      <Dropdown
                        class={[
                          this.$c('table-header-op'),
                          this.$c('table-header-filter')
                        ]}
                        open={this.filterOpen[col.id]}
                        onToggle={open => this.handleToggleFilter(open, col.id)}
                        scopedSlots={{
                          default: ({ close }) => col.renderFilter({ close }),
                          trigger: ({ handlers, props }) => (
                            <Button
                              ui={this.table.uiParts.icon}
                              {...{
                                on: handlers,
                                props
                              }}
                            >
                              <Icon
                                name={this.table.icons.filter}
                                class={{
                                  [this.$c('table-header-icon')]: true,
                                  [this.$c('table-header-icon-active')]:
                                    col.filterValue === true
                                }}
                              />
                            </Button>
                          )
                        }}
                      />
                    ) : null}
                  </div>
                  {desc ? (
                    <veui-popover
                      ui={this.ui}
                      target={col.id}
                      open={this.descOpen[col.id]}
                      onToggle={open => this.handleToggleDesc(open, col.id)}
                      position="bottom"
                    >
                      {desc}
                    </veui-popover>
                  ) : null}
                </th>
              )
            })}
            {i === 0 && table.gutterWidth ? (
              <th
                class={{
                  [this.$c('table-gutter')]: true,
                  [this.$c('table-cell-sticky-right')]: table.hasFixedRight
                }}
                style={
                  table.hasFixedRight
                    ? {
                      right: 0
                    }
                    : null
                }
                aria-hidden="true"
                role="columnheader"
                rowspan={depth > 1 ? depth : null}
              />
            ) : null}
          </tr>
        ))}
      </thead>
    )
  }
}

function isInsideFocusable (el, context) {
  while (el && el !== context) {
    if (isFocusable(el)) {
      return true
    }

    el = el.parentNode
  }

  return false
}
