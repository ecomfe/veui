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
      'columnWidths',
      'gutterWidth'
    )
  },
  render () {
    return (
      <colgroup>
        {this.selectable ? <col class="veui-table-row-selector" /> : null}
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
