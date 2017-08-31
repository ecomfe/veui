import Checkbox from '../Checkbox'
import Button from '../Button'
import Sorter from './_TableSorter'
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
      'selectMode',
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
              ? <th><div class="veui-table-cell">
                {
                  this.selectMode === 'multiple'
                    ? <veui-checkbox checked={this.selectStatus !== 'none'}
                        disabled={!this.data.length}
                        indeterminate={this.selectStatus === 'partial'}
                        onChange={checked => { this.table.select(checked) }}/>
                    : null
                }</div></th>
              : null
          }
          {
            this.columns.map(col => (
              <th class={col.align ? `veui-table-column-${col.align}` : null}>
                <div class="veui-table-cell">{col.renderHead.call(this._renderProxy, { col })}</div>
                {
                  col.sortable
                    ? <veui-table-sorter
                        order={this.table.orderBy === col.field ? this.table.order : false}
                        onSort={order => { this.$emit('sort', col.field, order) }}>
                      </veui-table-sorter>
                    : null
                }
              </th>
            ))
          }
        </tr>
      </thead>
    )
  }
}
