import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type Props = {}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type InputGroup = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default InputGroup
