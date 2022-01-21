import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'
import { AllowedOrders } from './column'

type Props<
  T extends Record<any, unknown>,
  KeyField extends string | undefined = undefined
> = (
  | {
      selectMode: 'single'
      selected?: KeyField extends keyof T ? T[KeyField] : unknown
    }
  | {
      selectMode?: 'multiple'
      selected?: KeyField extends keyof T ? Array<T[KeyField]> : Array<unknown>
    }
) & {
  data?: Array<T>
  scroll?: number | string | { x?: number | string; y?: number | string }
  keyField?: KeyField
  selectable?: boolean
  expandable?: boolean
  bordered?: boolean
  expanded?: KeyField extends keyof T ? Array<T[KeyField]> : Array<unknown>
  order?: boolean | string
  orderBy?: string
  allowedOrders?: AllowedOrders
  columnFilter?: Array<string>
  loading?: boolean
}

type Emits = {
  sort(field: string, order: AllowedOrders[number]): void
  select(
    selected: Array<unknown>,
    item: Record<any, any>,
    selectedItems: Array<Record<any, any>>
  ): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  noData(): unknown
  foot(): unknown
}

type Table = VeuiDefineComponent<{
  new <
    T extends Record<any, unknown> = {},
    KeyField extends string | undefined = undefined
  >(
    ...args: any[]
  ): VeuiDefineInstance<Props<T, KeyField>, Emits, Slots, Mixins>
}>

export default Table
