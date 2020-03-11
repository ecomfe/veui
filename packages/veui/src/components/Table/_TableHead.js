import Checkbox from '../Checkbox'
import Sorter from './_Sorter'
import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'
import i18n from '../../mixins/i18n'
import '../../common/uiTypes'

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
      'headerRows',
      'scrollableX',
      'selectColumnWidth',
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    let depth = this.headerRows.length
    return (
      <thead>
        {this.headerRows.map((row, i) => (
          <tr>
            {this.selectable && i === 0 ? (
              <th
                scope="col"
                role="columnheader"
                rowspan={depth}
                class={{
                  [this.$c('table-cell-select')]: true,
                  [this.$c('table-cell-sticky-left')]: this.scrollableX
                }}
                style={
                  this.scrollableX
                    ? {
                      left: 0
                    }
                    : null
                }
              >
                {i === 0 ? (
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
                            this.checked
                              ? '@table.unselectAll'
                              : '@table.selectAll'
                          )}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </th>
            ) : null}
            {this.expandable ? (
              <th
                scope="col"
                role="columnheader"
                class={{
                  [this.$c('table-cell-expand')]: true,
                  [this.$c('table-cell-sticky-left')]: this.scrollableX
                }}
                style={
                  this.scrollableX
                    ? {
                      left: this.selectable
                        ? `${this.selectColumnWidth}px`
                        : 0
                    }
                    : null
                }
              />
            ) : null}
            {row.map(col => (
              <th
                class={{
                  [this.$c(`table-cell-center`)]:
                    i !== depth && col.columns.length > 0 && !col.align,
                  [this.$c(`table-cell-${col.align}`)]:
                    !!col.align || i === depth,
                  [this.$c('table-cell-interactive')]:
                    !!col.sortable && i === depth,
                  [this.$c(`table-cell-sticky-${col.fixed}`)]:
                    this.scrollableX && col.fixed
                }}
                style={
                  this.scrollableX
                    ? {
                      [col.fixed]: col.offset
                    }
                    : null
                }
                scope="col"
                role="columnheader"
                aria-sort={
                  this.table.orderBy === col.field && this.table.order
                    ? `${this.table.order}ending`
                    : null
                }
                colspan={col.colspan > 1 ? col.colspan : null}
                rowspan={col.rowspan > 1 ? col.rowspan : null}
              >
                <div class={this.$c('table-cell')}>
                  <div class={this.$c('table-cell-content')}>
                    {col.renderHead()}{' '}
                  </div>
                  {col.sortable && col.columns.length === 0 ? (
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
            {i === 0 && this.table.gutterWidth ? (
              <th
                class={{
                  [this.$c('table-gutter')]: true,
                  [this.$c('table-cell-sticky-right')]: this.table.hasFixedRight
                }}
                style={
                  this.table.hasFixedRight
                    ? {
                      right: 0
                    }
                    : null
                }
                aria-hidden="true"
                rowspan={depth > 1 ? depth : null}
              />
            ) : null}
          </tr>
        ))}
      </thead>
    )
  }
}
