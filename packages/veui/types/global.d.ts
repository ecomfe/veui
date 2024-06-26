import * as Components from './components'

interface VeuiComponents {
  VeuiAccordion: Components.Accordion
  VeuiAlertBox: Components.AlertBox
  VeuiAnchor: Components.Anchor
  VeuiAutocomplete: Components.Autocomplete
  VeuiBadge: Components.Badge
  VeuiBreadcrumb: Components.Breadcrumb
  VeuiBreadcrumbItem: Components.BreadcrumbItem
  VeuiButton: Components.Button
  VeuiButtonGroup: Components.ButtonGroup
  VeuiCalendar: Components.Calendar
  VeuiCarousel: Components.Carousel
  VeuiCascader: Components.Cascader
  VeuiCheckbox: Components.Checkbox
  VeuiCheckboxGroup: Components.CheckboxGroup
  VeuiCheckButtonGroup: Components.CheckButtonGroup
  VeuiCollapse: Components.Collapse
  VeuiColumn: Components.Column
  VeuiConfigProvider: Components.ConfigProvider
  VeuiConfirmBox: Components.ConfirmBox
  VeuiContent: Components.Content
  VeuiDatePicker: Components.DatePicker
  VeuiDialog: Components.Dialog
  VeuiDrawer: Components.Drawer
  VeuiDropdown: Components.Dropdown
  VeuiEmpty: Components.Empty
  VeuiField: Components.Field
  VeuiFieldset: Components.Fieldset
  VeuiFilterPanel: Components.FilterPanel
  VeuiFooter: Components.Footer
  VeuiForm: Components.Form
  VeuiGridColumn: Components.GridColumn
  VeuiGridContainer: Components.GridContainer
  VeuiGridRow: Components.GridRow
  VeuiHeader: Components.Header
  VeuiIcon: Components.Icon
  VeuiInput: Components.Input
  VeuiInputGroup: Components.InputGroup
  VeuiLabel: Components.Label
  VeuiLayout: Components.Layout
  VeuiLightbox: Components.Lightbox
  VeuiLink: Components.Link
  VeuiLoading: Components.Loading
  VeuiLoadingBar: Components.LoadingBar
  VeuiMessage: Components.Message
  VeuiNav: Components.Nav
  VeuiNumberInput: Components.NumberInput
  VeuiOption: Components.Option
  VeuiOptionGroup: Components.OptionGroup
  VeuiOverlay: Components.Overlay
  VeuiPagination: Components.Pagination
  VeuiPopover: Components.Popover
  VeuiProgress: Components.Progress
  VeuiPromptBox: Components.PromptBox
  VeuiRadio: Components.Radio
  VeuiRadioButtonGroup: Components.RadioButtonGroup
  VeuiRadioGroup: Components.RadioGroup
  VeuiRating: Components.Rating
  VeuiSearchBox: Components.SearchBox
  VeuiSelect: Components.Select
  VeuiSidebar: Components.Sidebar
  VeuiSidenav: Components.Sidenav
  VeuiSlider: Components.Slider
  VeuiSpan: Components.Span
  VeuiStack: Components.Stack
  VeuiSteps: Components.Steps
  VeuiSwitch: Components.Switch
  VeuiTab: Components.Tab
  VeuiTable: Components.Table
  VeuiTabs: Components.Tabs
  VeuiTag: Components.Tag
  VeuiTagInput: Components.TagInput
  VeuiTextarea: Components.Textarea
  VeuiTimePicker: Components.TimePicker
  VeuiToast: Components.Toast
  VeuiToastList: Components.ToastList
  VeuiTooltip: Components.Tooltip
  VeuiTransfer: Components.Transfer
  VeuiTree: Components.Tree
  VeuiUploader: Components.Uploader

  /** @deprecated */
  VeuiMenu: Components.Menu
}

// Vue 3 & Vue < 2.7
declare module '@vue/runtime-core' {
  export interface GlobalComponents extends VeuiComponents {}
}

// Vue 2.7
declare module 'vue' {
  export interface GlobalComponents extends VeuiComponents {}
}
