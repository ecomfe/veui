import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  OverlayTarget
} from '../common'

type Props = {
  for?: OverlayTarget
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown
}

type Label = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Label
