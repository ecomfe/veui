import { VeuiDefineInstance} from '../common/context'
import { UiMixin } from '../common/mixins'

type Props = {
  type?: 'success' | 'warning' | 'info' | 'error',
  title?: string,
  closable?: boolean,
  message?: string,
  open?: boolean,
  duration?: number
}

type Emits = {
  close(): unknown,
  ready(el: HTMLElement): unknown
}

type Mixins = UiMixin

type SlotProps = {
  close(): void
}

type Slots = {
  title(slotProps: SlotProps): unknown,
  default(slotProps: SlotProps): unknown,
}

type Toast = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Toast
