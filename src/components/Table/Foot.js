import { table } from '../../mixins'

export default {
  mixins: [table],
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
          {
            this._l(this.columns, col => (
              <th>{col.renderFoot.call(this._renderProxy, { col })}</th>
            ))
          }
        </tr>
      </thead>
    )
  }
}
