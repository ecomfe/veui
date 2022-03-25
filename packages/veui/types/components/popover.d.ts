import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayMixin,
  OverlayTarget,
  OverlayPosition
} from '../common'

type Props = {
  target: OverlayTarget
  title?: string
  open?: boolean
  foot?: boolean
  position?: OverlayPosition
  trigger?: string
  hideDelay?: number
  okLabel?: string
  cancelLabel?: string
}

type Emits = {
  ok(): void
  cancel(): void
}

type Mixins = [UiMixin, OverlayMixin]

type Slots = {
  default(): unknown
  title(): unknown
  foot(): unknown
}

type Popover = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Popover
