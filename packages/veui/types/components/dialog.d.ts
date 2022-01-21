import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayMixin,
  FocusableMixin,
  BeforeClose
} from '../common'

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
  beforeClose?: BeforeClose
  footless?: boolean
  disabled?: boolean
  loading?: boolean
  okLabel?: string
  cancelLabel?: string
}

export type Emits = {
  afterclose(): void
  ok(): void
  cancel(): void
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

type Dialog = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Dialog
