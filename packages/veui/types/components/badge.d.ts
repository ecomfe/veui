import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  Status
} from '../common'

type BadgeStatus = Status | 'aux'

type Props = {
  status?: BadgeStatus
  value?: number | string
  max?: number
  hidden?: boolean

  /** @deprecated */
  type?: BadgeStatus
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type Badge = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Badge
