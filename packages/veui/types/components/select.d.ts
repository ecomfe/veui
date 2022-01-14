import { VeuiDefineInstance, SearchableProps, Normalized } from '../common/context'
import { UiMixin, InputMixin, DropdownMixin,ControllableMixin } from '../common/mixins'
import { Item, LooseOptionLeaf, LooseOptionParent } from './option-group'

export { Item }
export type MultipleAndValue<T extends Item> = ({
  multiple: true
  value?: Array<T['value']>
} | {
  multiple?: false
  value?: T['value']
})

type Props<T extends Item> = MultipleAndValue<T> & {
  options?: Array<T>
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
  max?: number
} & SearchableProps<T>

type Emits = {
  clear(): unknown
  input(val: string): unknown
  afteropen(): unknown
}

type Mixins = [UiMixin, InputMixin, DropdownMixin, ControllableMixin<{
  change(value: unknown): unknown
}>]

type SlotProps = {
  expanded: Array<unknown>
  value: unknown
  toggle: (force?: boolean) => unknown
  select: (val: unknown) => unknown
  close: () => unknown
}

type SelectState = {
  selected: boolean
}

export type Slots = {
  default(): unknown
  before(slotProps: SlotProps): unknown
  after(slotProps: SlotProps): unknown
  'no-data'(slotProps: { keyword?: string }): unknown
  label(slotProps: { selected: SlotProps['value'] } | Normalized<'options', Item, true>): unknown
  selected(slotProps: { selected: SlotProps['value'] } | Normalized<'options', Item, true>): unknown
  'group-label'(slotProps: LooseOptionParent & SelectState): unknown
  option(slotProps: LooseOptionLeaf & SelectState): unknown
  'option-label'(slotProps: LooseOptionLeaf & SelectState): unknown
  trigger(slotProps: SlotProps & { handlers: Record<any, unknown>, attrs: Record<any, unknown> }): unknown
}

type Select = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Select
