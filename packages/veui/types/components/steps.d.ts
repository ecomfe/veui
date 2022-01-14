import { VeuiDefineInstance, LooseObject } from '../common/context'
import { UiMixin } from '../common/mixins'
import { Props as LinkProps } from './link'

type Item = {
  to: LinkProps['to']
  status?: string
  label?: string
  desc?: string
}

type Props<T extends Item> = {
  steps: Array<T>
  current: number
}

type Emits = {
  click(index: number, e: MouseEvent): unknown
}

type Mixins = UiMixin

type SlotScope = LooseObject<Item> & { index: number }

type Slots = {
  default(slotProps: SlotScope): unknown
  index(slotProps: SlotScope): unknown
  label(slotProps: SlotScope): unknown
  desc(slotProps: SlotScope): unknown
}

type Steps = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Steps
