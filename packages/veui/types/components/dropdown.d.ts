import {
  VeuiDefineInstance,
  Normalized,
  SearchableProps,
  UiMixin,
  DropdownMixin,
  FocusableMixin
} from '../common'
import { Item, LooseOptionLeaf, LooseOptionParent } from './option-group'

type Props<T extends Item> = {
  label?: string
  disabled?: boolean
  options?: Array<T>
  trigger?: 'click' | 'hover'
  split?: boolean
  searchable?: boolean
  placeholder?: string
} & SearchableProps<Normalized<'options', T>>

type Emits = {
  click(value?: unknown): void
}

type Mixins = [UiMixin, DropdownMixin, FocusableMixin]

type TriggerSlots = {
  attrs: Record<any, unknown>
  handlers: Record<any, Function>
  expanded: boolean
  toggle: (force: boolean) => unknown
}

type Slots = {
  trigger(slotProps: TriggerSlots): unknown
  label(slotProps: { label: string }): unknown
  'no-data'(slotProps: { keyword: string }): unknown
  default(slotProps: { close: () => unknown }): unknown
  option(slotProps: LooseOptionLeaf): unknown
  'option-label'(slotProps: LooseOptionLeaf): unknown
  'group-label'(slotProps: LooseOptionParent): unknown
}

type Dropdown = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}

export default Dropdown
