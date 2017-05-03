import Checkbox from '../Checkbox'
import { table } from '../../mixins'

export default {
  components: {
    'veui-checkbox': Checkbox
  },
  mixins: [table],
  props: {
    data: Array,
    columns: Array,
    selectable: Boolean,
    selectedItems: Object,
    keys: Array
  },
  render () {
    return (
      <tbody>
        {this._l(this.data, (item, index) => {
          let checked = !!this.selectedItems[this.keys ? this.keys[index] : index]
          return (
            <tr class={{ 'veui-table-selected-row': checked }}>
              {
                this.table.selectable
                  ? <td><veui-checkbox checked={checked}
                      key={this.keys[index]} onChange={checked => { this.$emit('select', checked, index) }}/></td>
                  : ''
              }
              {
                this._l(this.columns, col => (
                  <td>{col.renderBody.call(this._renderProxy, { item, col, index })}</td>
                ))
              }
            </tr>
          )
        })}
      </tbody>
    )
  }
}
