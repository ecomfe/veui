import { VeuiDefineInstance } from '../common/context'
import { UiMixin, OverlayMixin } from '../common/mixins'
import { TargetType } from './overlay'

type Props = {
  target: TargetType
  title?: string
  open?: boolean
  foot?: boolean
  okLabel?: string
  cancelLabel?: string
}

type Emits = {
  ok(): unknown
  cancel(): unknown
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
