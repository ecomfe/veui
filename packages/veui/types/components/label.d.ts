import { VeuiDefineInstance } from '../common/context'
import { UiMixin } from '../common/mixins'
import { ComponentPublicInstance } from '@vue/runtime-dom'

type Props = {
  for?: string | ComponentPublicInstance | HTMLElement | any // $refs.xxx 好像识别不了
}

type Emits = {}

type Mixins = UiMixin

type Slots = {
  default(): unknown,
}

type Label = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Label
