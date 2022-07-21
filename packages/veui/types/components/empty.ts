import { VeuiDefineComponent, VeuiDefineInstance, UiMixin } from '../common'

type Props = {
  image?: object | false
  title?: string
  desc?: string | false
}

type Emits = {}

type Slots = {
  default(): unknown
  title(): unknown
  desc(): unknown
  actions(): unknown
}

type Mixins = [UiMixin]

type Empty = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Empty
