import {
  VeuiDefineComponent,
  VeuiDefineInstance,
  UiMixin,
  FocusableMixin
} from '../common'

type TagColor = 'turquoise' | 'violet' | 'green'

type Props = {
  color?: TagColor
  status?: string
  selectable?: boolean
  selected?: boolean
  removable?: boolean
  removed?: boolean
  disabled?: boolean

  /** @deprecated */
  type?: string
}

type Emits = {
  remove(): void
}

type Mixins = [UiMixin, FocusableMixin]

type Slots = {
  default(): unknown
}

type Tag = VeuiDefineComponent<{
  new (...args: any[]): VeuiDefineInstance<Props, Emits, Slots, Mixins>
}>

export default Tag
export type TagProps = InstanceType<Tag>['$props']
export type TagEmits = Emits
