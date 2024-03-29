import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {
  name?: string
  label?: string
  tip?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  tip(): unknown
  label(): unknown
}

type Fieldset = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Fieldset
