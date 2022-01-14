import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type AlertBoxType = 'success' | 'error' | 'info' | 'warning'

type Props = {
  type?: AlertBoxType
  open?: boolean
  title?: string
  beforeClose?: (type: 'ok' | 'cancel') => boolean | Promise<boolean>
  loading?: boolean
  disabled?: boolean
  okLabel?: string
}

type Emits = {
  ok(): unknown
  afterclose(): unknown
}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  title(): unknown
  foot(): unknown
}

type AlertBox = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default AlertBox
