import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type ExpandedType = number | string | Array<number | string>

type Props = {
  multiple?: boolean
  disabled?: boolean
  expanded?: ExpandedType
  togglePosition?: 'start' | 'end' | 'none'
}

type Emits = {
  toggle(expand: boolean, key: number, expanded: ExpandedType): unknown
}

type Slots = {
  default(): unknown
}

type Mixins = UiMixin

type Accordion = {
  new (): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Accordion
