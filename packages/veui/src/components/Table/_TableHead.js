import Checkbox from '../Checkbox'
import Sorter from './_Sorter'
import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'
import i18n from '../../mixins/i18n'

export default {
  name: 'veui-table-head',
  mixins: [prefix, table, i18n],
  uiTypes: ['transparent'],
  computed: {
    ...mapTableData(
      'data',
      'icons',
      'selectable',
      'selectMode',
      'selectStatus',
      'expandable',
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    return (
      <thead>
        <tr>
          {this.selectable ? (
            <th
              scope="col"
              role="columnheader"
              class={this.$c('table-cell-select')}
            >
              <div class={this.$c('table-cell')}>
                <div class={this.$c('table-cell-content')}>
                  {this.selectMode === 'multiple' ? (
                    <Checkbox
                      checked={this.selectStatus !== 'none'}
                      disabled={!this.data.length}
                      indeterminate={this.selectStatus === 'partial'}
                      onChange={checked => {
                        this.table.select(checked)
                      }}
                      aria-label={this.t(
                        this.checked ? '@table.unselectAll' : '@table.selectAll'
                      )}
                    />
                  ) : null}
                </div>
              </div>
            </th>
          ) : null}
          {this.expandable ? <th class={this.$c('table-cell-expand')} /> : null}
          {this.columns.map(col => (
            <th
              class={{
                [this.$c(`table-cell-${col.align}`)]: !!col.align,
                [this.$c('table-cell-interactive')]: !!col.sortable
              }}
              scope="col"
              role="columnheader"
              aria-sort={
                this.table.orderBy === col.field && this.table.order
                  ? `${this.table.order}ending`
                  : false
              }
            >
              <div class={this.$c('table-cell')}>
                <div class={this.$c('table-cell-content')}>
                  {col.renderHead()}{' '}
                </div>
                {col.sortable ? (
                  <Sorter
                    class={{
                      [this.$c('table-header-icon')]: true,
                      [this.$c('table-header-icon-active')]:
                        this.table.orderBy === col.field &&
                        this.table.order !== false
                    }}
                    order={
                      this.table.orderBy === col.field
                        ? this.table.order
                        : false
                    }
                    onSort={order => {
                      this.$emit('sort', col.field, order)
                    }}
                  />
                ) : null}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    )
  }
}
