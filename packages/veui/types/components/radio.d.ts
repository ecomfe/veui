import { VeuiDefineInstance } from '../common/context'
import { UiMixin, InputMixin, ActivatableMixin } from '../common/mixins'

type Props = {
  value?: unknown
  model?: unknown
  checked?: boolean
}

type Emits = {
  input(value: unknown): unknown
  change(checked: true): unknown
}

type Mixins = [UiMixin, InputMixin, ActivatableMixin]

type Slots = {
  default(): unknown
}

type Radio = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Radio
