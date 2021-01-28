import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import '../../common/uiTypes'

export default {
  name: 'veui-table-foot',
  mixins: [prefix, table],
  uiTypes: ['transparent'],
  render () {
    let { table } = this
    return (
      <tfoot>
        <tr>
          {this.$slots.default ? (
            <th
              role="cell"
              colspan={table.viewColumnCount}
              class={{
                [this.$c('table-cell-hero')]: true
              }}
            >
              <div
                class={this.$c('table-cell')}
                style={{
                  width: table.width ? `${table.width}px` : null
                }}
              >
                {this.$slots.default}
              </div>
            </th>
          ) : (
            (table.selectable
              ? [
                <th
                  role="cell"
                  class={{
                    [this.$c('table-cell-select')]: true,
                    [this.$c('table-cell-sticky-left')]: table.needFixLeft
                  }}
                  style={
                    table.needFixLeft
                      ? {
                        left: 0
                      }
                      : null
                  }
                />
              ]
              : []
            )
              .concat(
                table.expandable
                  ? [
                    <th
                      class={{
                        [this.$c('table-cell-expand')]: true,
                        [this.$c('table-cell-sticky-left')]: table.needFixLeft
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
                  ]
                  : []
              )
              .concat(
                table.realColumns.map(col => (
                  <th
                    class={{
                      [this.$c(`table-cell-${col.align}`)]: !!col.align,
                      [this.$c(`table-cell-sticky-${col.fixed}`)]:
                        table.scrollableX && col.fixed
                    }}
                    style={
                      table.scrollableX && col.fixed
                        ? {
                          [col.fixed]: col.offset
                        }
                        : null
                    }
                    role="cell"
                  >
                    <div class={this.$c('table-cell')}>{col.renderFoot()}</div>
                  </th>
                ))
              )
          )}
          {table.gutterWidth ? (
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
            />
          ) : null}
        </tr>
      </tfoot>
    )
  }
}
