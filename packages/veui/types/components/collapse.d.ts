import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type Props = {
  label?: string
  expanded?: boolean
  togglePosition?: 'start' | 'end' | 'none'
  disabled?: boolean
  name?: string | number
}

type Emits = {
  toggle(expanded: boolean): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  title(): unknown
  titleAfter(): unknown
}

type Collapse = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Collapse
