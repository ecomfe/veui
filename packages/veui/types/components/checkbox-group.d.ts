import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  LooseObject,
  UiMixin,
  InputMixin,
  ControllableMixin
} from '../common'

export type Item = {
  label?: string // 覆盖 slot 可以不写 label？
  value: unknown
  disabled?: boolean
  desc?: string
  exclusive?: boolean
}

type Props<T extends Item, Empty> = (
  | {
      emptyValue?: undefined
      value?: Array<T['value']>
    }
  | {
      emptyValue: Empty
      value?: Array<T['value']> | [Empty]
    }
) & {
  items?: Array<T>
  keyField?: string
}

type Emits = {}

type Mixins = [
  UiMixin,
  InputMixin,
  ControllableMixin<{
    change(value: unknown): void
  }>
]

type Slots = {
  item(item: LooseObject<Item> & { index: number }): unknown
  desc(item: LooseObject<Item>): unknown
}

type CheckboxGroup = VeuiDefineComponent<{
  new <T extends Item = Item, Empty = undefined>(
    ...args: any[]
  ): VeuiDefineInstance<Props<T, Empty>, Emits, Slots, Mixins>
}>

export default CheckboxGroup
