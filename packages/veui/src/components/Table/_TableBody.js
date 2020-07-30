import Row from './_TableRow'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'
import { flatMap } from 'lodash'
import '../../common/uiTypes'

export default {
  name: 'veui-table-body',
  uiTypes: ['transparent'],
  mixins: [prefix, table, i18n],
  render () {
    let { table } = this
    let subRow = table.$scopedSlots['sub-row']

    return (
      <tbody>
        {table.data.length ? (
          flatMap(table.data, (item, index) => {
            let key = table.keyField
              ? item[table.keyField]
              : table.realKeys[index]
            let expanded = table.realExpanded.indexOf(key) !== -1
            let rows = [<Row index={index} expanded={expanded} />]

            if (table.expandable && expanded) {
              if (subRow) {
                rows.push(<Row>{subRow({ ...item, index })}</Row>)
              } else {
                rows = rows.concat(
                  (item.children || []).map(item => {
                    return <Row item={item} index={index} />
                  })
                )
              }
            }

            return rows
          })
        ) : (
          <tr>
            <td
              class={{
                [this.$c('table-no-data')]: true,
                [this.$c('table-cell-hero')]: true,
                [this.$c('table-cell-first')]: true
              }}
              colspan={table.viewColumnCount}
              role="cell"
            >
              <div
                class={this.$c('table-cell')}
                style={{
                  width: table.width
                    ? `${table.width - (table.realBordered ? 1 : 0)}px`
                    : null
                }}
              >
                {this.$slots['no-data'] || this.t('@table.noData')}
              </div>
            </td>
          </tr>
        )}
      </tbody>
    )
  }
}
