import { VeuiDefineInstance } from '../common/context'
import { UiMixin, ActivatableMixin, InputMixin, ControllableMixin } from '../common/mixins'

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
  trim?: boolean
}

type Emits = {
  input(value: string): unknown
  clear(): unknown
  autofill(): unknown
}

type Mixins = [UiMixin, ActivatableMixin, InputMixin, ControllableMixin<{
  input(value: string): unknown
}>]

type Slots = {
  before(): unknown
  placeholder(): unknown
  after(): unknown
}

type Input = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Input
