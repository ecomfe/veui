import prefix from '../../mixins/prefix'
import table from '../../mixins/table'

export default {
  name: 'veui-table-foot',
  mixins: [prefix, table],
  computed: {
    ...table.mapTableData(
      'selectable',
      'expandable',
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    return (
      <tfoot>
        <tr>
          {this.$slots.default ? (
            <th colspan={this.columnCount}>{this.$slots.default}</th>
          ) : (
            (this.selectable ? [<th />] : [])
              .concat(this.expandable ? [<th />] : [])
              .concat(
                this.columns.map(col => (
                  <th
                    class={
                      col.align ? this.$c(`table-column-${col.align}`) : null
                    }
                  >
                    {col.renderFoot()}
                  </th>
                ))
              )
          )}
        </tr>
      </tfoot>
    )
  }
}
