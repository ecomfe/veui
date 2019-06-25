import Button from './Button'
import Table from './Table'
import Pagination from './Pagination'
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
import AlertBox from './AlertBox'
import Tabs from './Tabs'
import Switch from './Switch'
import Searchbox from './Searchbox'
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
import Drawer from './Drawer'

export default [
  {
    path: '/alert',
    name: 'Alert',
    component: Alert,
    disabled: true
  },
  {
    path: '/alert-box',
    name: 'AlertBox',
    component: AlertBox,
    disabled: true
  },
  {
    path: '/autocomplete',
    name: 'Autocomplete',
    component: Autocomplete
  },
  {
    path: '/breadcrumb',
    name: 'Breadcrumb',
    component: Breadcrumb,
    disabled: true
  },
  {
    path: '/button',
    name: 'Button',
    component: Button
  },
  {
    path: '/button-group',
    name: 'ButtonGroup',
    component: ButtonGroup,
    disabled: true
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    disabled: true
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: Carousel,
    disabled: true
  },
  {
    path: '/checkbox',
    name: 'Checkbox',
    component: Checkbox
  },
  {
    path: '/check-button-group',
    name: 'CheckButtonGroup',
    component: CheckButtonGroup,
    disabled: true
  },
  {
    path: '/checkbox-group',
    name: 'CheckboxGroup',
    component: CheckboxGroup,
    disabled: true
  },
  {
    path: '/date-picker',
    name: 'DatePicker',
    component: DatePicker,
    disabled: true
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: Dialog,
    disabled: true
  },
  {
    path: '/drawer',
    name: 'Drawer',
    component: Drawer
  },
  {
    path: '/dropdown',
    name: 'Dropdown',
    component: Dropdown,
    disabled: true
  },
  {
    path: '/form',
    name: 'Form',
    component: Form,
    disabled: true
  },
  {
    path: '/grid',
    name: 'Grid',
    component: Grid,
    disabled: true
  },
  {
    path: '/icon',
    name: 'Icon',
    component: Icon,
    disabled: true
  },
  {
    path: '/input',
    name: 'Input',
    component: Input,
    disabled: true
  },
  {
    path: '/link',
    name: 'Link',
    component: Link
  },
  {
    path: '/number-input',
    name: 'NumberInput',
    component: NumberInput,
    disabled: true
  },
  {
    path: '/overlay',
    name: 'Overlay',
    component: Overlay,
    disabled: true
  },
  {
    path: '/pagination/:page?',
    name: 'Pagination',
    component: Pagination,
    disabled: true
  },
  {
    path: '/progress',
    name: 'Progress',
    component: Progress,
    disabled: true
  },
  {
    path: '/radio',
    name: 'Radio',
    component: Radio
  },
  {
    path: '/radio-button-group',
    name: 'RadioButtonGroup',
    component: RadioButtonGroup,
    disabled: true
  },
  {
    path: '/radio-group',
    name: 'RadioGroup',
    component: RadioGroup,
    disabled: true
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
    path: '/searchbox',
    name: 'Searchbox',
    component: Searchbox,
    disabled: true
  },
  {
    path: '/select',
    name: 'Select',
    component: Select,
    disabled: true
  },
  {
    path: '/slider',
    name: 'Slider',
    component: Slider,
    disabled: true
  },
  {
    path: '/steps',
    name: 'Steps',
    component: Steps,
    disabled: true
  },
  {
    path: '/switch',
    name: 'Switch',
    component: Switch,
    disabled: true
  },
  {
    path: '/table',
    name: 'Table',
    component: Table,
    disabled: true
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
    disabled: true,
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
    component: Textarea,
    disabled: true
  },
  {
    path: '/toast',
    name: 'Toast',
    component: Toast,
    disabled: true
  },
  {
    path: '/tooltip',
    name: 'Tooltip',
    component: Tooltip,
    disabled: true
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: Transfer,
    disabled: true
  },
  {
    path: '/uploader',
    name: 'Uploader',
    component: Uploader,
    disabled: true
  },
  {
    path: '/tree',
    name: 'Tree',
    component: Tree,
    disabled: true
  }
]
