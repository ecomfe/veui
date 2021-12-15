import { VeuiDefineInstance } from '../common/context'
import { UiMixin, OverlayMixin } from '../common/mixins'
import { Props as DialogProps, Emits, Slots } from './dialog'

type Props = Omit<DialogProps, 'draggable'> & {
  placement?: 'top' | 'right' | 'bottom' | 'left',
}

type Mixins = [UiMixin, OverlayMixin]

type Drawer = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Drawer
