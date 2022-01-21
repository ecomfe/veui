import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  LooseObject,
  UiMixin,
  InputMixin,
  ControllableMixin
} from '../common'

type Item = {
  label?: string // 覆盖 slot 可以不写 label？
  value: unknown
  disabled?: boolean
  desc?: string
}

type Props<T extends Item> = {
  items?: Array<T>
  value?: T['value']
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

type RadioGroup = VeuiDefineComponent<{
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default RadioGroup
