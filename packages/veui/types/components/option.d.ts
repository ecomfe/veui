import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

export type Tag = string

type Props = {
  label?: string | number
  value?: unknown
  disabled?: boolean
  hidden?: boolean
  tag?: Tag
}

type Emits = {
  click(): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  label(): unknown
}

type Option = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Option
