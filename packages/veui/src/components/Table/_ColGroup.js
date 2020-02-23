import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'

export default {
  name: 'veui-table-col-group',
  mixins: [prefix, table],
  props: {
    gutter: Boolean
  },
  computed: {
    ...mapTableData(
      { realColumns: 'columns' },
      'selectable',
      'expandable',
      'columnWidths',
      'gutterWidth'
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
        {this.gutter ? (
          <col
            class={this.$c('table-header-gutter')}
            aria-hidden="true"
            style={{
              width: this.gutterWidth ? `${this.gutterWidth}px` : null,
              display: this.gutterWidth ? null : 'none'
            }}
          />
        ) : null}
      </colgroup>
    )
  }
}
