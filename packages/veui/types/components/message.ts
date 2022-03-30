import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {
  status?: 'success' | 'error' | 'info' | 'warning' | 'aux'
  display?: 'normal' | 'popup' | 'simple' | 'standalone'
}

type Emits = {}

type Slots = {
  default(): unknown
}

type Mixins = [UiMixin]

type Message = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Message
