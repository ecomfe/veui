import {
  VeuiDefineInstance,
  LooseObject,
  Normalized,
  SearchableProps,
  RequiredKey,
  UiMixin,
  ControllableMixin,
  TreeMixinWithIndeterminate
} from '../common'

type BaseItem = {
  label: string
  value?: unknown
  hidden?: boolean
  disabled?: boolean
}

export type TreeItem = BaseItem & {
  children?: Array<TreeItem> | null
  name?: string
}

export type CheckedState = {
  checked: boolean
  partialChecked: boolean
}

type Props<
  T extends TreeItem,
  NameOrValue = T extends { name: unknown }
    ? T['name'] | T['value']
    : T['value']
> = (
  | {
      checkable: true
      datasource?: T extends { value: unknown } ? Array<T> : never
    }
  | {
      checkable?: false
      datasource?: Array<T>
    }
) & {
  checked?: Array<T['value']>
  expanded?: Array<NameOrValue>
  selectable?: boolean
  selected?: NameOrValue
} & SearchableProps<Normalized<'children', T, false, CheckedState>>

export type LooseTreeItem = LooseObject<
  {
    children?: Array<LooseTreeItem> | null
    name: string
  } & BaseItem &
    CheckedState
>

export type LooseTreeParent = RequiredKey<LooseTreeItem>

type Emits = {
  click(
    item: LooseTreeItem,
    parents: Array<LooseTreeParent> | null | undefined,
    index: number,
    depth: number
  ): void
  collapse(item: LooseTreeParent, index: number, depth: number): void
  expand(item: LooseTreeParent, index: number, depth: number): void
}

type Mixins = [
  UiMixin,
  TreeMixinWithIndeterminate,
  ControllableMixin<{
    check(checked: Array<unknown>): void
  }>
]

export type SlotProps = {
  item: LooseTreeItem
  index: number
  depth: number
  expanded: boolean
  parents: Array<LooseTreeParent> | null | undefined
} & LooseTreeItem

type Slots = {
  item(slotProps: SlotProps): unknown
  'item-before'(slotProps: SlotProps): unknown
  'item-label'(slotProps: SlotProps): unknown
  'item-after'(slotProps: SlotProps): unknown
}

type Tree = {
  new <T extends TreeItem = TreeItem>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}

export default Tree
