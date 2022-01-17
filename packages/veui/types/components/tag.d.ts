import { VeuiDefineInstance, UiMixin, FocusableMixin } from '../common'

type Props = {
    type?: string
    selectable?: boolean
    selected?: boolean
    removable?: boolean
    removed?: boolean
    disabled?: boolean
}

type Emits = {
  remove(): void
}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Tag = {
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}

export default Tag
