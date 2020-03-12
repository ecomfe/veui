import prefix from '../../mixins/prefix'
import table from '../../mixins/table'

export default {
  name: 'veui-table-col-group',
  mixins: [prefix, table],
  props: {
    gutter: Boolean
  },
  render () {
    let { table } = this
    return (
      <colgroup>
        {table.selectable ? <col class={this.$c('table-col-select')} /> : null}
        {table.expandable ? <col class={this.$c('table-col-expand')} /> : null}
        {table.realColumns.map((col, i) => (
          <col
            style={{
              width: table.columnWidths[i]
            }}
            key={col.field}
          />
        ))}
        {this.gutter ? (
          <col
            class={this.$c('table-header-gutter')}
            aria-hidden="true"
            style={{
              width: table.gutterWidth ? `${table.gutterWidth}px` : null,
              display: table.gutterWidth ? null : 'none'
            }}
          />
        ) : null}
      </colgroup>
    )
  }
}
