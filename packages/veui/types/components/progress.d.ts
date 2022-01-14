import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type Props = {
  type?: string
  radius?: number
  strokeWidth?: number
  indeterminate?: boolean
  desc?: boolean
  value?: number
  decimalPlace?: number
  min?: number
  max?: number
  status?: string
  autosucceed?: boolean | number
}

type Emits = {}

type Mixins = UiMixin

type SlotProps = {
  percent: number
  value: number
  status: string
}

type Slots = {
  default(slotProps: SlotProps): unknown
  after(slotProps: SlotProps): unknown
}

type Progress = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Progress
