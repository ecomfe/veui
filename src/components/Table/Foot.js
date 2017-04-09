import mixin from './mixin'

export default {
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
          {this.table.selectable ? <th></th> : ''}
          {this._l(this.columns, col => (
            <th>{col.renderFoot.call(this._renderProxy, { col })}</th>
          ))}
        </tr>
      </thead>
    )
  }
}
