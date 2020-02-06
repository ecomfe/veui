import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'

export default {
  name: 'veui-table-foot',
  mixins: [prefix, table],
  uiTypes: ['transparent'],
  computed: {
    ...mapTableData(
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
                      col.align ? this.$c(`table-cell-${col.align}`) : null
                    }
                  >
                    <div class={this.$c('table-cell')}>{col.renderFoot()}</div>
                  </th>
                ))
              )
          )}
        </tr>
      </tfoot>
    )
  }
}
