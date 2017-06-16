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
      { displayedColumns: 'columns' },
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
          ? <td><veui-checkbox checked={checked}
              key={this.keys[index]} onChange={checked => { this.table.select(checked, index) }}/></td>
          : ''
      }
      {
        this._l(this.columns, col => (
          <td>{col.renderBody.call(this._renderProxy, { item, col, index })}</td>
        ))
      }
    </tr>
  }
}
