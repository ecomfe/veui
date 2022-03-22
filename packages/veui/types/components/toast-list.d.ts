import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  OverlayMixin
} from '../common'

type Props = {}

type Emits = {}

type Mixins = OverlayMixin

type Slots = {}

type ToastList = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default ToastList
