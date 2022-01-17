import {
  VeuiDefineInstance,
  UiMixin,
  ActivatableMixin,
  InputMixin,
  ControllableMixin,
  InputTrim
} from '../common'

type InputType = 'text' | 'password' | 'hidden'

export type Props = {
  type?: InputType
  value?: string | number
  placeholder?: string
  selectOnFocus?: boolean
  composition?: boolean
  clearable?: boolean
  maxlength?: number
  getLength?: (value: string) => number
  strict?: boolean
  trim?: InputTrim
}

type Emits = {
  input(value: string): void
  clear(): void
  autofill(): void
}

type Mixins = [
  UiMixin,
  ActivatableMixin,
  InputMixin,
  ControllableMixin<{
    input(value: string): void
  }>
]

type Slots = {
  before(): unknown
  placeholder(): unknown
  after(): unknown
}

type Input = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Input
