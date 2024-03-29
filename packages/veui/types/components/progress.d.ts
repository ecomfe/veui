import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

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

type Progress = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Progress
