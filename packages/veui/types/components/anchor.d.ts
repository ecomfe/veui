import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  LooseObject,
  UiMixin
} from '../common'

type Item = {
  label: string
  value: unknown // 覆盖 slot 就不知道了？
  children?: Array<Item> | null
}

type Props<T extends Item> = {
  items?: Array<T>
  sticky?: boolean
  container?: string | HTMLElement | Window
  targetOffset?: string | number
  stickyOffset?: string | number
  keyField?: string
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  item(slotProps: { item: LooseObject<Item> }): unknown
  itemLabel(slotProps: { item: LooseObject<Item> }): unknown
}

type Anchor = VeuiDefineComponent<{
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default Anchor
