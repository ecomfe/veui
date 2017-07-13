import Button from './Button'
import Table from './Table'
import Pager from './Pager'
import Uploader from './Uploader'
import Dialog from './Dialog'
import Overlay from './Overlay'
import Breadcrumb from './Breadcrumb'
import Input from './Input'
import Form from './Form'
import Calendar from './Calendar'
import DatePicker from './DatePicker'
import Select from './Select'
import Dropdown from './Dropdown'
import Radiobox from './Radiobox'
import Checkbox from './Checkbox'
import RadioboxGroup from './RadioboxGroup'
import CheckboxGroup from './CheckboxGroup'
import Tooltip from './Tooltip'
import Toast from './Toast'
import Alert from './Alert'
import ConfirmBox from './ConfirmBox'
import AlertBox from './AlertBox'
import SpecialDialog from './SpecialDialog'
import Tabs from './Tabs'
import Switch from './Switch'
import ButtonGroup from './ButtonGroup'

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
    path: '/form',
    name: 'Form',
    component: Form
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
    path: '/radioboxgroup',
    name: 'RadioboxGroup',
    component: RadioboxGroup
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    component: Checkbox
  },
  {
    path: '/checkboxgroup',
    name: 'CheckboxGroup',
    component: CheckboxGroup
  },
  {
    path: '/tooltip',
    name: 'Tooltip',
    component: Tooltip
  },
  {
    path: '/toast',
    name: 'Toast',
    component: Toast
  },
  {
    path: '/alert',
    name: 'Alert',
    component: Alert
  },
  {
    path: '/confirm-box',
    name: 'ConfirmBox',
    component: ConfirmBox
  },
  {
    path: '/alert-box',
    name: 'AlertBox',
    component: AlertBox
  },
  {
    path: '/special-dialog',
    name: 'SpecialDialog',
    component: SpecialDialog
  },
  {
    path: '/tabs',
    name: 'Tabs',
    component: Tabs,
    redirect: '/tabs/button',
    children: [
      {
        path: 'button',
        component: Button
      },
      {
        path: 'input',
        component: Input
      },
      {
        path: 'switch',
        component: Switch
      }
    ]
  },
  {
    path: '/switch',
    name: 'Switch',
    component: Switch
  },
  {
    path: '/buttonGroup',
    name: 'ButtonGroup',
    component: ButtonGroup
  }
]
