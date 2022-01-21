import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  OverlayMixin
} from '../common'

type Props = {}

type Emits = {}

type Mixins = OverlayMixin

type SlotProps = {
  close(): void
}

type Slots = {
  default(slotProps: SlotProps): unknown
}

type ToastList = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default ToastList
