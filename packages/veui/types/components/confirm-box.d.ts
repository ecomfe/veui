import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayMixin
} from '../common'
import { Props as DialogProps, Slots } from './dialog'

type Props = Pick<
  DialogProps,
  | 'open'
  | 'title'
  | 'beforeClose'
  | 'loading'
  | 'disabled'
  | 'okLabel'
  | 'cancelLabel'
>

type Emits = {
  ok(): void
  cancel(): void
  afteropen(): void
  afterclose(): void
}

type Mixins = [UiMixin, OverlayMixin]

type ConfirmBox = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default ConfirmBox
