import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  InputMixin,
  ActivatableMixin
} from '../common'

type Props = {
  value?: unknown
  model?: unknown
  checked?: boolean
}

type Emits = {
  input(value: unknown): void
  change(checked: true): void
}

type Mixins = [UiMixin, InputMixin, ActivatableMixin]

type Slots = {
  default(): unknown
}

type Radio = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Radio
