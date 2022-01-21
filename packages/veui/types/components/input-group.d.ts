import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type InputGroup = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default InputGroup
