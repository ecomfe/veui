import i18n from '../../managers/i18n'

i18n.register(
  'zh-Hans',
  {
    infoLabel: '分页导航，当前为第 {page} 页，共 {pageCount} 页',
    pageSize: '{size} 条/页',
    pageSizeLabel: '选择每页显示条数',
    total: '共 {total} 条',
    prev: '上一页',
    next: '下一页',
    pageLabel: '前往第 {page} 页',
    current: '第 {page} 页，当前页',
    gotoPage: '去第 {page} 页',
    go: '确定',
    previousPages: '向前 {count} 页',
    nextPages: '向后 {count} 页'
  },
  {
    ns: 'pagination'
  }
)
