import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  InputMixin,
  FocusableMixin
} from '../common'

type Props = {
  value: unknown
  trueValue?: unknown
  falseValue?: unknown
  model?: unknown
  checked?: boolean
  indeterminate?: boolean
}

type Emits = {
  input(value: unknown): void
  change(checked: boolean): void
}

type Mixins = [UiMixin, InputMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Checkbox = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Checkbox
