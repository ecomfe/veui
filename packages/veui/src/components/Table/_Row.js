import Checkbox from '../Checkbox'
import { table } from '../../mixins'

export default {
  name: 'veui-table-row',
  components: {
    'veui-checkbox': Checkbox
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
          ? <td><div class="veui-table-cell"><veui-checkbox checked={checked}
              key={this.keys[index]} onChange={checked => { this.table.select(checked, index) }}/></div></td>
          : ''
      }
      {
        this.columns.map(col => (
          <td class={col.align ? `veui-table-column-${col.align}` : ''}><div class="veui-table-cell">{col.renderBody.call(this._renderProxy, { item, col, index })}</div></td>
        ))
      }
    </tr>
  }
}
