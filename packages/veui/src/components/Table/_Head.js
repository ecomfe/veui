import Checkbox from '../Checkbox'
import Button from '../Button'
import Sorter from './_Sorter'
import { table } from '../../mixins'

export default {
  name: 'veui-table-head',
  components: {
    'veui-checkbox': Checkbox,
    'veui-button': Button,
    'veui-table-sorter': Sorter
  },
  mixins: [table],
  computed: {
    ...table.mapTableData(
      'data',
      'selectable',
      'selectStatus',
      { realColumns: 'columns' }
    )
  },
  render () {
    return (
      <thead>
        <tr>
          {
            this.selectable
              ? <th><div class="veui-table-cell"><veui-checkbox checked={this.selectStatus === 'all'}
                disabled={!this.data.length}
                indeterminate={this.selectStatus === 'partial'}
                onChange={checked => { this.table.select(checked) }}/></div></th>
              : ''
          }
          {
            this._l(this.columns, col => (
              <th class={col.align ? `veui-table-column-${col.align}` : ''}>
                <div class="veui-table-cell">{col.renderHead.call(this._renderProxy, { col })}</div>
                {
                  col.sortable
                    ? <veui-table-sorter
                        order={this.table.orderBy === col.field ? this.table.order : false}
                        onSort={order => { this.$emit('sort', col.field, order) }}>
                      </veui-table-sorter>
                    : ''
                }
              </th>
            ))
          }
        </tr>
      </thead>
    )
  }
}
