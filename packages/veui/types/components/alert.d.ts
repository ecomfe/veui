import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {
  type?: string
  title?: string
  message?: string | Array<string>
  closable?: boolean
  open?: boolean
  index?: number
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
  title(): unknown
  extra(): unknown
  content(): unknown
}

type Alert = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Alert
