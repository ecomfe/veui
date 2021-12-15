import { VeuiDefineInstance, SearchableProps, RequiredKey, SafeOmit, Normalized } from '../common/context'
import { UiMixin, InputMixin, DropdownMixin, FocusableMixin, ControllableMixin } from '../common/mixins'
import { Props as InputProps } from './input'

type Trigger = 'focus' | 'input' | 'submit'

type SHARED_PROPS = 'placeholder' | 'value' | 'selectOnFocus' | 'composition' | 'clearable'

type Item = string | {
  label: string,
  value: string,
  options?: Array<Item> | null
}

type Props<T extends Item> = Pick<InputProps, SHARED_PROPS> & {
  suggestions?: Array<T>,
  autofocus?: boolean,
  autocomplete?: boolean,
  replaceOnSelect?: boolean | string,
  suggestTrigger?: Trigger | Array<Trigger>
} & SearchableProps<Normalized<'options', T>>

type NormalizedItem = Normalized<'options', Item, true>

type Emits = {
  suggest(value: string): unknown,
  select(item: NormalizedItem): unknown,
  clear(): unknown,
  search(value: string, e: Event): unknown
}

type Mixins = [UiMixin, InputMixin, DropdownMixin, FocusableMixin, ControllableMixin<{
  input(value: string): unknown
}>]

type NormalizedGroup = RequiredKey<NormalizedItem, 'options'>
type NormalizedLeaf = SafeOmit<NormalizedItem, 'options'>

type Slots = {
  'suggestions-before'(): unknown,
  'suggestions-after'(): unknown,
  suggestions(slotProps: { suggestions: Array<NormalizedItem>, select: (suggestion: NormalizedItem) => unknown }): unknown,
  'group-label'(slotProps: { item: NormalizedGroup }): unknown,
  suggestion(slotProps: { item: NormalizedLeaf }): unknown,
  'option-label'(slotProps: { item: NormalizedLeaf }): unknown
}

type SearchBox = {
  new <T extends string | Item>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default SearchBox
