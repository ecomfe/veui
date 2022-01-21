import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {
  loading?: boolean
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  spinner(): unknown
}

type Loading = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Loading
