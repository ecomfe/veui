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
import Radio from './Radio'
import Checkbox from './Checkbox'
import RadioGroup from './RadioGroup'
import RadioButtonGroup from './RadioButtonGroup'
import CheckboxGroup from './CheckboxGroup'
import CheckButtonGroup from './CheckButtonGroup'
import Tooltip from './Tooltip'
import Toast from './Toast'
import Alert from './Alert'
import Tabs from './Tabs'
import Switch from './Switch'
import Searchbox from './Searchbox'
import Steps from './Steps'
import RegionPicker from './RegionPicker'
import ButtonGroup from './ButtonGroup'
import Progress from './Progress'
import Carousel from './Carousel'

export default [
  {
    path: '/alert',
    name: 'Alert',
    component: Alert
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb',
    component: Breadcrumb
  },
  {
    path: '/button',
    name: 'Button',
    component: Button
  },
  {
    path: '/button-group',
    name: 'ButtonGroup',
    component: ButtonGroup
  },
  {
    path: '/overlay',
    name: 'Overlay',
    component: Overlay
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: Carousel
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    component: Checkbox
  },
  {
    path: '/check-button-group',
    name: 'CheckButtonGroup',
    component: CheckButtonGroup
  },
  {
    path: '/checkbox-group',
    name: 'CheckboxGroup',
    component: CheckboxGroup
  },
  {
    path: '/date-picker',
    name: 'DatePicker',
    component: DatePicker
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: Dialog
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    component: Dropdown
  },
  {
    path: '/form',
    name: 'Form',
    component: Form
  },
  {
    path: '/input',
    name: 'Input',
    component: Input
  },
  {
    path: '/pager/:page?',
    name: 'Pager',
    component: Pager
  },
  {
    path: '/progress',
    name: 'Progress',
    component: Progress
  },
  {
    path: '/radio',
    name: 'Radio',
    component: Radio
  },
  {
    path: '/radio-button-group',
    name: 'RadioButtonGroup',
    component: RadioButtonGroup
  },
  {
    path: '/radio-group',
    name: 'RadioGroup',
    component: RadioGroup
  },
  {
    path: '/region-picker',
    name: 'RegionPicker',
    component: RegionPicker
  },
  {
    path: '/searchbox',
    name: 'Searchbox',
    component: Searchbox
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  },
  {
    path: '/steps',
    name: 'Steps',
    component: Steps
  },
  {
    path: '/switch',
    name: 'Switch',
    component: Switch
  },
  {
    path: '/table',
    name: 'Table',
    component: Table
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
        path: 'progress',
        component: Progress
      }
    ]
  },
  {
    path: '/toast',
    name: 'Toast',
    component: Toast
  },
  {
    path: '/tooltip',
    name: 'Tooltip',
    component: Tooltip
  },
  {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader
  }
]
