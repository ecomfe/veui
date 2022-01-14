import { VeuiDefineInstance } from '../common/context'
import { UiMixin, OverlayMixin, ControllableMixin } from '../common/mixins'
import { TargetType } from './overlay'

type Props = {
  target: TargetType
  position?: string
  trigger?: string
  hideDelay?: number
  open?: boolean
  interactive?: boolean
  autofocus?: boolean
  aimCenter?: boolean
}

type Emits = {}

type Mixins = [UiMixin, OverlayMixin, ControllableMixin<{
  toggle(open: boolean): unknown
}>]

type Slots = {
  default(): unknown
}

type Tooltip = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tooltip
