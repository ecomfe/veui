import { VeuiDefineInstance, UiMixin, InputMixin, ActivatableMixin, ControllableMixin } from '../common'

type Props = {
  placeholder?: string
  value?: string
  lineNumber?: boolean
  rows?: number | string
  selectOnFocus?: boolean
  composition?: boolean
  autoresize?: boolean
  resizable?: boolean
  maxlength?: number
  getLength?: (val: string) => number
  strict?: boolean
}

type Emits = {
  change(val: string, evt: Event): void
}

type Mixins = [UiMixin, InputMixin, ActivatableMixin, ControllableMixin<{
  input(val: string): void
}>]

type Slots = {}

type Textarea = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Textarea
