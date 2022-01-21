import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

export type Tag = string

type Props = {
  label?: string | number
  value?: unknown
  disabled?: boolean
  hidden?: boolean
  tag?: Tag
}

type Emits = {
  click(): void
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  label(): unknown
}

type Option = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Option
