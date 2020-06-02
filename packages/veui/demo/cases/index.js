import Button from './Button'
import Table from './Table'
import Pagination from './Pagination'
import Uploader from './Uploader'
import Dialog from './Dialog'
import Overlay from './Overlay'
import Breadcrumb from './Breadcrumb'
import Input from './Input'
import InputGroup from './InputGroup'
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
import AlertBox from './AlertBox'
import Tabs from './Tabs'
import Switch from './Switch'
import SearchBox from './SearchBox'
import Steps from './Steps'
import RegionPicker from './RegionPicker'
import ButtonGroup from './ButtonGroup'
import Progress from './Progress'
import Carousel from './Carousel'
import Transfer from './Transfer'
import Schedule from './Schedule'
import Textarea from './Textarea'
import Icon from './Icon'
import Slider from './Slider'
import NumberInput from './NumberInput'
import Grid from './Grid'
import Link from './Link'
import Tree from './Tree'
import Autocomplete from './Autocomplete'
import Tag from './Tag'
import Loading from './Loading'
import Drawer from './Drawer'
import Collapse from './Collapse'
import Popover from './Popover'
import Badge from './Badge'
import TimePicker from './TimePicker'
import Embedded from './Embedded'
import Anchor from './Anchor'
import Menu from './Menu'
import Colors from './Colors'
import Nav from './Nav'

export default [
  {
    path: '/color-palette',
    name: 'Colors',
    component: Colors
  },
  {
    path: '/alert',
    name: 'Alert',
    component: Alert
  },
  {
    path: '/alert-box',
    name: 'AlertBox',
    component: AlertBox
  },
  {
    path: '/anchor',
    hash: '#milk-coffee',
    name: 'Anchor',
    component: Anchor
  },
  {
    path: '/autocomplete',
    name: 'Autocomplete',
    component: Autocomplete
  },
  {
    path: '/badge',
    name: 'Badge',
    component: Badge
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
    path: '/collapse',
    name: 'Collapse',
    component: Collapse
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
    path: '/drawer',
    name: 'Drawer',
    component: Drawer
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    component: Dropdown
  },
  {
    path: '/embedded',
    name: 'Embedded',
    component: Embedded
  },
  {
    path: '/form',
    name: 'Form',
    component: Form
  },
  {
    path: '/grid',
    name: 'Grid',
    component: Grid
  },
  {
    path: '/icon',
    name: 'Icon',
    component: Icon
  },
  {
    path: '/input',
    name: 'Input',
    component: Input
  },
  {
    path: '/input-group',
    name: 'InputGroup',
    component: InputGroup
  },
  {
    path: '/link',
    name: 'Link',
    component: Link
  },
  {
    path: '/loading',
    name: 'Loading',
    component: Loading
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu,
    children: [
      {
        path: 'input',
        component: Input
      },
      {
        path: 'progress',
        component: Progress
      },
      {
        path: 'switch',
        component: Switch
      },
      {
        path: 'link',
        component: Link
      },
      {
        path: 'loading',
        component: Loading
      },
      {
        path: 'button',
        component: Button
      },
      {
        path: 'number-input',
        component: NumberInput
      },
      {
        path: 'radio',
        component: Radio
      },
      {
        path: 'schedule',
        component: Schedule
      }
    ]
  },
  {
    path: '/nav',
    name: 'Nav',
    component: Nav,
    children: [
      {
        path: 'input',
        component: Input
      },
      {
        path: 'progress',
        component: Progress
      },
      {
        path: 'switch',
        component: Switch
      },
      {
        path: 'link',
        component: Link
      },
      {
        path: 'loading',
        component: Loading
      },
      {
        path: 'button',
        component: Button
      },
      {
        path: 'number-input',
        component: NumberInput
      },
      {
        path: 'radio',
        component: Radio
      },
      {
        path: 'schedule',
        component: Schedule
      }
    ]
  },
  {
    path: '/number-input',
    name: 'NumberInput',
    component: NumberInput
  },
  {
    path: '/overlay',
    name: 'Overlay',
    component: Overlay
  },
  {
    path: '/pagination/:page?',
    name: 'Pagination',
    component: Pagination
  },
  {
    path: '/popover',
    name: 'Popover',
    component: Popover
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
    component: RegionPicker,
    disabled: true
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: Schedule,
    disabled: true
  },
  {
    path: '/search-box',
    name: 'SearchBox',
    component: SearchBox
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  },
  {
    path: '/slider',
    name: 'Slider',
    component: Slider
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
    path: '/tag',
    name: 'Tag',
    component: Tag
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
      },
      {
        path: 'switch',
        component: Switch
      }
    ]
  },
  {
    path: '/textarea',
    name: 'Textarea',
    component: Textarea
  },
  {
    path: '/time-picker',
    name: 'TimePicker',
    component: TimePicker
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
    path: '/transfer',
    name: 'Transfer',
    component: Transfer
  },
  {
    path: '/tree',
    name: 'Tree',
    component: Tree
  },
  {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader
  }
]
