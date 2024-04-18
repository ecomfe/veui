import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  Normalized,
  SearchableProps,
  UiMixin,
  InputMixin,
  OverlayMixin,
  DropdownMixin
} from '../common'
import { Props as InputProps } from './input'

type SHARED_PROPS =
  | 'placeholder'
  | 'selectOnFocus'
  | 'composition'
  | 'autofocus'
  | 'clearable'
  | 'maxlength'
  | 'getLength'
  | 'trim'

type Item =
  | string
  | {
      label?: string
      value: string
      children?: Array<Item> | null
    }

type Props<T extends Item> = Pick<InputProps, SHARED_PROPS> & {
  datasource?: Array<T>
  value?: string
  /** @deprecated */
  suggestTrigger?: 'input' | 'focus' | Array<'input' | 'focus'>
  suggestOnFocus?: boolean
  strict?: boolean
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
  'option-label'(slotProps: {
    label: string
    value: string
    matches: { text: string; matched: boolean }
  }): unknown
  'no-data'(slotProps: { keyword: string }): unknown
}

type Autocomplete = VeuiDefineComponent<{
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default Autocomplete
