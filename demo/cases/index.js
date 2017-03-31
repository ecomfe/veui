import Button from './Button'
import Table from './Table'
import Pager from './Pager'
import Dialog from './Dialog'
import Layer from './Layer'

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
    path: '/dialog',
    name: 'Dialog',
    component: Dialog
  },
  {
    path: '/layer',
    name: 'Layer',
    component: Layer
  }
]
