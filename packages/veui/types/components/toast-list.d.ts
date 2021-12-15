import { VeuiDefineInstance } from '../common/context'
import { OverlayMixin } from '../common/mixins'

type Props = {}

type Emits = {}

type Mixins = OverlayMixin

type SlotProps = {
  close(): void
}

type Slots = {
  default(slotProps: SlotProps): unknown
}

type ToastList = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default ToastList
