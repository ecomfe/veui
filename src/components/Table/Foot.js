import { table } from '../../mixins'

export default {
  name: 'veui-table-foot',
  mixins: [table],
  props: {
    columns: Array,
    selectable: Boolean,
    selectStatus: String
  },
  computed: {
    ...table.mapTableData(
      { displayedColumns: 'columns' },
      'selectable',
      'selectStatus'
    )
  },
  render () {
    return (
      <tfoot>
        <tr>
          {this.table.selectable ? <th></th> : ''}
          {
            this._l(this.columns, col => (
              <th>{col.renderFoot.call(this._renderProxy, { col })}</th>
            ))
          }
        </tr>
      </tfoot>
    )
  }
}
