import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

type Props<T = number> = {
  value?: T
  secondaryProgress?: number | Array<number>
  min?: number
  max?: number
  step?: number
  mark?: boolean
  parse?: (val: T) => number
  format?: (val: number) => T
}

type Emits = {
  input(value: unknown): unknown
}

type Mixins = UiMixin

type Slots = {
  track(): unknown
  thumb(slotProps: { index: number, focus: boolean, hover: boolean, dragging: boolean }): unknown
  tip(slotProps: { target: HTMLElement, open: boolean, activeIndex: number }): unknown
  tipLabel(): unknown
}

type Slider = {
  new <T = number>(...args: any[]): VeuiDefineInstance<Props<T>, Emits, Slots, Mixins>
}

export default Slider
