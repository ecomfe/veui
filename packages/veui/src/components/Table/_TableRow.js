import { find } from 'lodash'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import Icon from '../Icon'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'

export default {
  name: 'veui-table-row',
  mixins: [table, i18n],
  props: {
    index: Number,
    item: Object,
    expanded: Boolean
  },
  computed: {
    ...table.mapTableData(
      'data',
      'selectable',
      'selectMode',
      'selectedItems',
      'expandable',
      'keyField',
      'icons',
      { realKeys: 'keys' },
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    // hero sub row
    if (this.$slots.default) {
      return (
        <tr class="veui-table-sub-row">
          <td role="cell" colspan={this.columnCount}>
            <div class="veui-table-cell">{this.$slots.default}</div>
          </td>
        </tr>
      )
    }

    // isomorphic sub row
    if (this.item) {
      return (
        <tr class="veui-table-sub-row">
          {this.selectable ? <td role="cell" class="veui-table-cell-select"></td> : null}
          {this.expandable ? <td role="cell" class="veui-table-cell-expand"></td> : null}
          {this.renderColumns(this.index, this.item)}
        </tr>
      )
    }

    let index = this.index
    let item = this.data[index]
    let key = this.keyField
      ? item[this.keyField]
      : this.keys[index]
    let checked = !!this.selectedItems[key]

    let keyCol = find(this.columns, ({ field }) => field === this.keyField)
    let data = {}
    if (keyCol) {
      data = this.getCellSpan(keyCol)
    }

    return <tr class={{ 'veui-table-selected-row': checked }}>
      {
        this.selectable && data
          ? <td role="cell" {...data}><div class="veui-table-cell">
            {
              this.selectMode === 'multiple'
                ? (
                  <Checkbox
                    checked={checked}
                    onChange={checked => { this.table.select(checked, index) }}
                    aria-label={this.t(checked ? '@table.deselectRow' : '@table.selectRow')}/>
                )
                : (
                  <Radio
                    checked={checked}
                    onChange={checked => { this.table.select(checked, index) }}
                    aria-label={this.t('@table.selectRow')}/>
                )
            }
          </div></td>
          : null
      }
      {
        this.expandable
          ? <td role="cell" class="veui-table-cell-expand">
            {
              (item.children || []).length
                ? (
                  <button
                    aria-label={this.t(this.expanded ? '@table.collapseRow' : '@table.expandRow')}
                    onClick={() => { this.table.expand(!this.expanded, index) }}>
                    <transition name="veui-table-expander">
                      <Icon
                        class={`veui-table-expander veui-table-expander-${this.expanded ? 'collapse' : 'expand'}`}
                        name={this.expanded ? this.icons.collapse : this.icons.expand}/>
                    </transition>
                  </button>
                )
                : null
            }
          </td>
          : null
      }
      {
        this.renderColumns(index)
      }
    </tr>
  },
  methods: {
    getCellSpan (col) {
      let data = {
        attrs: {}
      }

      if (typeof col.span === 'function') {
        let { data: dataItems, index } = this
        let { col: colspan = 1, row: rowspan = 1 } = col.span(index, dataItems[index])
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
        return data
          ? <td
            class={col.align ? `veui-table-column-${col.align}` : null}
            role="cell"
            {...data}>
            <div class="veui-table-cell">
              {
                (isSubRow ? col.renderSubRow : col.renderBody)({ ...item, item, index })
              }
            </div>
          </td>
          : null
      })
    }
  }
}

