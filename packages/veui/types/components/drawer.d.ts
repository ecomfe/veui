import { VeuiDefineInstance, UiMixin, OverlayMixin } from '../common'
import { Props as DialogProps, Emits, Slots } from './dialog'

type Props = Omit<DialogProps, 'draggable'> & {
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

type Mixins = [UiMixin, OverlayMixin]

type Drawer = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Drawer
