import Checkbox from '../Checkbox'
import Button from '../Button'
import Sorter from '../Sorter'
import table from '../../mixins/table'

export default {
  name: 'veui-table-head',
  components: {
    'veui-checkbox': Checkbox,
    'veui-button': Button,
    'veui-sorter': Sorter
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
              ? <th scope="col" role="columnheader"><div class="veui-table-cell">
                {
                  this.selectMode === 'multiple'
                    ? <veui-checkbox checked={this.selectStatus !== 'none'}
                      disabled={!this.data.length}
                      indeterminate={this.selectStatus === 'partial'}
                      onChange={checked => { this.table.select(checked) }}
                      aria-label={this.checked ? '全部移除' : '全部添加'}/>
                    : null
                }</div></th>
              : null
          }
          {
            this.columns.map(col => (
              <th
                class={col.align ? `veui-table-column-${col.align}` : null}
                scope="col"
                role="columnheader"
                aria-sort={
                  this.table.orderBy === col.field && this.table.order
                    ? `${this.table.order}ending`
                    : false
                }>
                <div class="veui-table-cell">{col.renderHead()}</div>
                {
                  col.sortable
                    ? <veui-sorter
                      order={this.table.orderBy === col.field ? this.table.order : false}
                      onSort={order => { this.$emit('sort', col.field, order) }}>
                    </veui-sorter>
                    : null
                }
              </th>
            ))
          }
        </tr>
      </thead>
    )
  },
  methods: {
    getAriaSort (order) {
      if (!order) {
        return null
      }
      return order === 'asc' ? 'ascending' : 'descending'
    }
  }
}
