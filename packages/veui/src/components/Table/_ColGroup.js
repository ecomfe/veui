import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'

export default {
  name: 'veui-table-col-group',
  mixins: [prefix, table],
  computed: {
    ...mapTableData(
      { realColumns: 'columns' },
      'selectable',
      'expandable',
      'columnWidths'
    )
  },
  render () {
    return (
      <colgroup>
        {this.selectable ? <col class={this.$c('table-col-select')} /> : null}
        {this.expandable ? <col class={this.$c('table-col-expand')} /> : null}
        {this.columns.map((col, i) => (
          <col
            style={{
              width: this.columnWidths[i]
            }}
            key={col.field}
          />
        ))}
      </colgroup>
    )
  }
}
