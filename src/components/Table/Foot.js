import { table } from '../../mixins'

export default {
  name: 'veui-table-foot',
  mixins: [table],
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
              <th class={col.align ? `veui-table-column-${col.align}` : ''}>{col.renderFoot.call(this._renderProxy, { col })}</th>
            ))
          }
        </tr>
      </tfoot>
    )
  }
}
