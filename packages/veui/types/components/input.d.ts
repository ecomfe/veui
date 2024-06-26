import {
  VeuiDefineComponent,
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
  autofocus?: boolean
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
  change(value: string, event: Event): void
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

type Input = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Input
