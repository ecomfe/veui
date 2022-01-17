import { VeuiDefineInstance, UiMixin, Status } from '../common'

type BadgeType = Status | 'aux'

type Props = {
  value?: number | string
  max?: number
  hidden?: boolean
  type?: BadgeType
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
