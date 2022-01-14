import { VeuiDefineInstance } from '../common/context'
import { UiMixin, FocusableMixin } from '../common/mixins'

type Props = {
    type?: string
    selectable?: boolean
    selected?: boolean
    removable?: boolean
    removed?: boolean
    disabled?: boolean
}

type Emits = {
  remove(): unknown
}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Tag = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tag
