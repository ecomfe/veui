import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  FocusableMixin
} from '../common'

type Props = {
  disabled?: boolean
  name?: string
  type?: string
  value?: string
  loading?: boolean
}

type Emits = {}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Button = VeuiDefineComponent<{
  new (...args: any): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Button
