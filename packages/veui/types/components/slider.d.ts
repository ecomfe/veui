import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props<T = number> = {
  value?: T
  secondaryProgress?: number | Array<number>
  min?: number
  max?: number
  step?: number
  mark?: boolean
  vertical?: boolean
  parse?: (val: T) => number
  format?: (val: number) => T
}

type Emits = {
  input(value: unknown): void
}

type Mixins = UiMixin

type Slots = {
  track(): unknown
  thumb(slotProps: {
    index: number
    focus: boolean
    hover: boolean
    dragging: boolean
  }): unknown
  tip(slotProps: {
    target: HTMLElement
    open: boolean
    activeIndex: number
  }): unknown
  'tip-label'(): unknown
}

type Slider = VeuiDefineComponent<{
  new <T = number>(...args: any[]): VeuiDefineInstance<
    Props<T>,
    Emits,
    Slots,
    Mixins
  >
}>

export default Slider
