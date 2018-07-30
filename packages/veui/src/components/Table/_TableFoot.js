import table from '../../mixins/table'

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
          {
            this.$slots.default
              ? <th colspan={this.columns.length + (this.table.selectable ? 1 : 0)}>{this.$slots.default}</th>
              : (this.table.selectable ? [<th></th>] : []).concat(
                this.columns.map(col => (
                  <th class={col.align ? `veui-table-column-${col.align}` : null}>{col.renderFoot()}</th>
                ))
              )
          }
        </tr>
      </tfoot>
    )
  }
}
