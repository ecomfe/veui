import { find } from 'lodash'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'
import '../../common/uiTypes'

export default {
  name: 'veui-table-row',
  mixins: [prefix, table, i18n],
  uiTypes: ['transparent'],
  props: {
    index: Number,
    item: Object,
    expanded: Boolean
  },
  render () {
    let { table } = this

    // hero sub row
    if (this.$slots.default) {
      return (
        <tr class={this.$c('table-sub-row')}>
          <td
            role="cell"
            class={{
              [this.$c('table-cell-hero')]: true
            }}
            colspan={table.viewColumnCount}
          >
            <div
              class={this.$c('table-cell')}
              style={{
                width: table.width
                  ? `${table.width - (table.realBordered ? 1 : 0)}px`
                  : null
              }}
            >
              {this.$slots.default}
            </div>
          </td>
        </tr>
      )
    }

    // isomorphic sub row
    if (this.item) {
      return (
        <tr class={this.$c('table-sub-row')}>
          {table.selectable ? (
            <td
              role="cell"
              class={{
                [this.$c('table-cell-sticky-left')]: table.scrollableX
              }}
              style={
                table.scrollableX
                  ? {
                    left: 0
                  }
                  : null
              }
            />
          ) : null}
          {table.expandable ? (
            <td
              role="cell"
              class={{
                [this.$c('table-cell-sticky-left')]: table.scrollableX
              }}
              style={
                table.scrollableX
                  ? {
                    left: table.selectable
                      ? `${table.selectColumnWidth}px`
                      : 0
                  }
                  : null
              }
            />
          ) : null}
          {this.renderColumns(this.index, this.item)}
        </tr>
      )
    }

    let index = this.index
    let item = table.data[index]
    let key = table.keyField ? item[table.keyField] : table.realKeys[index]
    let checked = !!table.selectedItems[key]

    let keyCol = find(
      table.realColumns,
      ({ field }) => field === table.keyField
    )
    let data = {}
    if (keyCol) {
      data = this.getCellSpan(keyCol)
    }

    return (
      <tr class={{ [this.$c('table-selected-row')]: checked }}>
        {table.selectable && data ? (
          <td
            role="cell"
            {...data}
            class={{
              [this.$c('table-cell-select')]: true,
              [this.$c('table-cell-sticky-left')]: table.scrollableX
            }}
            style={
              table.scrollableX
                ? {
                  left: 0
                }
                : null
            }
          >
            <div class={this.$c('table-cell')}>
              {table.selectMode === 'multiple' ? (
                <Checkbox
                  checked={checked}
                  disabled={!!item.disabled}
                  onChange={checked => {
                    this.table.select(checked, index)
                  }}
                  aria-label={this.t(
                    checked ? '@table.deselectRow' : '@table.selectRow'
                  )}
                />
              ) : (
                <Radio
                  checked={checked}
                  disabled={!!item.disabled}
                  onChange={checked => {
                    this.table.select(checked, index)
                  }}
                  aria-label={this.t('@table.selectRow')}
                />
              )}
            </div>
          </td>
        ) : null}
        {table.expandable ? (
          <td
            role="cell"
            class={{
              [this.$c('table-cell-expand')]: true,
              [this.$c('table-cell-sticky-left')]: table.scrollableX
            }}
            style={
              table.scrollableX
                ? {
                  left: table.selectable ? `${table.selectColumnWidth}px` : 0
                }
                : null
            }
          >
            <div class={this.$c('table-cell')}>
              {(item.children || []).length ? (
                <Button
                  ui={table.uiParts.icon}
                  aria-label={this.t(
                    this.expanded ? '@table.collapseRow' : '@table.expandRow'
                  )}
                  onClick={() => {
                    this.table.expand(!this.expanded, index)
                  }}
                >
                  <Icon
                    class={[
                      this.$c('table-expander'),
                      this.$c(
                        `table-expander-${
                          this.expanded ? 'collapse' : 'expand'
                        }`
                      )
                    ]}
                    name={
                      this.expanded ? table.icons.collapse : table.icons.expand
                    }
                  />
                </Button>
              ) : null}
            </div>
          </td>
        ) : null}
        {this.renderColumns(index)}
      </tr>
    )
  },
  methods: {
    getCellSpan (col) {
      let { table } = this
      let data = {
        attrs: {}
      }

      if (typeof col.span === 'function') {
        let { data: dataItems } = table
        let { index } = this
        let { col: colspan = 1, row: rowspan = 1 } = col.span(
          index,
          dataItems[index]
        )
        if (colspan < 1 || rowspan < 1) {
          return null
        }
        if (colspan > 1) {
          data.attrs.colspan = colspan
        }
        if (rowspan > 1) {
          data.attrs.rowspan = rowspan
        }
      }

      return data
    },
    renderColumns (index, subItem) {
      let { table } = this
      let isSubRow = !!subItem
      let item = subItem || table.data[index]
      let { realColumns } = table

      return realColumns.map((col, i) => {
        let data = this.getCellSpan(col)
        return data ? (
          <td
            class={{
              [this.$c(`table-cell-${col.align}`)]: !!col.align,
              [this.$c(`table-cell-sticky-${col.fixed}`)]:
                table.scrollableX && col.fixed,
              [this.$c('table-cell-first')]:
                i === 0 && !table.selectable && !table.expandable,
              [this.$c('table-cell-last')]: i === realColumns.length - 1
            }}
            style={
              table.scrollableX && col.fixed
                ? {
                  [col.fixed]:
                      col.bodyOffset != null ? col.bodyOffset : col.offset
                }
                : null
            }
            role="cell"
            {...data}
          >
            <div class={this.$c('table-cell')}>
              <div class={this.$c('table-cell-content')}>
                {(isSubRow ? col.renderSubRow : col.renderBody)({
                  ...item,
                  item,
                  index
                })}
              </div>
            </div>
          </td>
        ) : null
      })
    }
  }
}
