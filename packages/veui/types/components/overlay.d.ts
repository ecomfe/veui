import { VeuiDefineInstance, UiMixin, FocusableMixin, OverlayPosition, OverlayTarget, OverlayClassAndStyle } from '../common'

type Props = {
  position?: OverlayPosition
  open?: boolean
  inline?: boolean
  target?: OverlayTarget
  options?: Record<keyof any, unknown>
  priority?: number
  autofocus?: boolean
  modal?: boolean
  matchWidth?: boolean
  local?: boolean
} & OverlayClassAndStyle

type Emits = {
  afteropen(): void
  afterclose(): void
  orderchange(order: number): void
  locate(): void
}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Overlay = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Overlay
