import Row from './_TableRow'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'

export default {
  name: 'veui-table-body',
  components: {
    'veui-table-row': Row
  },
  mixins: [table, i18n],
  computed: {
    ...table.mapTableData(
      'data',
      'selectable',
      { realColumns: 'columns' }
    )
  },
  render () {
    return (
      <tbody>
        {
          this.data.length
            ? this.data.map((_, index) => <veui-table-row index={index}/>)
            : <tr>
              <td
                class="veui-table-no-data"
                colspan={(this.selectable ? 1 : 0) + this.columns.length}
                role="cell">
                <div class="veui-table-cell">{this.$slots['no-data'] || this.t('@table.noData')}</div>
              </td>
            </tr>
        }
      </tbody>
    )
  }
}
