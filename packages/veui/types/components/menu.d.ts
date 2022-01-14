import { VeuiDefineInstance } from '../common/context'
import { Matches } from './tab'
import { NavItem, Mixins, NormalizedNavItem } from './nav'

type Props<T extends NavItem> = {
    active?: string
    items?: Array<T>
    matches?: Matches
    keyField?: string
    collapsible?: boolean
    collapsed?: boolean
    expanded?: Array<string> // TODO name 自动生成
}

type Emits = {
  activate(item: NormalizedNavItem): unknown
  click(item: NormalizedNavItem): unknown
}

type Slots = {
  before(): unknown
  after(): unknown
  item(slotProps: NormalizedNavItem): unknown
  itemLabel(slotProps: NormalizedNavItem): unknown
  icon(slotProps: NormalizedNavItem): unknown
}

type Menu = {
  new <T extends NavItem = NavItem>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Menu
