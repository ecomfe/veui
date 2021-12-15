import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type DlsBadgeType = 'info' | 'success' | 'warning' | 'error' | 'aux'

type Props = {
  value?: number | string,
  max?: number,
  hidden?: boolean,
  type?: DlsBadgeType
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown,
}

type Badge = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Badge
