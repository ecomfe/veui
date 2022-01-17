import {
  VeuiDefineInstance,
  RequiredKey,
  SafeOmit,
  Normalized,
  UiMixin,
  ControllableMixin,
  OverlayMixin
} from '../common'
import { Tag } from './option'

export type Item<Position extends boolean = true> = {
  label: string
  value: unknown
  options?: Array<Item> | null
  disabled?: boolean
} & (Position extends true ? { position?: 'inline' | 'popup' } : {})

type Props<T extends Item> = {
  label?: string
  trigger?: 'hover' | 'click'
  options?: Array<T>
  disabled?: boolean
  expanded?: boolean
  keyField?: string
  position?: 'inline' | 'popup'
  optionTag?: string | ((option: T) => Tag)
}

type Emits = {
  afteropen(): void
}

type Mixins = [
  UiMixin,
  OverlayMixin,
  ControllableMixin<{
    toggle(expanded: boolean): void
  }>
]

export type LooseOptionItem<Position extends boolean = true> = Normalized<
  'options',
  Item<Position>,
  true
>
export type LooseOptionParent<Position extends boolean = true> = RequiredKey<
  Normalized<'options', Item<Position>, true>,
  'options'
>
export type LooseOptionLeaf<Position extends boolean = true> = SafeOmit<
  LooseOptionParent<Position>,
  'options'
>

type Slots = {
  label(slotProps: { label: string }): unknown
  option(slotProps: LooseOptionLeaf<true>): unknown
  'option-label'(slotProps: LooseOptionLeaf<true>): unknown
  'group-label'(slotProps: LooseOptionParent<true>): unknown
  before(): unknown
  after(): unknown
  default(): unknown
}

type OptionGroup = {
  new <T extends Item = Item>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}

export default OptionGroup
