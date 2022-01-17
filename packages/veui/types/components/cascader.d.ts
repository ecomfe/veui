import {
  VeuiDefineInstance,
  SearchableProps,
  Normalized,
  RequiredKey,
  SafeOmit,
  UiMixin,
  ControllableMixin,
  InputMixin,
  DropdownMixin,
  TreeMixinWithIndeterminate
} from '../common'
import { MultipleAndValue } from './select'
import { Item } from './option-group'
import { CheckedState } from './tree'

type Props<T extends Item> = MultipleAndValue<T> & {
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
  options?: Array<T>
  expanded?: boolean
  columnTrigger?: 'hover' | 'click'
  selectMode?: 'leaf-only' | 'any'
  columnWidth?: number | string
  showSelectAll?: boolean
  valueDisplay?: 'complete' | 'simple'
  inline?: boolean
  max?: number
  keyField?: string
} & SearchableProps<Normalized<'options', T, false, CheckedState>>

type Emits = {
  afteropen(): void
  afterclose(): void
  input(keyword: string): void
}

type Mixins = [
  UiMixin,
  InputMixin,
  DropdownMixin,
  TreeMixinWithIndeterminate,
  ControllableMixin<{
    select(value: unknown): void
  }>
]

type LooseOptionItem = Normalized<'options', Item, true, CheckedState>
type LooseOptionParent = RequiredKey<LooseOptionItem, 'options'>
type LooseOptionLeaf = SafeOmit<LooseOptionItem, 'options'>

type SlotProps = {
  selected: LooseOptionItem
  value: unknown
  options: Array<LooseOptionItem>
  filteredOptions: Array<LooseOptionItem>
  expanded: boolean
  placeholder: string
  keyword?: string
  remove: (option: LooseOptionItem) => unknown
  clear: () => unknown
  toggle: (force?: boolean) => unknown
  select: (option: LooseOptionItem) => unknown
  updateKeyword: (keyword: string) => unknown
}

type Slots = {
  trigger(slotProps: SlotProps): unknown
  before(): unknown
  after(): unknown
  pane(slotProps: SlotProps): unknown
  'column-before'(slotProps: { parent: LooseOptionParent }): unknown
  'column-after'(slotProps: { parent: LooseOptionParent }): unknown
  label(slotProps: { selected: SlotProps['value'] } | LooseOptionItem): unknown
  'option-label'(slotProps: LooseOptionLeaf): unknown
  option(slotProps: LooseOptionLeaf): unknown
  selected(
    slotProps: { selected: SlotProps['value'] } | LooseOptionItem
  ): unknown
}

type Cascader = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}

export default Cascader
