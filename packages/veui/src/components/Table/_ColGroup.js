import ui from '../../mixins/ui'
import table from '../../mixins/table'

export default {
  name: 'veui-table-col-group',
  uiTypes: ['transparent'],
  mixins: [ui, table],
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
              width: table.scrollbarWidth ? `${table.scrollbarWidth}px` : null,
              display: table.scrollbarWidth ? null : 'none'
            }}
          />
        ) : null}
      </colgroup>
    )
  }
}
