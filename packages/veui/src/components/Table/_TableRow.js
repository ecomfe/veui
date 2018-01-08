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
        this.columns.map(col => (
          <td class={col.align ? `veui-table-column-${col.align}` : ''}><div class="veui-table-cell">{col.renderBody({ ...item, item, index })}</div></td>
        ))
      }
    </tr>
  }
}
