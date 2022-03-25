import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  InputMixin,
  ActivatableMixin,
  ControllableMixin
} from '../common'

type Props = {
  value?: number
  step?: number
  decimalPlace?: number
  max?: number
  min?: number
  placeholder?: string
  selectOnFocus?: boolean
  format?: (val: number, defaultFormattedValue: string) => string
  parse?: (val: string) => number
}

type Emits = {
  change(val: number, evt: Event): void
}

type Mixins = [
  UiMixin,
  InputMixin,
  ActivatableMixin,
  ControllableMixin<{
    input(val: number): void
  }>
]

type Slots = {
  before(): unknown
  after(): unknown
}

type NumberInput = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default NumberInput
