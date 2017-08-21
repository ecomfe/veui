import Row from './_TableRow'
import { table } from '../../mixins'

export default {
  name: 'veui-table-body',
  components: {
    'veui-table-row': Row
  },
  mixins: [table],
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
        {this.data.length
          ? this.data.map((item, index) => (
            <veui-table-row index={ index }></veui-table-row>
          )) : <tr>
          <td class="veui-table-no-data" colspan={(this.selectable ? 1 : 0) + this.columns.length}>
            <div class="veui-table-cell">{this.$slots['no-data'] || '没有数据'}</div>
          </td>
        </tr>}
      </tbody>
    )
  }
}
