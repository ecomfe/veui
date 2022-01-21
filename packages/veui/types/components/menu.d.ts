import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  RouteMatches
} from '../common'
import { NavItem, Mixins, NormalizedNavItem } from './nav'

type Props<T extends NavItem> = {
  active?: string
  items?: Array<T>
  matches?: RouteMatches
  keyField?: string
  collapsible?: boolean
  collapsed?: boolean
  expanded?: Array<string>
}

type Emits = {
  activate(item: NormalizedNavItem): void
  click(item: NormalizedNavItem): void
}

type Slots = {
  before(): unknown
  after(): unknown
  item(slotProps: NormalizedNavItem): unknown
  itemLabel(slotProps: NormalizedNavItem): unknown
  icon(slotProps: NormalizedNavItem): unknown
}

type Menu = VeuiDefineComponent<{
  new <T extends NavItem = NavItem>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default Menu
