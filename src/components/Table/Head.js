import Checkbox from '../Checkbox'
import mixin from './mixin'

export default {
  components: {
    'veui-checkbox': Checkbox
  },
  mixins: [mixin],
  props: {
    columns: Array,
    selectable: Boolean,
    selectStatus: String
  },
  render () {
    return (
      <thead>
        <tr>
          {this.selectable
            ? <th><veui-checkbox checked={this.selectStatus === 'all'}
              indeterminate={this.selectStatus === 'partial'}
              onChange={checked => { this.$emit('select', checked) }}/></th>
            : ''}
          {this._l(this.columns, col => (
            <th>{col.renderHead.call(this._renderProxy, { col })}</th>
          ))}
        </tr>
      </thead>
    )
  }
}
