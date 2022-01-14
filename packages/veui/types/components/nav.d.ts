import { VeuiDefineInstance, Normalized } from '../common/context'
import { UiMixin, OverlayMixin } from '../common/mixins'
import { To } from './link'
import { Matches } from './tab'

export type NavItem = ({
  name: string
  to?: To
} | {
  name?: string
  to: To
}) & {
  label: string
  children?: Array<NavItem>
}

type Props<T extends NavItem> = {
  active?: string
  items?: Array<T>
  matches?: Matches
}

export type NormalizedNavItem = Normalized<'children', NavItem, true>

type Emits = {
  click(item: NormalizedNavItem): unknown
}

export type Mixins = [UiMixin, OverlayMixin]

// 有些 slot 好像没有暴露
type Slots = {
  more(): unknown
  // 'more-icon'(): unknown
  item(slotProps: NormalizedNavItem): unknown
  'item-label'(slotProps: NormalizedNavItem): unknown
  // 'item-icon'(slotProps: NormalizedNavItem): unknown
  // 'title-icon'(slotProps: NormalizedNavItem): unknown
}

type Nav = {
  new <T extends NavItem = NavItem>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Nav
