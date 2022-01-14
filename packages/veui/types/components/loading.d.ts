import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type Props = {
  loading?: boolean
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  spinner(): unknown
}

type Loading = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Loading
