import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  ActivatableMixin,
  InputMixin,
  ControllableMixin
} from '../common'

export type Props = {
  value?: Array<string>
  inputValue?: string
  placeholder?: string
  selectOnFocus?: boolean
  composition?: boolean
  clearable?: boolean
  maxlength?: number
  max?: number
  getLength?: (value: string) => number
  strict?: boolean
}

type Emits = {
  input(value: string): void
  clear(): void
  change(value: string): void
}

type Mixins = [
  UiMixin,
  ActivatableMixin,
  InputMixin,
  ControllableMixin<{
    input(inputValue: string): void
    change(value: Array<string>): void
  }>
]

type Slots = {
  placeholder(): unknown
}

type Input = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Input
