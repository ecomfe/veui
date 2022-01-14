import { VeuiDefineInstance } from '../common/context'
import { UiMixin, OverlayMixin, FocusableMixin } from '../common/mixins'

export type Props = {
    modal?: boolean
    title?: string
    open?: boolean
    closable?: boolean
    escapable?: boolean
    inline?: boolean
    outsideClosable?: boolean
    draggable?: boolean
    priority?: number
    beforeClose?: (type: 'ok' | 'cancel') => Promise<boolean | undefined> | boolean | undefined
    footless?: boolean
    disabled?: boolean
    loading?: boolean
    okLabel?: string
    cancelLabel?: string
}

export type Emits = {
  afterclose(): unknown
  ok(): unknown
  cancel(): unknown
}

export type Mixins = [UiMixin, OverlayMixin, FocusableMixin]

type SlotProps = {
  close(): void
}

export type Slots = {
  title(slotProps: SlotProps): unknown
  default(slotProps: SlotProps): unknown
  foot(slotProps: SlotProps): unknown
}

type Dialog = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Dialog
