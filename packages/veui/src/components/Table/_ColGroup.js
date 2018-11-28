import table from '../../mixins/table'

export default {
  name: 'veui-table-col-group',
  mixins: [table],
  props: {
    gutter: Boolean
  },
  computed: {
    ...table.mapTableData(
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
        {this.selectable ? <col class="veui-table-col-select" /> : null}
        {this.expandable ? <col class="veui-table-col-expand" /> : null}
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
            class="veui-table-header-gutter"
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
