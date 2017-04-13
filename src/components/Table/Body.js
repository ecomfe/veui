import Checkbox from '../Checkbox'
import mixin from './mixin'

export default {
  components: {
    'veui-checkbox': Checkbox
  },
  mixins: [mixin],
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
        {this._l(this.data, (item, index) => (
          <tr>
            {
              this.table.selectable
                ? <td><veui-checkbox checked={!!this.selectedItems[this.keys ? this.keys[index] : index]}
                    key={this.keys[index]} onChange={checked => { this.$emit('select', checked, index) }}/></td>
                : ''
            }
            {
              this._l(this.columns, col => (
                <td>{col.renderBody.call(this._renderProxy, { item, col, index })}</td>
              ))
            }
          </tr>
        ))}
      </tbody>
    )
  }
}
