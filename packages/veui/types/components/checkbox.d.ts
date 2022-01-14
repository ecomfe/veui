import { VeuiDefineInstance } from '../common/context'
import { UiMixin, InputMixin, FocusableMixin } from '../common/mixins'

type Props = {
  value: unknown
  trueValue?: unknown
  falseValue?: unknown
  model?: unknown
  checked?: boolean
  indeterminate?: boolean
}

type Emits = {
  input(value: unknown): unknown
  change(checked: boolean): unknown
}

type Mixins = [UiMixin, InputMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Checkbox = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Checkbox
