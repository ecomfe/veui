import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  LooseObject,
  UiMixin,
  FocusableMixin
} from '../common'

type Item = {
  label?: string // 覆盖 item slot 可以不传 label
  value?: unknown
  disabled?: boolean
}

type Props<T extends Item> = {
  items?: Array<T>
  // keyField?: string
  disabled?: boolean
}

type Emits = {
  click(item: LooseObject<Item>, index: number, e: MouseEvent): void
}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
  item(item: LooseObject<Item>): unknown
}

type ButtonGroup = VeuiDefineComponent<{
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default ButtonGroup
