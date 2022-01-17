import { VeuiDefineInstance, Status, RouteMatches, LinkTo } from '../common'

type Props = {
  label?: string
  name?: string
  disabled?: boolean
  to?: LinkTo
  matches?: RouteMatches, // 没有 $route 这个函数也不会调用的
  native?: boolean
  removable?: boolean
  status?: Status
}

type Emits = {}

type Mixins = []

export type TabItem = Props

export type SlotProps = TabItem & { index: number, active: boolean }

export type Slots = {
  default(slotProps: SlotProps): unknown
  item(
    slotProps: SlotProps & { attrs: Record<any, unknown>, activate: () => unknown }
  ): unknown
  label(slotProps: SlotProps): unknown
}

type Tab = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tab
