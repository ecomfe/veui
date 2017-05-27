import Button from './Button'
import Table from './Table'
import Pager from './Pager'
import Uploader from './Uploader'
import Dialog from './Dialog'
import Overlay from './Overlay'
import Breadcrumb from './Breadcrumb'
import Input from './Input'
import Calendar from './Calendar'
import DatePicker from './DatePicker'
import Select from './Select'
import Dropdown from './Dropdown'
import Radiobox from './Radiobox'
import Checkbox from './Checkbox'
import BoxGroup from './BoxGroup'
import Alert from './Alert'
import Toast from './Toast'

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
    path: '/pager/:page?',
    name: 'Pager',
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
    path: '/datepicker',
    name: 'DatePicker',
    component: DatePicker
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    component: Dropdown
  },
  {
    path: '/radiobox',
    name: 'Radiobox',
    component: Radiobox
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    component: Checkbox
  },
  {
    path: '/boxGroup',
    name: 'BoxGroup',
    component: BoxGroup
  },
  {
    path: '/alert',
    name: 'Alert',
    component: Alert
  },
  {
    path: '/toast',
    name: 'Toast',
    component: Toast
  }
]
