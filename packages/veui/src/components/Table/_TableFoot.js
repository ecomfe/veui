import prefix from '../../mixins/prefix'
import table, { mapTableData } from '../../mixins/table'
import '../../common/uiTypes'

export default {
  name: 'veui-table-foot',
  mixins: [prefix, table],
  uiTypes: ['transparent'],
  computed: {
    ...mapTableData(
      'selectable',
      'expandable',
      'scrollableX',
      'selectColumnWidth',
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    return (
      <tfoot>
        <tr>
          {this.$slots.default ? (
            <th
              colspan={this.columnCount}
              class={{
                [this.$c('table-cell-hero')]: true
              }}
            >
              <div
                class={this.$c('table-cell')}
                style={{
                  width: this.table.width ? `${this.table.width}px` : null
                }}
              >
                {this.$slots.default}
              </div>
            </th>
          ) : (
            (this.selectable
              ? [
                <th
                  class={{
                    [this.$c('table-cell-select')]: true,
                    [this.$c('table-cell-sticky-left')]: this.scrollableX
                  }}
                  style={
                    this.scrollableX
                      ? {
                        position: 'sticky',
                        left: 0
                      }
                      : null
                  }
                />
              ]
              : []
            )
              .concat(
                this.expandable
                  ? [
                    <th
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
                  ]
                  : []
              )
              .concat(
                this.columns.map(col => (
                  <th
                    class={{
                      [this.$c(`table-cell-${col.align}`)]: !!col.align,
                      [this.$c(`table-cell-sticky-${col.fixed}`)]:
                        this.scrollableX && col.fixed
                    }}
                    style={
                      this.scrollableX && col.fixed
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
          {this.table.gutterWidth ? (
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
            />
          ) : null}
        </tr>
      </tfoot>
    )
  }
}
