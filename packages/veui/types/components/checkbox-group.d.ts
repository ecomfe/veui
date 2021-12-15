import { VeuiDefineInstance, LooseObject } from '../common/context'
import { UiMixin, InputMixin, ControllableMixin } from '../common/mixins'
import { Item as RadioItem } from './radio-group'

export type Item = RadioItem & {
  exclusive?: boolean
}

type Props<T extends Item, Empty> = ({
  emptyValue?: undefined,
  value?: Array<T['value']>
} | {
  emptyValue: Empty,
  value?: Array<T['value']> | [Empty],
}) & {
  items?: Array<T>,
  keyField?: string
}

type Emits = {}

type Mixins = [UiMixin, InputMixin, ControllableMixin<{
  change(value: unknown): unknown
}>]

type Slots = {
  item(item: LooseObject<Item> & { index: number }): unknown,
  desc(item: LooseObject<Item>): unknown
}

type CheckboxGroup = {
  new <T extends Item = Item, Empty = undefined>(...args: any[]): VeuiDefineInstance<Props<T, Empty>, Emits, Slots, Mixins>
}

export default CheckboxGroup
