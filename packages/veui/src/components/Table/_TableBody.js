import Row from './_TableRow'
import table from '../../mixins/table'
import i18n from '../../mixins/i18n'
import { flatMap } from 'lodash'

export default {
  name: 'veui-table-body',
  mixins: [table, i18n],
  computed: {
    ...table.mapTableData(
      'data',
      'selectable',
      'expandable',
      'keyField',
      { realKeys: 'keys' },
      { localExpanded: 'expanded' },
      { realColumns: 'columns' },
      { viewColumnCount: 'columnCount' }
    )
  },
  render () {
    let subRow = this.table.$scopedSlots['sub-row']

    return (
      <tbody>
        {
          this.data.length
            ? flatMap(this.data, (item, index) => {
              let key = this.keyField
                ? item[this.keyField]
                : this.keys[index]
              let expanded = this.expanded.indexOf(key) !== -1
              let rows = [<Row index={index} expanded={expanded}/>]

              if (this.expandable && expanded) {
                if (subRow) {
                  rows.push(<Row>{subRow({ ...item, index })}</Row>)
                } else {
                  rows = rows.concat((item.children || []).map(item => {
                    return (
                      <Row item={item} index={index}/>
                    )
                  }))
                }
              }

              return rows
            })
            : <tr>
              <td
                class="veui-table-no-data"
                colspan={this.columnCount}
                role="cell">
                <div class="veui-table-cell">{this.$slots['no-data'] || this.t('@table.noData')}</div>
              </td>
            </tr>
        }
      </tbody>
    )
  }
}
