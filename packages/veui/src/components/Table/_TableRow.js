import Checkbox from '../Checkbox'
import Radio from '../Radio'
import { table } from '../../mixins'

export default {
  name: 'veui-table-row',
  components: {
    'veui-checkbox': Checkbox,
    'veui-radio': Radio
  },
  mixins: [table],
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
      { realKeys: 'keys' }
    )
  },
  render () {
    let index = this.index
    let checked = !!this.selectedItems[this.keys ? this.keys[index] : index]
    let item = this.data[index]
    return <tr class={{ 'veui-table-selected-row': checked }}>
      {
        this.selectable
          ? <td><div class="veui-table-cell">
            {
              this.selectMode === 'multiple'
                ? <veui-checkbox checked={checked}
                  onChange={checked => { this.table.select(checked, index) }}/>
                : <veui-radio checked={checked}
                  onChange={checked => { this.table.select(checked, index) }}/>
            }
          </div></td>
          : null
      }
      {
        this.columns.map(col => {
          let data = {
            attrs: {}
          }
          if (typeof col.span === 'function') {
            let { col: colspan, row: rowspan } = col.span(index)
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
          return <td class={col.align ? `veui-table-column-${col.align}` : null} {...data}>
            <div class="veui-table-cell">{col.renderBody({ ...item, item, index })}</div>
          </td>
        })
      }
    </tr>
  }
}
