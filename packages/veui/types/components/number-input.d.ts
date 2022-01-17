import { VeuiDefineInstance, UiMixin, InputMixin, ActivatableMixin, ControllableMixin } from '../common'

type Props = {
  value?: number
  step?: number
  decimalPlace?: number
  max?: number
  min?: number
  format?: (val: number, defaultFormattedValue: string) => string
  parse?: (val: string) => number
}

type Emits = {
  change(val: number, evt: Event): void
}

type Mixins = [UiMixin, InputMixin, ActivatableMixin, ControllableMixin<{
  input(val: number): void
}>]

type Slots = {
  default(): unknown
}

type NumberInput = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default NumberInput
