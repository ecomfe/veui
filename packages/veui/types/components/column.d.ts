import { VeuiDefineInstance, LooseObject } from '../common'
import { Slots as SelectSlots } from './select'

export type AllowedOrders = Array<false | 'desc' | 'asc'>

type Props = {
  title?: string
  field?: string
  width?: string | number
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  span?: (index: number, rowData: unknown) => { row?: number; col?: number }
  fixed?: boolean | 'left' | 'right'
  allowedOrders?: AllowedOrders
  desc?: string
  filterValue?: {}
  filterTitle?: string
  filterOptions?: Array<unknown>
  filterMultiple?: boolean
  tooltip?: boolean | ((item: unknown, field: string) => unknown)
}

type Emits = {
  filterchange(val: unknown): void
}

type Mixins = {}

type Slots = {
  default(): unknown
  head(): unknown
  foot(): unknown
  desc(scope: { close: () => unknown }): unknown
  filter: SelectSlots['before']
  subRow(scope: LooseObject<{ item: unknown; index: number }>): unknown
}

type Column = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Column
