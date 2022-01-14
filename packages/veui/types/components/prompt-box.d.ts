import { VeuiDefineInstance } from '../common/context'
import { UiMixin, OverlayMixin, ControllableMixin } from '../common/mixins'
import { Props as DialogProps } from './dialog'

type Props = Pick<DialogProps, 'open' | 'title' | 'beforeClose' | 'loading' | 'disabled' | 'okLabel' | 'cancelLabel'>
  & {
    content?: string
    value?: string
    invalid?: boolean
  }

type Emits = {
  ok(value: string): unknown
  cancel(value: string): unknown
  afterclose(): unknown
}

type Mixins = [UiMixin, OverlayMixin, ControllableMixin<{
  input(value: string): unknown
}>]

type Slots = {
  default(): unknown
  title(): unknown
  foot(): unknown
}

type PromptBox = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default PromptBox
