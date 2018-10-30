import { find } from 'lodash'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'

export default {
  name: 'veui-table-row',
  components: {
    'veui-checkbox': Checkbox,
    'veui-radio': Radio
  },
  mixins: [table, i18n],
  props: {
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...table.mapTableData(
      'data',
      { realColumns: 'columns' },
      'selectable',
      'selectMode',
      'selectedItems',
      'keyField',
      { realKeys: 'keys' }
    )
  },
  render () {
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
                ? <veui-checkbox
                  checked={checked}
                  onChange={checked => { this.table.select(checked, index) }}
                  aria-label={this.t(checked ? '@table.deselectRow' : '@table.selectRow')}/>
                : <veui-radio
                  checked={checked}
                  onChange={checked => { this.table.select(checked, index) }}
                  aria-label={this.t('@table.selectRow')}/>
            }
          </div></td>
          : null
      }
      {
        this.columns.map(col => {
          let data = this.getCellSpan(col)
          return data
            ? <td
              class={col.align ? `veui-table-column-${col.align}` : null}
              role="cell"
              {...data}>
              <div class="veui-table-cell">{col.renderBody({ ...item, item, index })}</div>
            </td>
            : null
        })
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
    }
  }
}

