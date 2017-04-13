import Button from './Button'
import Table from './Table'
import Pager from './Pager'
import Uploader from './Uploader'

export default [
  {
    path: '/button',
    name: 'Button',
    component: Button
  },
  {
    path: '/table',
    name: 'Table',
    component: Table
  },
  {
    path: '/pager/:pageNo',
    name: 'Pager',
    params: {
      pageNo: 0
    },
    component: Pager
  },
  {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader
  }
]
