import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type Props = {
  loading?: boolean,
  trueValue?: unknown,
  falseValue?: unknown,
  model?: unknown,
  checked?: boolean,
  onLabel?: string,
  offLabel?: string
}

type Emits = {
  input(value: unknown): unknown,
  change(checked: boolean): unknown
}

type Mixins =  UiMixin

type Slots = {
  default(): unknown
  content(slotProps: { on: boolean }): unknown
}

type Switch = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Switch
