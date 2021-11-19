import i18n from '../../managers/i18n'

i18n.register(
  'en-US',
  {
    infoLabel: 'Pagination navigation, page {page} of {pageCount}',
    pageSize: '{size} / page',
    pageSizeLabel: 'Select items per page',
    total: '{total} in total',
    prev: 'Previous page',
    next: 'Next page',
    pageLabel: 'Go to page {page}',
    current: 'Page {page}, current page',
    gotoPage: 'Page {page}',
    go: 'Go',
    previousPages: 'Previous {count} pages',
    nextPages: 'Next {count} pages'
  },
  {
    ns: 'pagination'
  }
)
