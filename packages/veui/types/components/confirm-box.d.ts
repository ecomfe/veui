import { VeuiDefineInstance } from '../common/context'
import { UiMixin, OverlayMixin } from '../common/mixins'
import { Props as DialogProps, Slots } from './dialog'

type Props = Pick<DialogProps, 'open' | 'title' | 'beforeClose' | 'loading' | 'disabled' | 'okLabel' | 'cancelLabel'>

type Emits = {
  ok(): unknown
  cancel(): unknown
  afterclose(): unknown
}

type Mixins = [UiMixin, OverlayMixin]

type ConfirmBox = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default ConfirmBox
