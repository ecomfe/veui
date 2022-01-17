import { VeuiDefineInstance, LooseObject, UiMixin } from '../common'

type Props<T extends Record<any, unknown>> = (
  | {
      filter: (keyword: string, item: T) => boolean
      datasource?: Array<T>
    }
  | {
      filter?: undefined
      datasource?: T extends { label: string } ? Array<T> : never
    }
) & {
  title?: string
  searchable?: boolean
  searchOnInput?: boolean
  disabled?: boolean
  placeholder?: string
}

type Emits = {}

type Mixins = UiMixin

type SlotProps = {
  items: Array<LooseObject<{ hidden?: boolean; label?: string }>>
  keyword: string
}

type Slots = {
  head(slotProps: SlotProps): unknown
  default(slotProps: SlotProps): unknown
  noData(slotProps: SlotProps): unknown
}

type FilterPanel = {
  new <T extends Record<any, unknown> = { label: string }>(
    ...args: any[]
  ): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default FilterPanel
