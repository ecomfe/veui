import { VeuiDefineInstance, UiMixin, Status } from '../common'

type Props = {
  type?: Status
  title?: string
  closable?: boolean
  message?: string
  open?: boolean
  duration?: number
}

type Emits = {
  close(): void
  ready(el: HTMLElement): void
}

type Mixins = UiMixin

type SlotProps = {
  close(): void
}

type Slots = {
  title(slotProps: SlotProps): unknown
  default(slotProps: SlotProps): unknown
}

type Toast = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Toast
