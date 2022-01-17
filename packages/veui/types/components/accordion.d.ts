import { VeuiDefineInstance, UiMixin } from '../common'
import { TogglePosition } from './collapse'

type ExpandedType = number | string | Array<number | string>

type Props = {
  multiple?: boolean
  disabled?: boolean
  expanded?: ExpandedType
  togglePosition?: TogglePosition
}

type Emits = {
  toggle(expand: boolean, key: number, expanded: ExpandedType): void
}

type Slots = {
  default(): unknown
}

type Mixins = UiMixin

type Accordion = {
  new (): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Accordion
