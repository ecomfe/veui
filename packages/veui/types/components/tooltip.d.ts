import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayMixin,
  ControllableMixin,
  OverlayTarget,
  OverlayPosition
} from '../common'

type Props = {
  target: OverlayTarget
  position?: OverlayPosition
  trigger?: string
  hideDelay?: number
  open?: boolean
  interactive?: boolean
  autofocus?: boolean
  aimCenter?: boolean
}

type Emits = {}

type Mixins = [
  UiMixin,
  OverlayMixin,
  ControllableMixin<{
    toggle(open: boolean): void
  }>
]

type Slots = {
  default(): unknown
}

type Tooltip = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Tooltip
