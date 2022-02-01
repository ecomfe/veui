import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayMixin,
  ControllableMixin
} from '../common'
import { Props as DialogProps } from './dialog'

type Props = Pick<
  DialogProps,
  | 'open'
  | 'title'
  | 'beforeClose'
  | 'loading'
  | 'disabled'
  | 'okLabel'
  | 'cancelLabel'
> & {
  content?: string
  value?: string
  invalid?: boolean
}

type Emits = {
  ok(value: string): void
  cancel(): void
  afteropen(): void
  afterclose(): void
}

type Mixins = [
  UiMixin,
  OverlayMixin,
  ControllableMixin<{
    input(value: string): void
  }>
]

type Slots = {
  default(): unknown
  title(): unknown
  foot(): unknown
}

type PromptBox = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default PromptBox
