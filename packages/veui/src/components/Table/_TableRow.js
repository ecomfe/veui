import { find } from 'lodash'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'
import i18n from '../../mixins/i18n'

export default {
  name: 'veui-table-row',
  mixins: [prefix, table, i18n],
  uiTypes: ['transparent'],
  props: {
    index: Number,
    item: Object,
    expanded: Boolean
  },
  computed: {
    ...mapTableData(
      'data',
      'selectable',
      'selectMode',
      'selectedItems',
      'expandable',
      'keyField',
      'icons',
      'uiParts',
      { realKeys: 'keys' },
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    // hero sub row
    if (this.$slots.default) {
      return (
        <tr class={this.$c('table-sub-row')}>
          <td role="cell" colspan={this.columnCount}>
            <div class={this.$c('table-cell')}>{this.$slots.default}</div>
          </td>
        </tr>
      )
    }

    // isomorphic sub row
    if (this.item) {
      return (
        <tr class={this.$c('table-sub-row')}>
          {this.selectable ? (
            <td role="cell" class={this.$c('table-cell-select')} />
          ) : null}
          {this.expandable ? (
            <td role="cell" class={this.$c('table-cell-expand')} />
          ) : null}
          {this.renderColumns(this.index, this.item)}
        </tr>
      )
    }

    let index = this.index
    let item = this.data[index]
    let key = this.keyField ? item[this.keyField] : this.keys[index]
    let checked = !!this.selectedItems[key]

    let keyCol = find(this.columns, ({ field }) => field === this.keyField)
    let data = {}
    if (keyCol) {
      data = this.getCellSpan(keyCol)
    }

    return (
      <tr class={{ [this.$c('table-selected-row')]: checked }}>
        {this.selectable && data ? (
          <td role="cell" {...data}>
            <div class={this.$c('table-cell')}>
              {this.selectMode === 'multiple' ? (
                <Checkbox
                  checked={checked}
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
                  onChange={checked => {
                    this.table.select(checked, index)
                  }}
                  aria-label={this.t('@table.selectRow')}
                />
              )}
            </div>
          </td>
        ) : null}
        {this.expandable ? (
          <td role="cell" class={this.$c('table-cell-expand')}>
            <div class={this.$c('table-cell')}>
              {(item.children || []).length ? (
                <Button
                  ui={this.uiParts.icon}
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
                      this.expanded ? this.icons.collapse : this.icons.expand
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
      let data = {
        attrs: {}
      }

      if (typeof col.span === 'function') {
        let { data: dataItems, index } = this
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
      let isSubRow = !!subItem
      let item = subItem || this.data[index]
      return this.columns.map(col => {
        let data = this.getCellSpan(col)
        return data ? (
          <td
            class={col.align ? this.$c(`table-cell-${col.align}`) : null}
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
