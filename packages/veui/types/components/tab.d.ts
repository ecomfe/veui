import { VeuiDefineInstance } from '../common/context'
import { To } from './link'
import { Route } from 'vue-router'

type STATUS_LIST = 'success' | 'warning' | 'info' | 'error'

export type Matches = (route: Route, to: Route) => boolean

type Props = {
  label?: string,
  name?: string,
  disabled?: boolean,
  to?: To,
  matches?: Matches, // 没有 $route 这个函数也不会调用的
  native?: boolean,
  removable?: boolean,
  status?: STATUS_LIST
}

type Emits = {}

type Mixins = []

export type TabItem = Props

export type SlotProps = TabItem & { index: number, active: boolean }

export type Slots = {
  default(slotProps: SlotProps): unknown,
  item(
    slotProps: SlotProps & { attrs: Record<any, unknown>, activate: () => unknown }
  ): unknown,
  label(slotProps: SlotProps): unknown
}

type Tab = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tab
