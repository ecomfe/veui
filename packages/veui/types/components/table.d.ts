import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  LooseObject
} from '../common'
import { AllowedOrders } from './column'

type Props<
  T extends Record<any, unknown>,
  Field extends string | undefined = undefined
> = (
  | {
      selectMode: 'single'
      selected?: Field extends keyof T ? T[Field] : unknown
    }
  | {
      selectMode?: 'multiple'
      selected?: Field extends keyof T ? Array<T[Field]> : Array<unknown>
    }
) & {
  data?: Array<T>
  scroll?: number | string | { x?: number | string; y?: number | string }
  keyField?: Field
  selectable?: boolean
  expandable?: boolean
  bordered?: boolean
  expanded?: Field extends keyof T ? Array<T[Field]> : Array<unknown>
  order?: boolean | string
  orderBy?: string
  allowedOrders?: AllowedOrders
  columnFilter?: Array<Field> | ((field: Field) => boolean)
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
  'no-data'(): unknown
  'sub-row'(scope: LooseObject<{ item: unknown; index: number }>): unknown
  foot(): unknown
}

type Table = VeuiDefineComponent<{
  new <
    T extends Record<any, unknown> = {},
    Field extends string | undefined = undefined
  >(
    ...args: any[]
  ): VeuiDefineInstance<Props<T, Field>, Emits, Slots, Mixins>
}>

export default Table
