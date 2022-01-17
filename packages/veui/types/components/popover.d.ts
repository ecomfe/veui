import { VeuiDefineInstance, UiMixin, OverlayMixin, OverlayTarget } from '../common'

type Props = {
  target: OverlayTarget
  title?: string
  open?: boolean
  foot?: boolean
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

type Popover = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Popover
