import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {
  loading?: boolean
  trueValue?: unknown
  falseValue?: unknown
  model?: unknown
  checked?: boolean
  /**
   * @deprecated
   */
  onLabel?: string
  /**
   * @deprecated
   */
  offLabel?: string
}

type Emits = {
  input(value: unknown): void
  change(checked: boolean): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  content(slotProps: { on: boolean }): unknown
}

type Switch = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Switch
