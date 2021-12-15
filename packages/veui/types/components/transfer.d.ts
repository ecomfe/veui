import { VeuiDefineInstance } from '../common/context'
import { UiMixin, InputMixin, TreeMixin, ControllableMixin } from '../common/mixins'
import { TreeItem, SlotProps as TreeSlotProps, LooseTreeItem } from './tree'

type Item = {
  label: string,
  value: unknown, // slot 中丢失
  hidden?: boolean,
  disabled?: boolean,
  children?: Array<Item> | null
}

type Props<T extends Item> = {
  datasource?: Array<T>,
  searchable?: boolean,
  filter?: (type: 'candidate', keyword: string, item: T) => boolean,
  selected?: Array<T['value']>,
  candidatePlaceholder?: string,
  selectedPlaceholder?: string,
  candidateTitle?: string,
  selectedTitle?: string,
  selectedShowMode?: 'tree' | 'flat',
  keys?: string | ((item: T) => string)
}

type Emits = {}

type Mixins = [UiMixin, InputMixin, TreeMixin, ControllableMixin<{
  select(value: Array<unknown>): unknown
}>]

type SlotProps = { count: number }

type Slots = {
  'candidate-head'(slotScope: SlotProps): unknown,
  'candidate-title'(slotScope: SlotProps): unknown,
  'candidate-no-data'(): unknown,
  'candidate-item'(slotScope: TreeSlotProps): unknown,
  'candidate-item-label'(slotScope: TreeSlotProps & { keyword: string }): unknown,
  'selected-head'(slotScope: SlotProps): unknown,
  'selected-title'(slotScope: SlotProps): unknown,
  'selected-no-data'(): unknown,
  'selected-item'(slotScope: TreeSlotProps): unknown,
  'selected-item-label'(slotScope: TreeSlotProps & { keyword: string }): unknown,
  candidate(slotScope: { datasource: LooseTreeItem }): unknown,
  selected(slotScope: { datasource: LooseTreeItem }): unknown
}

type Transfer = {
  new <T extends TreeItem = TreeItem>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Transfer
