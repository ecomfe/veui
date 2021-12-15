import { VeuiDefineInstance, LooseItem, BaseItem, Normalized, SearchableProps } from '../common/context'
import { UiMixin, InputMixin, OverlayMixin, DropdownMixin } from '../common/mixins'

type Item = string | {
  label?: string,
  value: string,
  children?: Array<Item> | null
}

type Props<T extends Item> = {
  datasource?: Array<T>,
  value?: string,
  suggestTrigger?: string | Array<string>,
  autofocus?: boolean,
  placeholder?: string,
  selectOnFocus?: boolean,
  composition?: boolean,
  clearable?: boolean,
  maxlength?: number | string,
  getLength?: (str: string) => number,
  strict?: boolean,
  trim?: boolean
} & SearchableProps<Normalized<'children', T>>

type Emits = {
  input(value?: string): unknown,
  select(value: string): unknown,
  toggle(expanded: boolean): unknown,
  clear(): unknown
}

type ObjectItem = {
  label?: string,
  value: string,
  children?: Array<ObjectItem> | null
}

// 没法用泛型啊
type NormalizedItem = Normalized<'children', ObjectItem, true>

type Mixins = [UiMixin, InputMixin, OverlayMixin, DropdownMixin]

type Slots = {
  suggestions(slotProps: { datasource: Array<NormalizedItem>, keyword: string }): unknown,
  optionLabel(slotProps: { label: string, value: string, matches: { text: string, matched: boolean } }): unknown
}

type Autocomplete = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Autocomplete
