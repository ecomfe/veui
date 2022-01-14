import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'

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

type Alert = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Alert
