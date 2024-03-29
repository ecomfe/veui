import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

export type TogglePosition = 'start' | 'end' | 'none'

type Props = {
  label?: string
  expanded?: boolean
  togglePosition?: TogglePosition
  disabled?: boolean
  name?: string | number
}

type Emits = {
  toggle(expanded: boolean): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  title(): unknown
  'title-after'(): unknown
}

type Collapse = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Collapse
