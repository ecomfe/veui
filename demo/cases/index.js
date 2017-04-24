import Button from './Button'
import Table from './Table'
import Pager from './Pager'
import Uploader from './Uploader'
import Dialog from './Dialog'
import Overlay from './Overlay'
import Breadcrumb from './Breadcrumb'
import Input from './Input'
import Calendar from './Calendar'
import Select from './Select'

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
      pageNo: 1
    },
    component: Pager
  },
  {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: Dialog
  },
  {
    path: '/overlay',
    name: 'Overlay',
    component: Overlay
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb',
    component: Breadcrumb
  },
  {
    path: '/input',
    name: 'Input',
    component: Input
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  }
]
