import {
  VeuiDefineInstance,
  Normalized,
  SearchableProps,
  UiMixin,
  InputMixin,
  OverlayMixin,
  DropdownMixin,
  InputTrim
} from '../common'

type Item =
  | string
  | {
      label?: string
      value: string
      children?: Array<Item> | null
    }

type Props<T extends Item> = {
  datasource?: Array<T>
  value?: string
  suggestTrigger?: 'input' | 'focus' | Array<'input' | 'focus'>
  autofocus?: boolean
  placeholder?: string
  selectOnFocus?: boolean
  composition?: boolean
  clearable?: boolean
  maxlength?: number | string
  getLength?: (str: string) => number
  strict?: boolean
  trim?: InputTrim
} & SearchableProps<Normalized<'children', T>>

type Emits = {
  input(value: string): void
  select(value: string): void
  toggle(expanded: boolean): void
  clear(): void
}

type ObjectItem = {
  label?: string
  value: string
  children?: Array<ObjectItem> | null
}

// 没法用泛型啊
type NormalizedItem = Normalized<'children', ObjectItem, true>

type Mixins = [UiMixin, InputMixin, OverlayMixin, DropdownMixin]

type Slots = {
  suggestions(slotProps: {
    datasource: Array<NormalizedItem>
    keyword: string
  }): unknown
  optionLabel(slotProps: {
    label: string
    value: string
    matches: { text: string; matched: boolean }
  }): unknown
}

type Autocomplete = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}

export default Autocomplete
