import Checkbox from '../Checkbox'
import HeadCell from './_HeadCell'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'

export default {
  name: 'veui-table-head',
  mixins: [prefix, table, i18n],
  uiTypes: ['transparent'],
  data () {
    return {
      descOpen: {},
      sortHover: {},
      filterOpen: {},
      filterValues: {}
    }
  },
  render () {
    let { table } = this
    let depth = table.headerRows.length

    return (
      <thead>
        {table.headerRows.map((row, i) => (
          <tr>
            {table.selectable && i === 0 ? (
              <th
                scope="col"
                role="columnheader"
                rowspan={depth}
                class={{
                  [this.$c('table-cell-select')]: true,
                  [this.$c('table-cell-sticky-left')]: table.needFixLeft,
                  [this.$c('table-cell-sticky-edge')]:
                    table.needFixLeft &&
                    !table.hasFixedLeft &&
                    !table.expandable
                }}
                style={
                  table.scrollableX
                    ? {
                      left: 0
                    }
                    : null
                }
              >
                <div class={this.$c('table-cell')}>
                  {table.selectMode === 'multiple' ? (
                    <Checkbox
                      checked={table.selectStatus !== 'none'}
                      disabled={!table.enabledData.length}
                      indeterminate={table.selectStatus === 'partial'}
                      onChange={(checked) => {
                        table.select(checked)
                      }}
                      aria-label={this.t(
                        table.selectStatus !== 'none'
                          ? '@table.unselectAll'
                          : '@table.selectAll'
                      )}
                    />
                  ) : null}
                </div>
              </th>
            ) : null}
            {table.expandable ? (
              <th
                scope="col"
                role="columnheader"
                class={{
                  [this.$c('table-cell-expand')]: true,
                  [this.$c('table-cell-sticky-left')]: table.needFixLeft,
                  [this.$c('table-cell-sticky-edge')]:
                    table.needFixLeft && !table.hasFixedLeft
                }}
                style={
                  table.needFixLeft
                    ? {
                      left: table.selectable
                        ? `${table.selectColumnWidth}px`
                        : 0
                    }
                    : null
                }
              />
            ) : null}
            {row.map((col) => (
              <HeadCell
                col={col}
                onSort={(order) => this.$emit('sort', col.field, order)}
              />
            ))}
            {i === 0 && table.scrollbarWidth ? (
              <th
                class={{
                  [this.$c('table-gutter')]: true,
                  [this.$c('table-cell-sticky-right')]: table.hasFixedRight
                }}
                style={
                  table.hasFixedRight
                    ? {
                      right: 0
                    }
                    : null
                }
                aria-hidden="true"
                role="columnheader"
                rowspan={depth > 1 ? depth : null}
              />
            ) : null}
          </tr>
        ))}
      </thead>
    )
  }
}
