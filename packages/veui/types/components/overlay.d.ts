import { VeuiDefineInstance } from '../common/context'
import { UiMixin, FocusableMixin } from '../common/mixins'
import { ComponentPublicInstance } from '@vue/runtime-dom'

export type TargetType = string | HTMLElement | ComponentPublicInstance | any // $refs.xxx 好像不能识别

type Props = {
  position?: string
  overlayClass?: unknown
  overlayStyle?: unknown
  open?: boolean
  inline?: boolean
  target?: TargetType
  options?: Record<keyof any, unknown>
  priority?: number
  autofocus?: boolean
  modal?: boolean
  matchWidth?: boolean
  local?: boolean
}

type Emits = {
  afteropen(): unknown
  afterclose(): unknown
  orderchange(order: number): unknown
  locate(): unknown
}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Overlay = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Overlay
