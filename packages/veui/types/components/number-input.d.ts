import { VeuiDefineInstance } from '../common/context'
import { UiMixin, InputMixin, ActivatableMixin, ControllableMixin } from '../common/mixins'

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
  change(val: number, evt: Event): unknown
}

type Mixins = [UiMixin, InputMixin, ActivatableMixin, ControllableMixin<{
  input(val: number): unknown
}>]

type Slots = {
  default(): unknown
}

type NumberInput = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default NumberInput
