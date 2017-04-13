import Checkbox from '../Checkbox'
import Button from '../Button'
import Sorter from './Sorter'
import mixin from './mixin'

export default {
  components: {
    'veui-checkbox': Checkbox,
    'veui-button': Button,
    'veui-table-sorter': Sorter
  },
  mixins: [mixin],
  props: {
    columns: Array,
    selectable: Boolean,
    selectStatus: String
  },
  render () {
    return (
      <thead>
        <tr>
          {
            this.selectable
              ? <th><veui-checkbox checked={this.selectStatus === 'all'}
                indeterminate={this.selectStatus === 'partial'}
                onChange={checked => { this.$emit('select', checked) }}/></th>
              : ''
          }
          {
            this._l(this.columns, col => (
              <th>
                <span class="veui-table-header">{col.renderHead.call(this._renderProxy, { col })}</span>
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
