import { table } from '../../mixins'

export default {
  name: 'veui-table-foot',
  mixins: [table],
  computed: {
    ...table.mapTableData(
      { realColumns: 'columns' },
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
            this.columns.map(col => (
              <th class={col.align ? `veui-table-column-${col.align}` : ''}>{col.renderFoot()}</th>
            ))
          }
        </tr>
      </tfoot>
    )
  }
}
