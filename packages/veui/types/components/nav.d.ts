import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  Normalized,
  RouteMatches,
  LinkTo,
  UiMixin,
  OverlayMixin
} from '../common'

export type NavItem = (
  | {
      name: string
      to?: LinkTo
    }
  | {
      name?: string
      to: LinkTo
    }
) & {
  label: string
  children?: Array<NavItem>
}

type Props<T extends NavItem> = {
  active?: string
  items?: Array<T>
  matches?: RouteMatches
}

export type NormalizedNavItem = Normalized<'children', NavItem, true>

type Emits = {
  click(item: NormalizedNavItem): void
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

type Nav = VeuiDefineComponent<{
  new <T extends NavItem = NavItem>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default Nav
